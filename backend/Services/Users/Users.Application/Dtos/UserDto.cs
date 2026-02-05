using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Users.Application.Dtos
{
    public class UserDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
        public DateTime CreateAt { get; set; }
    }
}
