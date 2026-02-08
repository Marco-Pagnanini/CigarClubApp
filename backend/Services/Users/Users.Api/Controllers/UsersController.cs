using Microsoft.AspNetCore.Mvc;
using Users.Application.Abstractions.Service;
using Users.Application.Dtos;


namespace Users.Api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }
        /// <summary>
        /// GET /api/users — ottiene la lista di tutti gli utenti.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetUsers(
            CancellationToken cancellationToken)
        {
            var users = await _userService.GetUsers(cancellationToken);
            return Ok(users);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<UserDto>> GetUserById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var user = await _userService.GetUserById(id, cancellationToken);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

    }
}
