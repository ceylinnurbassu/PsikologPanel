
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;
using Grpc.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 🔹 Firebase Project ID
var projectId = "addictiontracker-aba95";

// 🔹 Firebase Admin SDK
if (FirebaseApp.DefaultInstance == null)
{
    var firebaseJson = Environment.GetEnvironmentVariable("FIREBASE_CONFIG_JSON");
    
    if (!string.IsNullOrEmpty(firebaseJson)) {
        // Render üzerinde çalışırken (Environment Variable'dan okur)
        FirebaseApp.Create(new AppOptions { Credential = GoogleCredential.FromJson(firebaseJson) });
    } else if (File.Exists("firebase-config.json")) {
        // Localde çalışırken (Dosyadan okur)
        FirebaseApp.Create(new AppOptions { Credential = GoogleCredential.FromFile("firebase-config.json") });
    }
}

// 🔹 Firestore DI
builder.Services.AddSingleton(provider =>
{
    var firebaseJson = Environment.GetEnvironmentVariable("FIREBASE_CONFIG_JSON");
    GoogleCredential credential;

    if (!string.IsNullOrEmpty(firebaseJson)) {
        credential = GoogleCredential.FromJson(firebaseJson);
    } else {
        credential = GoogleCredential.FromFile("firebase-config.json");
    }

    credential = credential.CreateScoped("https://www.googleapis.com/auth/datastore");
    var client = new FirestoreClientBuilder { ChannelCredentials = credential.ToChannelCredentials() }.Build();
    return FirestoreDb.Create(projectId, client);
});

// 🔹 CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowReact",
//         policy => policy
//             .WithOrigins("http://localhost:5173")
//             .AllowAnyMethod()
//             .AllowAnyHeader());
// });
var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .WithOrigins(allowedOrigins)
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// 🔹 Firebase JWT doğrulama
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

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// 🔐 🔐 🔐 SWAGGER + JWT AUTHORIZATION (EN KRİTİK KISIM)
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PsikologProje.API",
        Version = "v1"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Firebase JWT token giriniz. Sadece tokenı yapıştırın (Bearer yazmayın)."
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReact");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
