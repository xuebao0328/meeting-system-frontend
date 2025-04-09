import { login, getUserInfo } from '@/api'
import { getToken, setToken } from '@/utils/auth'

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
    const { username, password, uuid, code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, uuid, code }).then(data => {
        commit('SET_TOKEN', data.token)
        setToken(data.token)
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
      setToken(null)
      resolve()
    })
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(data => {

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, user: userInfo } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        

        commit('SET_ROLES', roles)
        commit('SET_USER_INFO', userInfo)
        commit('SET_HAS_GET_INFO', true)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
