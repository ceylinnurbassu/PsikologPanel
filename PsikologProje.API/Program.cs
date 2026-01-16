// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using PsikologProje.API.Data;
// using FirebaseAdmin;
// using Google.Apis.Auth.OAuth2;

// var builder = WebApplication.CreateBuilder(args);

// // 1. Veritabanı
// var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// builder.Services.AddDbContext<AppDbContext>(options =>
//     options.UseSqlite(connectionString));

// // 2. Identity Yapılandırması (Geleneksel Yöntem)
// builder.Services.AddIdentity<IdentityUser, IdentityRole>()
//     .AddEntityFrameworkStores<AppDbContext>()
//     .AddDefaultTokenProviders();

// builder.Services.AddCors(options => {
//     options.AddPolicy("AllowReact", policy => 
//         policy.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader());
// });

// // 3. Firebase
// if (FirebaseApp.DefaultInstance == null) {
//     FirebaseApp.Create(new AppOptions() {
//         Credential = GoogleCredential.FromFile("firebase-config.json")
//     });
// }

// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// var app = builder.Build();

// // HATA VEREN MapIdentityApiEndpoints SATIRINI SİLDİK!

// if (app.Environment.IsDevelopment()) {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseHttpsRedirection();
// app.UseCors("AllowReact");
// app.UseAuthentication();
// app.UseAuthorization();
// app.MapControllers();
// // Veritabanını otomatik oluşturma bloğu
// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     var context = services.GetRequiredService<AppDbContext>();
//     context.Database.EnsureCreated(); // Eğer tablo yoksa otomatik oluşturur
// }


// app.Run();
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// --- KONFİGÜRASYON BAŞLANGICI ---
var projectId = "addictiontracker-aba95"; // Senin Firebase Proje Kimliğin
// --------------------------------

// 1. Firebase Admin SDK Başlatma
if (FirebaseApp.DefaultInstance == null)
{
    FirebaseApp.Create(new AppOptions()
    {
        // firebase-config.json dosyasının projenin ana dizininde olduğundan emin ol
        Credential = GoogleCredential.FromFile("firebase-config.json")
    });
}

// 2. CORS Ayarları (React tarafının API'ye erişebilmesi için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 3. Firebase Authentication (JWT) Doğrulama Yapılandırması
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = $"https://securetoken.google.com/{projectId}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://securetoken.google.com/{projectId}",
            ValidateAudience = true,
            ValidAudience = projectId,
            ValidateLifetime = true
        };
    });

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Middleware Sıralaması
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Güvenlik ve Erişim Sıralaması Kritiktir
app.UseCors("AllowReact"); 

app.UseAuthentication(); // Gelen kullanıcının kimliğini doğrula
app.UseAuthorization();  // Kullanıcının yetkilerini kontrol et

app.MapControllers();

app.Run();