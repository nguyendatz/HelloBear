using System.Linq.Expressions;
using System.Threading;
using AutoMapper.QueryableExtensions;
using HelloBear.Application.Common.Models.Paging;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Common.Extensions;

public static class EntityFrameworkExtensions
{
    public static Task<PaginatedList<TDestination>> ProjectToPaginatedListAsync<TSource, TDestination>(this IQueryable<TSource> query, PageQueryBase pagingQuery, AutoMapper.IConfigurationProvider mapperConfiguration, CancellationToken cancellationToken = default) where TDestination : class
     => query.ProjectToPaginatedListAsync<TSource, TDestination>(pagingQuery.PageNumber, pagingQuery.PageSize, mapperConfiguration, pagingQuery.SortCriteria, cancellationToken);

    public static Task<PaginatedList<TDestination>> ProjectToPaginatedListAsync<TSource, TDestination>(this IQueryable<TSource> query, int pageNumber, int pageSize, AutoMapper.IConfigurationProvider mapperConfiguration, IEnumerable<SortCriteria>? sortCriteria = null, CancellationToken cancellationToken = default) where TDestination : class
     => query.ProjectTo<TDestination>(mapperConfiguration).ToPaginatedListAsync(pageNumber, pageSize, sortCriteria, cancellationToken);

    public static Task<PaginatedList<T>> ToPaginatedListAsync<T>(this IQueryable<T> query, PageQueryBase pagingQuery, CancellationToken cancellationToken = default) where T : class
        => query.ToPaginatedListAsync(pagingQuery.PageNumber, pagingQuery.PageSize, pagingQuery.SortCriteria, cancellationToken);

    public static Task<PaginatedList<T>> ToPaginatedListAsync<T>(this IQueryable<T> query, int pageNumber, int pageSize, IEnumerable<SortCriteria>? sortCriteria = null, CancellationToken cancellationToken = default) where T : class
        => CreateAsync(query.AsNoTracking(), pageNumber, pageSize, sortCriteria, cancellationToken);

    public static async Task<PaginatedList<T>> CreateAsync<T>(this IQueryable<T> source, int pageNumber, int pageSize, IEnumerable<SortCriteria>? sortCriteria, CancellationToken cancellationToken = default)
    {
        var count = await source.CountAsync();
        var itemsQuery = source.Skip((pageNumber - 1) * pageSize).Take(pageSize);

        if (!sortCriteria.IsNullOrEmpty())
        {
            itemsQuery = itemsQuery.SortBy(sortCriteria);
        }

        var items = await itemsQuery.ToListAsync(cancellationToken);

        return new PaginatedList<T>(items.AsReadOnly(), count, pageNumber, pageSize);
    }

    public static IQueryable<T> SortBy<T>(this IQueryable<T> source, IEnumerable<SortCriteria>? sortingList)
    {
        if (sortingList is null || !sortingList.Any())
        {
            return source;
        }

        var expression = source.Expression;
        var count = 0;
        var type = typeof(T);

        foreach (var item in sortingList)
        {
            var propertyName = item.SortKey.FirstCharToUpper();
            var propertyType = type.GetProperty(propertyName)?.PropertyType;

            if (propertyType is null)
            {
                continue;
            }

            var param = Expression.Parameter(type, "x");
            Expression parent = param;

            var keyParts = propertyName.Split('.');

            for (int i = 0; i < keyParts.Length; i++)
            {
                var keyPart = keyParts[i].FirstCharToUpper();
                parent = Expression.Property(parent, keyPart);

                if (keyParts.Length > 1)
                {
                    var partType = i == 0 ? type : propertyType;
                    propertyType = partType?.GetProperty(keyPart)?.PropertyType;
                }
            }

            var method = (item.IsDescending, count) switch
            {
                (true, 0) => "OrderByDescending",
                (true, _) => "ThenByDescending",
                (false, 0) => "OrderBy",
                (_, _) => "ThenBy"
            };

            expression = Expression.Call(typeof(Queryable), method,
                new Type[] { type, propertyType! },
                expression, CreateExpression(type, propertyName));

            count++;
        }
        return count > 0 ? source.Provider.CreateQuery<T>(expression) : source;
    }

    private static LambdaExpression CreateExpression(Type type, string propertyName)
    {
        var param = Expression.Parameter(type, "x");
        Expression body = param;

        foreach (var member in propertyName.Split('.'))
        {
            body = Expression.PropertyOrField(body, member);
        }

        return Expression.Lambda(body, param);
    }

    private static string FirstCharToUpper(this string input) => input switch
    {
        null => throw new ArgumentNullException(nameof(input)),
        "" => throw new ArgumentException($"{nameof(input)} cannot be empty", nameof(input)),
        _ => input.First().ToString().ToUpper() + input.Substring(1)
    };
}