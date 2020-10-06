<template>
<div class="meetingRoom-container">
  <section class="meetingRoom-container-left">
    <div class="meetingRoom-container-left-top video-container" id="videoGrid">
    </div>
    <div class="meetingRoom-container-left-bottom meetingRoom-footer">
      <div class="meetingRoom-footer-left">
        <div class="meetingRoom-footer-left-shareUrl">
          <img src="../assets/share-icon.svg" alt="present-screen" class="meetingRoom-footer-left-shareUrl-icon">
          Share link
        </div>
      </div>
      <div class="meetingRoom-footer-control">
        <button class="meetingRoom-footer-control-icon meetingRoom-footer-control-mic"
          :class="{'meetingRoom-footer-control-icon-mute': !toggleMicValue }" @click="toggleMic">
          <img v-if="toggleMicValue" src="../assets/mic-icon.svg" alt="mute-mic">
          <img v-else src="../assets/mic-mute-icon.svg" alt="unmute-mic">
        </button>
        <button class="meetingRoom-footer-control-icon meetingRoom-footer-control-disconnect" @click="leaveMeeting">
          <img src="../assets/call-icon.svg" alt="call">
        </button>
        <button class="meetingRoom-footer-control-icon meetingRoom-footer-control-video"
          :class="{'meetingRoom-footer-control-icon-mute': !toggleVideoValue }" @click="toggleVideo">
          <img v-if="toggleVideoValue" src="../assets/video-logo.svg" alt="no-video">
          <img v-else src="../assets/video-mute.svg" alt="video"
            class="videouUnmuteIcon">
        </button>
      </div>
      <div class="meetingRoom-footer-right">
        <div class="meetingRoom-footer-right-present" @click="presentScreen">
          <img src="../assets/present-icon.svg" alt="present-screen" class="meetingRoom-footer-right-present-icon">
          <span class="meetingRoom-footer-right-present-text">Present now</span>
        </div>
      </div>
    </div>
  </section>
  <section class="meetingRoom-container-right">
    <div class="meetingRoom-container-right-top">
      <h2 class="meetingRoom-container-right-top-heading">Meeting details</h2>
    </div>
    <div class="meetingRoom-container-right-middle">
      <button class="meetingRoom-container-right-middle-tabs">
        <span class="meetingRoom-container-right-middle-tabs-people">
          <img src="../assets/group-icon.svg" alt="people">
          People ({{ usersInRoomList.length }})
        </span>
      </button>
      <button class="meetingRoom-container-right-middle-tabs">
        <span class="meetingRoom-container-right-middle-tabs-chat">
          <img src="../assets/keyboard.svg" alt="chat">
          Chat
        </span>
      </button>
    </div>
    <div class="meetingRoom-container-right-bottom">
      <ul class="userList">
        <li v-for="user in usersInRoomList" :key="user.userName" class="userList-item">
          <div class="userList-item-video">
            <span class="userList-item-video-initials">
            {{ getInitials(user.userName) }}
            </span>
          </div>
          <div class="userList-item-name">
            {{ user.userName }}
          </div>
        </li>
      </ul>
    </div>
  </section>
</div>  
</template>

<script>
import Peer from 'peerjs';
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'MeetingRoom',
  data () {
    return  {
      localVideoStream: '',
      peerRef: '',
      userMediaConnectionList: [],
      currentUserId: '',
      toggleMicValue: true,
      toggleVideoValue: true,
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'usersInRoomList'
    ]),
    getRoomId () {
      return this.$route.query.roomId
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapActions([
      'addUserToRoom',
      'removerUserFromRoom',
      'removeAllUserFromRoom'
    ]),
    addVideoStream (videoElement, videoStream) {
      const videoGrid = document.getElementById('videoGrid')
      videoElement.srcObject = videoStream
          videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play()
      })
      videoGrid.append(videoElement)
    },

    addNewUserToRoom (userData, videoStream) {
      const dataConnection = this.peerRef.connect(userData.userId)
      const mediaConnection = this.peerRef.call(userData.userId, videoStream)
      dataConnection.on('open', () => {
        dataConnection.send({
          userName: this.userInfo.userName
        })
      })
      let videoElement
      mediaConnection.on('stream', (stream) => {
        this.addUserToRoom({
          userName: userData.userName,
          stream: stream,
        })
        const remoteVideoElement = document.getElementById(`video-${mediaConnection.peer}`)
        if (remoteVideoElement) {
          remoteVideoElement.srcObject = stream
        } else {
          videoElement = this.createVideoElement(userData.userId)
          this.addVideoStream(videoElement, stream)
        }
      })
      mediaConnection.on('close', () => {
        console.log('close')
        videoElement.remove()
      })
      this.userMediaConnectionList[userData.userId] = mediaConnection
    },

    createVideoElement (userId) {
      const videoElement = document.createElement('video')
      videoElement.classList.add("video-container-video")
      videoElement.id = `video-${userId}`
      return videoElement
    },

    getInitials (userName) {
      if (userName) {
        return userName.match(/(\b\S)?/g).join("").toUpperCase()  
      }
      return 'SS'
    },

    toggleMic () {
      if (this.localVideoStream.getAudioTracks()[0]) {
        this.toggleMicValue= !this.localVideoStream.getAudioTracks()[0].enabled
        this.localVideoStream.getAudioTracks()[0].enabled = this.toggleMicValue
      }
    },

    async presentScreen () {
      const stream = await navigator.mediaDevices.getDisplayMedia({video: true})
      const videoElement = document.getElementById(`video-${this.currentUserId}`)
      stream.getTracks()[0].onended = (event) => {
        videoElement.srcObject = this.localVideoStream
        for (const item in this.userMediaConnectionList) {
          this.peerRef.call(item, this.localVideoStream)
        }
      }
      for (const item in this.userMediaConnectionList) {
        this.peerRef.call(item, stream)
      }
      videoElement.srcObject = stream
    },

    toggleVideo () {
      if (this.localVideoStream.getVideoTracks()[0]) {
        this.toggleVideoValue= !this.localVideoStream.getVideoTracks()[0].enabled
        this.localVideoStream.getVideoTracks()[0].enabled = this.toggleVideoValue
      }
    },

    leaveMeeting () {
      this.$socket.close()
      this.localVideoStream.getTracks().forEach(track => {
        track.stop()
      });
      this.removeAllUserFromRoom()
      this.$router.push({name: 'Home'})
    },

    init () {
      this.peerRef = new Peer()
      this.peerRef.on('open', (id) => {
        this.currentUserId = id
        const payload = {
          roomId: this.getRoomId,
          userId: id,
          userName: this.userInfo.userName
        }
        this.$socket.emit('join-room', payload)
        this.getMedia()
      })

      this.sockets.subscribe('peer-disconnected', (userData) => {
        if (this.userMediaConnectionList[userData.userId]) {
          this.userMediaConnectionList[userData.userId].close()
          this.removerUserFromRoom(userData)
        }
      });
    },

    async getMedia () {
      const myVideo = document.createElement('video')
      myVideo.classList.add("video-container-video");
      myVideo.setAttribute("id", `video-${this.currentUserId}`);
      let stream = ''
      try {
        stream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
        this.localVideoStream = stream
        this.setControlValue()
        this.addVideoStream(myVideo, stream)
        this.addUserToRoom({
          userName: this.userInfo.userName,
          stream: this.localVideoStream,
        })
        this.peerRef.on('call', (mediaConnection) => {
          if (!this.userMediaConnectionList[mediaConnection.peer]) {
            this.userMediaConnectionList[mediaConnection.peer] = mediaConnection
          }
          mediaConnection.answer(stream)
          let videoElement
          const remoteVideoElement = document.getElementById(`video-${mediaConnection.peer}`)
          mediaConnection.on('stream', (stream) => {
            if (remoteVideoElement) {
              remoteVideoElement.srcObject = stream
            } else {
              videoElement = this.createVideoElement(mediaConnection.peer)
              this.addVideoStream(videoElement, stream)
            }
          })
          mediaConnection.on('close', () => {
            videoElement.remove()
          })
        })
        this.peerRef.on('connection', (dataConnection) => {
          dataConnection.on('open', () => {
            console.log(dataConnection)
            dataConnection.on('data', (data) => {
              this.addUserToRoom(data)
            })
          })
        })
        this.sockets.subscribe('peer-connected', (data) => {
          this.addNewUserToRoom(data, stream)
        })
      } catch (err) {
        alert(err)
        console.log(err)
      }
    },

    setControlValue () {
      if (!this.localVideoStream.getAudioTracks()[0]) {
        this.toggleMicValue = false
      }
      if (!this.localVideoStream.getVideoTracks()[0]) {
        this.toggleVideoValue = false
      }
    }
  }
}
</script>

<style lang="scss">

$box-shadow: 0 1px 3px 0 rgba(60,64,67,0.302), 0 4px 8px 3px rgba(60,64,67,0.149);

.userList {
  list-style-type: none;
  padding: 0px;
  margin: 10px 0px 0px 0px;
  &-item {
    display: flex;
    align-items: center;
    height: 56px;
    min-height: 56px;
    padding: 0px;
    margin:2px 0px 0px 0px;
    border-top: 1px solid #efeff0;
    border-bottom: 1px solid #efeff0;
    &-video {
      flex: .3;
      height: 100%;
      background-color: #efeff0;
      display: flex;
      justify-content: center;
      align-items: center;
      &-initials {
        width: 35px;
        height: 35px;
        background-color: #791091;
        color: #fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .8rem;
      }
    }
    &-name {
      flex: 0.7;
      font-size: .9rem;
      text-align: left;
      margin-left: 8px;
    }
  }
}
.meetingRoom {
  &-container {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    height: 100%;
    width: 100%;
    &-left {
      flex: 0.85;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      &-top {
        background-color: #111;
        flex: 0.9;
      }
      &-bottom {
        flex: 0.1;
      }
    }
    &-right {
      flex: 0.25;
      &-top {
        height: 65px;
        min-height: 64px;
        padding-left: 24px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        &-heading {
          text-align: left;
          font-size: 1.05rem;
        }
      }
      &-middle {
        display: flex;
        justify-content: center;
        height: 50px;
        min-height: 50px;
        border-bottom: 1px solid rgb(219, 219, 219);
        &-tabs {
          flex: 1;
          background-color: transparent;
          outline: none;
          border: 0px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          height: 100%;
          &:hover {
            background-color: rgba(121, 0, 40, 0.039);
          }
          img {
            width: 18px;
            height: 18px;
            margin: 0px 8px;  
          }
          &-people {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f0154b;
            border-bottom: 3px solid #f0154b;
            height: 100%;
          }
          &-chat {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }
        }
      }
    }
  }
  &-footer {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      display: flex;
      justify-content: flex-start;
      flex: 1;
      &-shareUrl {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0px 32px;
        min-height: 88px;
        cursor: pointer;
        font-size: 0.9rem;
        &:hover {
          background-color: rgb(218, 218, 218);
        }
        &-icon {
          width: 24px;
          height: 24px;
          margin: 2px 0px;
        }
      }
    }
    &-control {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 250px;
      &-icon {
        width: 56px;
        height: 56px;
        background-color: #fff;
        border: 1.5px solid #dadce0;
        border-radius: 50%;
        margin: 16px 8px;
        position: relative;
        outline: none;
        cursor: pointer;
        &:hover {
          box-shadow: $box-shadow;
          background-color: rgba(128,134,139,0.122);
          transition: all 250ms ease-in-out;
        }
        &-mute {
          background-color: #d93025;
          border: 1px solid #d93025;
          &:hover {
            box-shadow: $box-shadow;
            background-color: #cc2a1f;
            transition: all 250ms ease-in-out;  
          }
        }
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          width: 22px;
          height: 22px;
        }
      }
    }
    &-right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      border-right: 1px solid rgb(196, 195, 195);
      &-present {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0px 32px;
        min-height: 88px;
        cursor: pointer;
        &:hover {
          background-color: rgb(218, 218, 218);
        }
        &-icon {
          width: 20px;
          height: 20px;
          margin: 2px 0px;
        }
        &-text {
          font-size: 0.9rem;
        }
      }
    }
  }
}
.video {
  &-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    &-video {
      height: 300px;
      width: 400px;
      object-fit: cover;
      transform: scaleX(-1);
    }
  }
}
.videouUnmuteIcon {
  width: 18px !important;
  height: 18px !important;
}
</style>