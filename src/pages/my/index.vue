<template>
    <div class="my">
      <!-- <image src="/static/images/myba.jpg" class="myba"></image> -->
      <div class="circular">
        
      </div>
      <div class="avatar">
        <open-data type="userAvatarUrl" style="border-radius: 500px;" mode="aspectFit"></open-data>
      </div>
      
      <div class="namecss"><open-data type="userNickName"></open-data></div>

      <div class="item" v-if="accounttype === 1" @click="signrecord">
        <van-icon name="chat-o" dot />
        <div class="itemfont">签到记录</div>
      </div>
      <div class="item" v-if="accounttype === 2" @click="teacheraddsignrecord">
        <van-icon name="chat-o" dot />
        <div class="itemfont">发起签到记录</div>
      </div>
      <div class="item2" @click="question">
        <van-icon name="setting-o" dot />
        <div class="itemfont">意见反馈</div>
      </div>
      <div class="item3" v-if="accounttype === 2" @click="teacheraddsign">
        <van-icon name="coupon-o" dot />
        <div class="itemfont">发起签到</div>
      </div>
      <div class="item3" v-if="accounttype === 1" @click="more">
        <van-icon name="coupon-o" dot />
        <div class="itemfont">更多</div>
      </div>
      <div class="item4" v-if="accounttype === 2" @click="more">
        <van-icon name="coupon-o" dot />
        <div class="itemfont">更多</div>
      </div>
    </div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        userInfo: {
          avatarUrl: '',
          nickName: ''
        },
        accounttype: ''
      }

    },
    methods: {
      more() {
        wx.navigateTo({
          url: "/pages/more/main"
        })
      },
      teacheraddsign() {
        wx.navigateTo({
          url: "/pages/teacheraddsign/main"
        })
      },
      teacheraddsignrecord() {
        wx.navigateTo({
          url: "/pages/teacheraddsignrecord/main"
        })
      },
      question() {
        wx.navigateTo({
          url: "/pages/question/main"
        })
      },
      signrecord() {
        wx.navigateTo({
          url: "/pages/signrecord/main"
        })
      }
    },
    onLoad: function () {
      let _this = this;
      _this.accounttype = wx.getStorageSync('accounttype');
    },
  };
</script>

<style scoped>
.circular {
  display: flex;
  position: absolute;
  background-color: #a7a388;
  width: 140%;
  height: 800rpx;
  border-radius: 50%;
  margin-top: -580rpx;
}
.my {
  overflow: hidden;
  height: 100%;
  width: 100%;
  bottom: 0px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #f5f5f5;
}
.avatar {
  z-index: 1;
  margin-top: 100rpx;
  width: 160rpx;
  height: 160rpx;
  border-radius: 500px;
}
.namecss {
  position: absolute;
  margin-top: 280rpx;
}
.itemfont {
  margin-left: 20rpx;
}
.item {
  position: absolute;
  display: flex;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  padding: 30rpx 40rpx;
  margin-top: 400rpx;
  align-items: center;
}
.item2 {
  position: absolute;
  display: flex;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  padding: 30rpx 40rpx;
  margin-top: 540rpx;
  align-items: center;
}
.item3 {
  position: absolute;
  display: flex;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  padding: 30rpx 40rpx;
  margin-top: 680rpx;
  align-items: center;
  align-items: center;
}
.item4 {
  position: absolute;
  display: flex;
  background-color: white;
  border-radius: 20rpx;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: 70%;
  padding: 30rpx 40rpx;
  margin-top: 820rpx;
  align-items: center;
  align-items: center;
}
.myba {
  position: absolute;
  z-index: 22;
  width: 100%;
}
</style>
