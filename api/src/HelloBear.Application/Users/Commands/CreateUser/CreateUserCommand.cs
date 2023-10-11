using System.Net.Mail;
using HelloBear.Application.Common.Interfaces;
using HelloBear.Application.Common.Models.OperationResults;
using HelloBear.Application.Settings;
using HelloBear.Application.Users.EventHandlers.SendInvitation;
using HelloBear.Domain.Entities;
using HelloBear.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace HelloBear.Application.Users.Commands.CreateUser;

public record CreateUserCommand : IRequest<OperationResult<string>>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string RoleId { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public PhoneType? PhoneType { get; set; }
}

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, OperationResult<string>>
{
    private readonly IApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IPublisher _publisher;

    public CreateUserCommandHandler(IApplicationDbContext context, UserManager<ApplicationUser> userManager, IPublisher publisher)
    {
        _context = context;
        _userManager = userManager;
        _publisher = publisher;
    }

    public async Task<OperationResult<string>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var addr = new MailAddress(request.Email);
        var user = new ApplicationUser
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            UserName = addr.User,
            PhoneType = request.PhoneType,
            DateCreated = DateTimeOffset.Now
        };


        var existingUser = await _userManager.FindByEmailAsync(request.Email);

        if (existingUser != null)
        {
            return OperationResult.BadRequest(AppConstants.ResponseCodeMessage.EmailExisted, $"The email '{request.Email}' already exists.");
        }

        var result = await _userManager.CreateAsync(user);
        if (!result.Succeeded)
        {
            return OperationResult.Error(result.Errors.First().Code, result.Errors.First().Description);
        }

        var userRole = new ApplicationUserRole
        {
            RoleId = request.RoleId,
            UserId = user.Id
        };
        await _context.UserRoles.AddAsync(userRole, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        await _publisher.Publish(new SendInvitationEvent(user), cancellationToken);

        return OperationResult.Ok(user.Id);
    }
}
