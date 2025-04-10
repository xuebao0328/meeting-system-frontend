import { login as loginApi } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken(),
  userInfo: {},
  roles: [],
  hasGetInfo: false
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_HAS_GET_INFO: (state, hasGetInfo) => {
    state.hasGetInfo = hasGetInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginApi({ 
        loginMethod: 'account',
        account: username.trim(), 
        password: password 
      }).then(response => {
        const { token, user } = response
        commit('SET_TOKEN', token)
        commit('SET_USER_INFO', user)
        commit('SET_ROLES', ['user']) // 默认角色
        commit('SET_HAS_GET_INFO', true)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('SET_TOKEN', null)
      commit('SET_USER_INFO', {})
      commit('SET_ROLES', [])
      commit('SET_HAS_GET_INFO', false)
      removeToken()
      resolve()
    })
  },
  
  // get user info - we already get it during login
  getInfo({ commit, state }) {
    return new Promise((resolve) => {
      // 如果已经有用户信息，直接返回
      if (state.hasGetInfo) {
        resolve({ roles: state.roles, user: state.userInfo })
        return
      }
      
      // 否则，返回基本信息
      const userInfo = {
        name: 'User',
        avatar: ''
      }
      const roles = ['user']
      
      commit('SET_ROLES', roles)
      commit('SET_USER_INFO', userInfo)
      commit('SET_HAS_GET_INFO', true)
      resolve({ roles, user: userInfo })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
