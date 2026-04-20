using FluentValidation;
using Users.Application.Dtos;

namespace Users.Application.Abstractions.Validation;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email obbligatoria.")
            .EmailAddress().WithMessage("Formato email non valido.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password obbligatoria.");
    }
}
