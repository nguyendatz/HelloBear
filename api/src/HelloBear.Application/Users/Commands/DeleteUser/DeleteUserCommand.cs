using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HelloBear.Application.Users.Commands.DeleteUser;

public record DeleteUserCommand(string Id) : IRequest<OperationResult>;

public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, OperationResult>
{
    private readonly IApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public DeleteUserCommandHandler(IApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<OperationResult> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var entity = await _userManager.FindByIdAsync(request.Id);

        if (entity == null)
        {
            return OperationResult.NotFoundWithEntityName($"{nameof(ApplicationUser)} with Id:{request.Id}");
        }

        _context.Users.Remove(entity);
        await _context.SaveChangesAsync(cancellationToken);

        return OperationResult.NoContent();
    }

}
