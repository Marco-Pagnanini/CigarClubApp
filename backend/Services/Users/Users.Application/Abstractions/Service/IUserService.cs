using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Dtos;

namespace Users.Application.Abstractions.Service
{
    public interface IUserService
    {
        Task<List<UserDto>> GetUsers(CancellationToken cancellationToken = default);
        Task<UserDto?> GetUserById(Guid id, CancellationToken cancellationToken = default);
        Task<Guid?> GetUserByEmail(string email, CancellationToken cancellationToken = default);
    }
}
