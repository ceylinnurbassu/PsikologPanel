import axios from 'axios';

const api = axios.create({
  // Backend terminalinde (dotnet run sonrası) yazan localhost adresini buraya yaz
  // Genelde 5214 veya 5000 olur.
  baseURL: 'http://localhost:5214', 
});

export default api;