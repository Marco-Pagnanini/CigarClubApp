using FluentValidation;
using Users.Application.Dtos;

namespace Users.Application.Abstractions.Validation;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email obbligatoria.")
            .EmailAddress().WithMessage("Formato email non valido.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password obbligatoria.")
            .MinimumLength(8).WithMessage("La password deve essere di almeno 8 caratteri.")
            .Matches("[A-Z]").WithMessage("La password deve contenere almeno una lettera maiuscola.")
            .Matches("[a-z]").WithMessage("La password deve contenere almeno una lettera minuscola.")
            .Matches("[0-9]").WithMessage("La password deve contenere almeno un numero.")
            .Matches("[^a-zA-Z0-9]").WithMessage("La password deve contenere almeno un carattere speciale.");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Nome obbligatorio.")
            .MaximumLength(50).WithMessage("Il nome non può superare 50 caratteri.");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Cognome obbligatorio.")
            .MaximumLength(50).WithMessage("Il cognome non può superare 50 caratteri.");
    }
}
