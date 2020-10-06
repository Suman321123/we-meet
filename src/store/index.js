import Vue from 'vue'
import Vuex from 'vuex'
import vueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(vueResource)

export default new Vuex.Store({
  namespaced: true,
  state: {
    userInfo: {},
    usersInRoomList: []
  },
  mutations: {
    setUserInfo (state, payload) {
      state.userInfo = payload || {}
    },
    setUserToRoom (state, payload) {
      state.usersInRoomList.push(payload)
    },
    removeUserFromRoom (state, payload) {
      const userList = state.usersInRoomList
      const index = userList.findIndex(user => user.userName === payload.userName)
      state.usersInRoomList.splice(index, 1)
    },
    unsetUserList (state, payload) {
      state.usersInRoomList = []
    }
  },
  actions: {
    getRoomId({commit}, {success}) {
      Vue.http.get("http://localhost:9000/getRoomId").then((res) => {
        success && success(res.body)
      }).catch((err) => {
        alert(JSON.stringify(err))
        console.log(err)
      })
    },
    addUserToRoom ({commit}, payload) {
      commit('setUserToRoom', payload)
    },
    removerUserFromRoom ({commit}, payload) {
      commit('removeUserFromRoom', payload)
    },
    removeAllUserFromRoom ({commit}) {
      commit('unsetUserList', [])
    },
    updateUserInfo ({commit}, payload) {
      commit('setUserInfo', payload)
    }
  },
  getters: {
    userInfo (state) {
      return state.userInfo || {}
    },
    usersInRoomList (state) {
      return state.usersInRoomList || []
    }
  },
  modules: {
  }
})
