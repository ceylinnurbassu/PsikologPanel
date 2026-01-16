// using Microsoft.AspNetCore.Identity;
// using Microsoft.AspNetCore.Mvc;

// namespace PsikologProje.API.Controllers
// {
//     [Route("api/[controller]")]
//     [ApiController]
//     public class AuthController : ControllerBase
//     {
//         private readonly UserManager<IdentityUser> _userManager;
//         private readonly SignInManager<IdentityUser> _signInManager;

//         public AuthController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
//         {
//             _userManager = userManager;
//             _signInManager = signInManager;
//         }

//         [HttpPost("register")]
//         public async Task<IActionResult> Register([FromBody] RegisterModel model)
//         {
//             var user = new IdentityUser { UserName = model.Email, Email = model.Email };
//             var result = await _userManager.CreateAsync(user, model.Password);

//             if (result.Succeeded) return Ok(new { message = "Kayıt Başarılı" });
//             return BadRequest(result.Errors);
//         }

//         [HttpPost("login")]
//         public async Task<IActionResult> Login([FromBody] LoginModel model)
//         {
//             var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
//             if (result.Succeeded) return Ok(new { message = "Giriş Başarılı" });
//             return Unauthorized();
//         }
//     }

//     public class RegisterModel 
// { 
//     public required string Email { get; set; } 
//     public required string Password { get; set; } 
// }

// public class LoginModel 
// { 
//     public required string Email { get; set; } 
//     public required string Password { get; set; } 
// }
//     }
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;

namespace PsikologProje.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthModel model)
        {
            try
            {
                var userArgs = new UserRecordArgs()
                {
                    Email = model.Email,
                    Password = model.Password,
                    EmailVerified = false,
                };

                UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(userArgs);
                return Ok(new { message = "Psikolog başarıyla Firebase'e kaydedildi", uid = userRecord.Uid });
            }
            catch (FirebaseAuthException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        // Giriş işlemi genellikle güvenlik nedeniyle Frontend tarafında (React) yapılır.
        // Backend burada sadece gelen Token'ı doğrulamakla görevlidir.
    }

    public class AuthModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}