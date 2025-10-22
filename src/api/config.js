// 🔧 Cấu hình API BASE cho frontend
// Thay vì hardcode, dùng biến môi trường Vite: VITE_API_BASE_URL
// - Trên Vercel, đặt VITE_API_BASE_URL=https://<your-render-app>.onrender.com
// - Ở local, Vite sẽ dùng http://localhost:10000 nếu không có biến

// Lấy từ environment (Vite injects import.meta.env)
const ENV = import.meta.env.MODE || (import.meta.env.DEV ? 'development' : 'production');

// Nếu người deploy đặt VITE_API_BASE_URL, dùng nó. Nếu không, fallback:
// - development -> localhost
// - production  -> render URL (mặc định dự án này)
const DEFAULT_PROD_API = "https://ev-service-center-maintance-management-um2j.onrender.com";
const API_BASE = (import.meta.env.VITE_API_BASE_URL && String(import.meta.env.VITE_API_BASE_URL).trim())
  ? String(import.meta.env.VITE_API_BASE_URL).replace(/\/$/, '') // remove trailing slash
  : (import.meta.env.DEV ? "http://localhost:10000" : DEFAULT_PROD_API);

export const CONFIG = {
  ENV,
  API_BASE,
};
