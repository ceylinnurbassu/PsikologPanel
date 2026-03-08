

using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace PsikologProje.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // 🔐 TÜM ENDPOINTLER KORUMALI
    public class AnalysisController : ControllerBase
    {
        private readonly FirestoreDb _db;

        // 🔹 Firestore DI ile geliyor
        public AnalysisController(FirestoreDb db)
        {
            _db = db;
        }

        [HttpGet("surveys")]
        public async Task<IActionResult> GetAllSurveys()
        {
            try
            {
                var snapshot = await _db
                    .Collection("surveys")
                    .GetSnapshotAsync();

                var result = snapshot.Documents.Select(doc =>
                {
                    var dict = doc.ToDictionary();
                    dict["id"] = doc.Id;

                    if (dict.TryGetValue("createdAt", out var value) &&
                        value is Timestamp ts)
                    {
                        var unixSeconds = new DateTimeOffset(ts.ToDateTime())
                            .ToUnixTimeSeconds();

                        dict["createdAt"] = new
                        {
                            seconds = unixSeconds,
                            nanoseconds = 0
                        };
                    }

                    return dict;
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}
