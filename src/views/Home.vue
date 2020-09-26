<template>
  <div class="main-container">
    <Navbar />
    <section class="container">
      <div class="container-left">
      </div>
      <div class="container-right">
        <div class="container-right-box">
          <div class="container-right-box-top">
            <div class="container-right-box-top-container" @click="handleCreateMeeting">
              <p class="container-right-box-top-container-text">Create a new meeting</p>
            </div>
          </div>
          <div class="container-right-box-middle"></div>
          <div class="container-right-box-bottom">
            <div class="container-right-box-bottom-container">
              <img src="../assets/keyboard.svg" class="container-right-box-bottom-container-image">
              <p class="container-right-box-bottom-container-text">Use a meeting code</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import { mapActions } from 'vuex'

export default {
  name: 'Home',
  components: {
    Navbar
  },
  methods: {
    ...mapActions([
      'getRoomId'
    ]),
    handleCreateMeeting () {
      this.getRoomId({
        success: this.getRoomIdSuccess
      })
    },
    getRoomIdSuccess (roomId) {
      this.$router.push({name: 'MeetingRoom', query: {roomId: roomId}})
    }
  }
}
</script>

<style lang="scss">
.main-container {
  width: 100%;
  height: 100%;
  background-image: url('../assets/pool.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
.container {
  display: flex;
  width: 100%;
  height: 100%;
  &-left {
    max-width: 50%;
    min-width: 50%;
    height: 100%;
  }
  &-right {
    box-pack: center;
    -webkit-box-pack: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    box-flex: 1;
    flex-grow: 1;
    max-width: 50%;
    min-width: 50%;
    &-box {
      align-self: center;
      background-color: #fff;
      width: 78%;
      height: 150px;
      border-radius: 8px;
      margin-left: 20px;
      &-middle {
        border-bottom: 1px solid #dadce0;
      }
      &-top {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 49.5%;
        cursor: pointer;
        &-container {
          margin-top: 8px;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          border-radius: 8px;
          color: #333;
          &:hover {
            color: #fff;
            background-color: #f0154b;
            transform: scale(1.05);
            transition: all ease-in-out .2s;
          }
          &:hover > &-text::before {
            content: url('../assets/video-logo-white.svg');
          }
          &-text {
            font-size: 1rem;
            margin-left: 80px;
            position: relative;
            display: flex;
            align-items: center;
            &::before {
              width: 32px;
              height: 32px;
              content: url('../assets/video-logo.svg');
              position: absolute;
              left: -40px;
            }
          }
        }
      }
      &-bottom {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 49.5%;
        &-container {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          width: 100%;
          color: #333;
          margin-left: 20px;
          &-image {
            width: 24px;
            height: 24px;
            margin-left: 23px;
          }
          &-text {
            font-size: 1rem;
            position: relative;
            display: flex;
            align-items: center;
            margin-left: 15px;
          }
        }
      }
    }
  }
}
</style>
