import Vue from 'vue'
import Vuex from 'vuex'
import vueResource from 'vue-resource'

Vue.use(Vuex)
Vue.use(vueResource)

export default new Vuex.Store({
  namespaced: true,
  state: {
  },
  mutations: {
  },
  actions: {
    getRoomId({commit}, {success}) {
      Vue.http.get("http://localhost:9000/getRoomId").then((res) => {
        success && success(res.body)
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  modules: {
  }
})
