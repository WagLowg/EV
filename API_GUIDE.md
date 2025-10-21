# Hướng Dẫn Kết Nối API Login với Axios

## 📋 Tổng Quan

Hệ thống login đã được tích hợp axios để kết nối với backend API. Code đã bao gồm:
- ✅ Đăng nhập (Login)
- ✅ Đăng ký (Register)
- ✅ Xử lý lỗi (Error handling)
- ✅ Loading states
- ✅ Token management với localStorage
- ✅ Auto redirect sau khi login thành công

---

## 🚀 Cài Đặt

Axios đã được cài đặt trong project. Nếu cần cài lại:

```bash
npm install axios
```

---

## 📁 Cấu Trúc Files

```
src/
├── services/
│   └── api.js          # API service với axios
└── pages/
    └── Login.jsx       # Login component đã tích hợp API
```

---

## ⚙️ Cấu Hình API

### 1. Cập nhật URL Backend

Mở file `src/services/api.js` và thay đổi `API_BASE_URL`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'; // Thay bằng URL backend của bạn
```

**Ví dụ:**
- Development: `http://localhost:8000/api`
- Production: `https://api.yourapp.com/api`
- Vercel: `https://your-backend.vercel.app/api`

### 2. Cấu Hình Timeout (Tùy chọn)

Mặc định timeout là 10 giây. Có thể điều chỉnh:

```javascript
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây
});
```

---

## 🔌 Các API Endpoints Cần Thiết

Backend của bạn cần cung cấp các endpoints sau:

### 1. **POST** `/api/auth/login`
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

**Response (Error - 401):**
```json
{
  "message": "Email hoặc mật khẩu không đúng"
}
```

### 2. **POST** `/api/auth/register`
**Request:**
```json
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

**Response (Error - 400):**
```json
{
  "message": "Email đã tồn tại trong hệ thống"
}
```

### 3. **POST** `/api/auth/logout`
**Request:** (Token trong header)
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "message": "Đăng xuất thành công"
}
```

### 4. **GET** `/api/auth/me`
**Request:** (Token trong header)
```
Authorization: Bearer <token>
```

**Response (Success - 200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "user"
}
```

---

## 💡 Cách Sử Dụng

### 1. Import API Service

```javascript
import { authAPI } from '../services/api';
```

### 2. Gọi API Login

```javascript
try {
  const response = await authAPI.login(email, password);
  
  // Lưu token
  localStorage.setItem('token', response.token);
  
  // Lưu user info
  localStorage.setItem('user', JSON.stringify(response.user));
  
  // Redirect
  navigate('/dashboard');
  
} catch (error) {
  console.error('Login error:', error);
  setError(error.response?.data?.message || 'Đăng nhập thất bại');
}
```

### 3. Gọi API Register

```javascript
try {
  const response = await authAPI.register({
    fullName: 'John Doe',
    email: 'user@example.com',
    password: 'password123'
  });
  
  // Xử lý response tương tự login
  
} catch (error) {
  console.error('Register error:', error);
  setError(error.response?.data?.message || 'Đăng ký thất bại');
}
```

### 4. Kiểm Tra User Đã Login

```javascript
const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
```

### 5. Logout

```javascript
const handleLogout = async () => {
  try {
    await authAPI.logout();
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Xóa token và user info
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    
    // Redirect về login
    navigate('/login');
  }
};
```

---

## 🔒 Authorization Headers

Token sẽ tự động được thêm vào mọi request nhờ axios interceptor:

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Điều này có nghĩa bạn không cần thêm token manually vào mỗi request!

---

## 🛠️ Xử Lý Lỗi

### 1. Lỗi từ Server (response error)
```javascript
if (err.response) {
  // Server trả về response với status code khác 2xx
  console.log(err.response.data.message);
  console.log(err.response.status);
}
```

### 2. Lỗi Network (request error)
```javascript
if (err.request) {
  // Request được gửi nhưng không nhận được response
  console.log('Không thể kết nối đến server');
}
```

### 3. Lỗi Khác
```javascript
// Lỗi trong quá trình setup request
console.log(err.message);
```

---

## 🧪 Test API

### 1. Sử dụng Postman/Thunder Client

**Test Login:**
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Kiểm Tra Console

Mở DevTools (F12) → Console tab để xem:
- Request được gửi
- Response từ server
- Errors nếu có

### 3. Kiểm Tra Network Tab

DevTools → Network tab → XHR để xem:
- Request headers
- Response data
- Status codes

---

## 📝 Các Trường Hợp Thường Gặp

### 1. CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Giải pháp:** Backend cần enable CORS:

```javascript
// Node.js Express example
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true
}));
```

### 2. 401 Unauthorized
```
Token hết hạn hoặc không hợp lệ
```

**Giải pháp:** Axios interceptor đã tự động xóa token và redirect về login.

### 3. Network Error
```
Không thể kết nối đến server
```

**Giải pháp:** 
- Kiểm tra backend có đang chạy không
- Kiểm tra URL trong `api.js` có đúng không
- Kiểm tra firewall/antivirus

---

## 🎯 Ví Dụ Backend Response Format

Để tương thích với frontend, backend nên trả về format như sau:

### Success Response
```json
{
  "success": true,
  "data": {
    "token": "...",
    "user": {...}
  },
  "message": "Đăng nhập thành công"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Email hoặc mật khẩu không đúng",
  "errors": {
    "email": "Email không hợp lệ"
  }
}
```

**Lưu ý:** Code hiện tại đang expect response trả về trực tiếp `token` và `user`. Nếu backend trả về format khác, cần điều chỉnh trong `api.js`.

---

## 🔄 Mở Rộng API

### Thêm API mới

Trong `src/services/api.js`:

```javascript
export const userAPI = {
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/users/change-password', {
      oldPassword,
      newPassword
    });
    return response.data;
  }
};
```

### Sử dụng

```javascript
import { userAPI } from '../services/api';

const handleUpdateProfile = async () => {
  try {
    const response = await userAPI.updateProfile({
      fullName: 'New Name',
      phone: '0123456789'
    });
    console.log('Profile updated:', response);
  } catch (error) {
    console.error('Update error:', error);
  }
};
```

---

## 📱 Best Practices

1. **Luôn validate input** trước khi gửi request
2. **Hiển thị loading state** khi đang gọi API
3. **Xử lý errors** một cách user-friendly
4. **Không log sensitive data** (password, token) ra console
5. **Sử dụng environment variables** cho API URL:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

Tạo file `.env`:
```
VITE_API_URL=http://localhost:8000/api
```

---

## 🐛 Debugging

### Enable axios logging

```javascript
api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});
```

---

## 📞 Liên Hệ

Nếu có vấn đề, hãy kiểm tra:
1. Console logs
2. Network tab trong DevTools
3. Backend logs
4. API documentation của backend

---

**Chúc bạn code vui vẻ! 🚀**


