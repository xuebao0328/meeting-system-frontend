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
    // 直接返回响应数据
    const data = response.data;
    console.log('API响应拦截器处理数据:', data);
    
    // 处理204 No Content响应（通常是删除操作）
    if (response.status === 204) {
      return { success: true, message: '操作成功' };
    }
    
    // 处理纯文本响应
    if (typeof data === 'string') {
      return { 
        success: true, 
        message: data,
        code: 200
      };
    }
    
    // 如果数据包含code字段，表示是统一的响应格式
    if (data && typeof data.code !== 'undefined') {
      if (data.code === 200) {
        return data.data || data; // 返回data字段或整个响应
      } else {
        // 业务逻辑错误
        console.error('API业务逻辑错误:', data);
        return Promise.reject(new Error(data.msg || '请求失败'));
      }
    }
    
    // 处理纯文本包含错误信息的情况
    if (typeof data === 'string' && data.includes('失败')) {
      return Promise.reject(new Error(data));
    }
    
    // 否则直接返回数据
    return data;
  },
  (error) => {
    // 处理网络错误
    if (!error.response) {
      console.error('网络错误，请检查您的网络连接');
      return Promise.reject(new Error('网络错误，请检查您的网络连接'));
    }
    
    // 处理后端返回的错误
    const { status, data } = error.response;
    console.error(`API错误 ${status}:`, data);
    
    // 处理特定状态码
    if (status === 401) {
      localStorage.removeItem('token');
      console.error('登录已过期，请重新登录');
      window.location.href = '/login';
      return Promise.reject(new Error('登录已过期，请重新登录'));
    } else if (status === 403) {
      console.error('无权限访问，请确认您的账号权限');
      return Promise.reject(new Error('无权限访问，请确认您的账号权限'));
    }
    
    // 返回格式化的错误信息
    const message = (data && (data.message || data.msg)) || '服务器错误';
    return Promise.reject(new Error(message));
  }
);

// 获取会议列表
export const getMeetings = (params) => {
  return api.get('/co/meeting/list', { params });
};

// 获取单个会议详情
export const getMeeting = (id) => {
  return api.get(`/co/meeting/${id}`);
};

// 创建新会议
export const createMeeting = (data) => {
  return api.post('/co/meeting', data);
};

// 更新会议
export const updateMeeting = (data) => {
  return api.put(`/co/meeting`, data);
};

// 删除会议
export const deleteMeeting = (id) => {
  return api.delete(`/co/meeting/${id}`);
};

// 复制会议
export const copyMeeting = (id) => {
  return api.post(`/co/meeting/copy/${id}`);
};

// 统一处理API错误
export const handleApiError = (error, defaultMessage = '操作失败') => {
  // 网络错误
  if (!error.response) {
    console.error('网络错误，请检查您的网络连接');
    return '网络错误，请检查您的网络连接';
  }
  
  // 后端返回的错误
  const { status, data } = error.response;
  console.error(`API错误 ${status}:`, data);
  
  // 返回格式化的错误信息
  return (data && data.message) || defaultMessage;
};

export default {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting,
  copyMeeting,
  handleApiError
}; 