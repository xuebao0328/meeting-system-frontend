import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8088/api',
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
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        default:
          console.error('请求错误: ', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// 获取用户列表
export const getUsers = () => {
  return api.get('/auth/users');
};

// 获取所有用户 (与getUsers同功能，为了兼容性)
export const getAllUsers = () => {
  return api.get('/auth/users');
};

export default {
  getUsers,
  getAllUsers
}; 