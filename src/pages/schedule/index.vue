<template>
  <div class="schedule">
    <div class="labcard" @click="toNomalSign">
      <div class="title">课堂签到</div>
      <div class="cardicon">
        <van-icon name="friends" size="3rem" />
      </div>
    </div>
    <div class="normalcard" @click="toLabSign">
      <div class="title">实验室签到</div>
      <div class="cardicon">
        <van-icon name="bars" size="3rem" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "schedule",
    components: {},
    data: function () {
      return {
      }
    },
    methods: {
      toNomalSign: function() {
        if( wx.getStorageSync('accounttype') === 2 ) { // 老师
          wx.navigateTo({
            url: "/pages/teachernormalsignlist/main"
          })
        } else {
          wx.navigateTo({
            url: "/pages/normalsign/main"
          })
        }
      },
      toLabSign: function() {
        if( wx.getStorageSync('accounttype') === 2 ) { // 老师
          wx.navigateTo({
            url: "/pages/teacherlabsignlist/main"
          })
        } else {
          wx.navigateTo({
            url: "/pages/labsign/main"
          })
        }
      }
    },
    onShow: function () {
    },
  }
</script>

<style scoped>
  .schedule {
    overflow: scroll;
    height: 100%;
    width: 100%;
    bottom: 0px;
    position: absolute;
    display: flex;
    background-color: #f5f5f5;
  }
  .labcard {
    width: 44%;
    height: 30%;
    background-color:#a7a388;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 30rpx;
    margin: 20rpx 4%;
  }
  .normalcard {
    width: 44%;
    height: 30%;
    background-color: #a7a388;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 30rpx;
    margin-top: 20rpx;
  }
  .title {
    color: #303133;
    margin-top: 15%;
    margin-left: 10%;
  }
  .cardicon {
    margin-top: 30%;
    margin-left: 50%;
  }
</style>
