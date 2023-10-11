using AutoMapper;
using HelloBear.Application.Common.Extensions;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Common.Models.Paging;
using HelloBear.Application.TextBooks.Queries.GetTextbooksWithPagination;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Textbooks.Commands.GetAllTextBooks;

public record GetAllTextBooksCommand() : IRequest<List<TextBookQueryResponse>>;
public class GetAllTextBooksCommandHandler : IRequestHandler<GetAllTextBooksCommand, List<TextBookQueryResponse>>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly IMapper _mapper;

    public GetAllTextBooksCommandHandler(IApplicationDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public async Task<List<TextBookQueryResponse>> Handle(GetAllTextBooksCommand request, CancellationToken cancellationToken)
    {
        var query = _dbContext.TextBooks;
        var result = await _mapper.ProjectTo<TextBookQueryResponse>(query).ToListAsync();
        return result;
    }
}