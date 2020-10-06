<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  methods: {
    ...mapActions([
      'updateUserInfo'
    ]),
    generateName () {
      var name1 = ['Dario', 'River', 'Nyasia', 'Tristian' ,'Sarah' ,'Celia', 'Dennis', 'Aleena', 'Jakob', 'Cyrus', 'Kamden', 'Kane', 'Calvin', 'Allisson', 'Ronin']
      var name2 = ['Lynch', 'Clay', 'Shah', 'Fuller', 'Hamilton', 'Raymond', 'Peterson']
      var name = name1[this.getRandomInt(0, name1.length)] + ' ' + name2[this.getRandomInt(0, name2.length)]
      return name
    },
    getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },
  },
  mounted () {
    this.updateUserInfo({
      userName: this.generateName()
    })
  }
}
</script>

<style lang="scss">
body, html {
  width: 100%;
  height: 100%;
  padding: 0px;
  margin: 0px;
}

#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
