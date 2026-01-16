using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Google.Apis.Auth.OAuth2;
using Grpc.Auth;
using Microsoft.AspNetCore.Mvc;

namespace PsikologProje.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalysisController : ControllerBase
    {
        private readonly FirestoreDb _db;

        public AnalysisController()
        {
            try 
            {
                // 1. Dosya yolunun çalışma dizinine göre tam doğru olduğundan emin oluyoruz
                string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "firebase-config.json");
                
                // 2. Yetkiyi dosya üzerinden alıp, kapsamını (scope) Firestore için belirliyoruz
                GoogleCredential credential = GoogleCredential.FromFile(path)
                    .CreateScoped("https://www.googleapis.com/auth/datastore");
                
                // 3. Firestore istemcisini bu yetkiyle oluşturuyoruz
                FirestoreClient client = new FirestoreClientBuilder
                {
                    ChannelCredentials = credential.ToChannelCredentials()
                }.Build();

                // 4. Veritabanı bağlantısını kuruyoruz
                _db = FirestoreDb.Create("addictiontracker-aba95", client);
            }
            catch (Exception ex)
            {
                // Constructor içinde hata olursa loglaması için (Geliştirme aşamasında yardımcı olur)
                throw new Exception($"Firestore bağlantı hatası: {ex.Message}");
            }
        }

        [HttpGet("surveys")]
        public async Task<IActionResult> GetAllSurveys()
        {
            try
            {
                CollectionReference surveysRef = _db.Collection("surveys");
                QuerySnapshot snapshot = await surveysRef.GetSnapshotAsync();
                
                var result = snapshot.Documents.Select(doc => {
                    var dict = doc.ToDictionary();
                    dict["id"] = doc.Id;
                    
                    // Timestamp dönüşümü: React tarafındaki hataları önlemek için DateTime üzerinden Unix formatına geçiyoruz
                    if (dict.ContainsKey("createdAt") && dict["createdAt"] is Google.Cloud.Firestore.Timestamp ts)
                    {
                        var dateTime = ts.ToDateTime();
                        var unixSeconds = ((DateTimeOffset)dateTime).ToUnixTimeSeconds();

                        dict["createdAt"] = new { 
                            seconds = unixSeconds, 
                            nanoseconds = 0 
                        };
                    }
                                    
                    return dict;
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }
}