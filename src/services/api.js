import axios from 'axios';

// Cấu hình base URL cho API
// - Ở development, bạn có thể dùng proxy (ví dụ: '/api') hoặc trực tiếp localhost
// - Ở production, set VITE_API_BASE_URL thành ví dụ: 'https://your-backend.onrender.com'
const rawBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:10000' : 'https://ev-service-center-maintance-management-um2j.onrender.com');

// Đảm bảo base URL không có trailing slash và nối /api nếu chưa có
const normalized = String(rawBase).replace(/\/$/, '');
const API_BASE_URL = normalized.endsWith('/api') ? normalized : `${normalized}/api`;

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 giây timeout
});

// Thêm interceptor để tự động gắn token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response và errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Có thể redirect về trang login nếu cần
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Đăng nhập
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Đăng ký
  register: async (userData) => {
    const response = await api.post('/Users', userData);
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset mật khẩu
  resetPassword: async (token, password) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },
};

// Các API khác (booking, services, etc.)
export const bookingAPI = {
  // Tạo booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Lấy danh sách bookings
  getBookings: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },

  // Lấy chi tiết booking
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Cập nhật booking
  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  // Hủy booking
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export default api;

