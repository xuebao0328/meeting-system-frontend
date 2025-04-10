import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: "http://localhost:8088",
  timeout: 3600000,
});

service.interceptors.request.use(
  config => {
    
    if (store.getters.token) {
      config.headers["Authorization"] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 401) {
      store.dispatch('user/logout').then(() => {
        location.reload()
      })
    } else if (res.code === 200) {
      return res
    } else if (!res.code) {
      return res
    } else {
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  error => {
    
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
