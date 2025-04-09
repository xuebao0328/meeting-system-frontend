import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页面
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 权限不足
          console.error('没有权限访问该资源');
          break;
        default:
          console.error('服务器错误');
      }
    }
    return Promise.reject(error);
  }
);

// 登录接口
export const login = (data) => {
  const { loginMethod, ...loginData } = data;
  
  // 根据不同的登录方式调用不同的接口
  if (loginMethod === 'phone') {
    return api.post('/login', {
      loginMethod: 'phone',
      phone: loginData.phone,
      verificationCode: loginData.verificationCode
    });
  } else {
    return api.post('/login', {
      loginMethod: 'account',
      username: loginData.username,
      password: loginData.password
    });
  }
};

// 注册接口
export const register = (data) => {
  const { registerMode, ...registerData } = data;
  
  if (registerMode === 'phone') {
    return api.post('/register', {
      phone: registerData.account,
      verificationCode: registerData.verificationCode
    });
  } else {
    return api.post('/register', {
      email: registerData.account,
      password: registerData.password
    });
  }
};

// 发送验证码
export const sendVerificationCode = (phone) => {
  return api.post('/send-code', { phone });
};

// 验证用户 token
export const verifyToken = () => {
  return api.get('/verify');
};

// 退出登录
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// 错误处理函数
export const handleApiError = (error) => {
  if (error.response && error.response.data) {
    return error.response.data.message || '服务器错误';
  }
  return error.message || '网络错误';
};

export default {
  login,
  register,
  sendVerificationCode,
  verifyToken,
  logout,
  handleApiError
}; 