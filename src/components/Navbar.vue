<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="navbar-left-logo">
        <img src="../assets/logo.svg" class="navbar-left-logo-image">
      </div>
      <h2 class="navbar-left-heading">
        WeMeet
      </h2>
    </div>
    <div class="navbar-right">
      <div class="navbar-right-user-logo">
        S
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
}
</script>

<style lang="scss">
.navbar {
  position: fixed;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0px;
  width: 100%;
  &-left {
    display: flex;
    align-items: center;
    &-heading {
      font-size: 1.6rem;
      font-weight: 600;
      color: #fff;
      margin: 0px 10px;
    }
    &-logo {
      background-color: #f0154b;
      border-radius: 50%;
      padding: 10px;
      width: 25px;
      height: 25px;
      position: relative;
      margin-left: 20px;
      &-image {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
  &-right {
    display: flex;
    align-items: center;
    margin: 0px 10px;
    width: 100px;
    margin-top: -1px;
    &-user {
      &-logo {
        background-color: #791091;
        border-radius: 50%;
        padding: 10px;
        width: 25px;
        height: 25px;

        color: #fff;
        font-size: 1.4rem;
        font-weight: 600;
        text-align: center;

        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>