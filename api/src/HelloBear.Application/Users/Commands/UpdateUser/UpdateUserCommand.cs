using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Users.Commands.UpdateUser;

public record UpdateUserCommand(string Id, UpdateUserBodyRequest BodyRequest) : IRequest<OperationResult>;

public record UpdateUserBodyRequest
{
    public string Id { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string RoleId { get; set; } = string.Empty;

    public string? PhoneNumber { get; set; }

    public PhoneType? PhoneType { get; set; }
}

public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, OperationResult>
{
    private readonly IApplicationDbContext _context;

    public UpdateUserCommandHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OperationResult> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        if (request.Id != request.BodyRequest.Id)
        {
            return OperationResult.BadRequest();
        }

        var entity = await _context.Users
            .Where(x => x.Id == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        var userRole = await _context.UserRoles
            .Where(x => x.UserId == request.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (entity == null || userRole == null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(ApplicationUser)} with Id:{request.Id}");
        }

        entity.FirstName = request.BodyRequest.FirstName;
        entity.LastName = request.BodyRequest.LastName;
        entity.PhoneNumber = request.BodyRequest.PhoneNumber;
        entity.PhoneType = request.BodyRequest.PhoneType;

        _context.UserRoles.Remove(userRole);
        await _context.UserRoles.AddAsync(new ApplicationUserRole
        {
            RoleId = request.BodyRequest.RoleId,
            UserId = request.BodyRequest.Id
        }, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.NoContent();
    }
}
