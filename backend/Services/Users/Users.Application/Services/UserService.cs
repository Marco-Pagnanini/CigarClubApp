using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Users.Application.Abstractions.Repository;
using Users.Application.Abstractions.Service;
using Users.Application.Dtos;
using Users.Core.Entities;

namespace Users.Application.Services
{
    public class UserService : IUserService
    {

        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<List<UserDto>> GetUsers(CancellationToken cancellationToken = default)
        {
            List<UserDto> users = new List<UserDto>();

            var entities = await _userRepository.GetAll(cancellationToken);

            foreach (var entity in entities)
            {
                users.Add(new UserDto
                {
                    Email = entity.Email,
                    Name = entity.FirstName,
                    Role = entity.Role,
                    CreateAt = entity.CreatedAt.DateTime
                });
            }

            return users;
        }

        public async Task<UserDto?> GetUserById(Guid id, CancellationToken cancellationToken = default)
        {
            var entity = await _userRepository.GetByIdAsync(id, cancellationToken);
            if (entity == null)
            {
                return null;
            }
            return new UserDto
            {
                Email = entity.Email,
                Name = entity.FirstName,
                Role = entity.Role,
                CreateAt = entity.CreatedAt.DateTime
            };
        }
    }
}
