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
      Vue.http.get("http://192.168.0.101:9000/getRoomId").then((res) => {
        success && success(res.body)
      }).catch((err) => {
        alert(JSON.stringify(err))
        console.log(err)
      })
    }
  },
  modules: {
  }
})
