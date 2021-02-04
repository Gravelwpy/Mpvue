<template>
  <div class="more">
    <div class="newitem">
      <div class="group" v-if="accounttype === 2">
        <van-cell title="收集WiFi信息" class="content" @click="wifiinfocollect" is-link/>
        <van-cell title="WiFi定位精度测试" class="content" @click="wifitest" is-link/>
      </div>
      <div class="seatgroup" v-if="accounttype === 2">
        <van-cell title="实验室座位管理" class="content" @click="seatmanagement" is-link/>
      </div>
      <div class="logout">
        <van-button  type="danger" @click="logout" round size="large">退出当前账号</van-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacheraddsign',
    data() {
      return {
        accounttype: ''
      }
    },
    watch:{

    },
    methods: {
      seatmanagement() {
        wx.navigateTo({
          url: '/pages/seatmanagement/main'
        })
      },
      wifitest() {
        wx.navigateTo({
          url: '/pages/wifiinfotest/main'
        })
      },
      wifiinfocollect() {
        wx.navigateTo({
          url: '/pages/wifiinfocollect/main'
        })
      },
      logout() {
        wx.setStorageSync('token', '');
        wx.setStorageSync('accounttype', '');
        wx.setStorageSync('accountinfo', '');
        wx.setStorageSync('studentsignid', '');
        wx.setStorageSync('signitemid', '');
        wx.setStorageSync('logs', '');
        wx.reLaunch({
          url: '/pages/login/main'
        })
      }
    },
    created() {
    },
    mounted(){
    },
    onLoad: function () {
      let _this = this;
      _this.accounttype = wx.getStorageSync('accounttype');
    },
  }
</script>

<style scoped>
  .more {
    height: 100%;
    display: flex;
    width: 100%;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: #f4f4f4;
  }
  .newitem {
    width: 100%;
    margin-top: 10rpx;
  }
  .logout {
    width: 80%;
    margin-left: 10%;
    margin-top: 20rpx;
  }
  .seatgroup {
    margin-top: 10rpx;
  }
</style>
