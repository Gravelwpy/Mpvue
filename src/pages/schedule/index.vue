<template>
  <div class="schedule">
    <div class="labcard" @click="toNomalSign">
      <div class="title">课堂签到</div>
    </div>
    <div class="labcard" name="bars" @click="toLabSign">
      <div class="title">实验室签到</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "schedule",
  components: {},
  data: function () {
    return {};
  },
  methods: {
    //----------课堂签到------------
    toNomalSign: function () {
      if (wx.getStorageSync("accounttype") === 2) {
        // 如果是老师
        wx.navigateTo({
          url: "/pages/teachernormalsignlist/main",
        });
      } else {
        wx.navigateTo({
          url: "/pages/normalsign/main",
        });
      }
    },
    //-----------实验室签到-------
    toLabSign: function () {
      if (wx.getStorageSync("accounttype") === 2) {
        // 老师
        wx.navigateTo({
          url: "/pages/teacherlabsignlist/main",
        });
      } else {
        wx.navigateTo({
          url: "/pages/labsign/main",
        });
      }
    },
  },
  onShow: function () {},
};
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
  background-color: #0099ff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 30rpx;
  margin: 20rpx 4%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
