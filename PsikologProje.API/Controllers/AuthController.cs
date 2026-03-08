
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;

namespace PsikologProje.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthModel model)
        {
            try
            {
                var user = await FirebaseAuth.DefaultInstance.CreateUserAsync(
                    new UserRecordArgs
                    {
                        Email = model.Email,
                        Password = model.Password,
                        EmailVerified = false
                    });

                // 🔥 ROLE EKLEME
                await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(
                    user.Uid,
                    new Dictionary<string, object>
                    {
                        { "role", "psychologist" }
                    });

                return Ok(new
                {
                    message = "Psikolog başarıyla kaydedildi",
                    uid = user.Uid
                });
            }
            catch (FirebaseAuthException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class AuthModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
