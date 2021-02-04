<template>
  <div class="more">
    <div class="newitem">
      <div v-for="item in labdata" >
        <van-cell :title="item.group_name" class="content" @click="labmanagement(item.id)" is-link/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'teacheraddsign',
    data() {
      return {
        accounttype: '',
        labdata: [
          {"group_name": "203"},
          {"group_name": "203"},
        ]
      }
    },
    watch:{

    },
    methods: {
      labmanagement(id) {
        wx.setStorageSync('labseatlabid', id);
        wx.navigateTo({
          url: "/pages/labseat/main"
        })
      },
      getLabListByTeacherCode() {
        let _this = this;
        wx.request({
          method: 'POST',
          url: _this.GLOBAL.baseUrl + 'labseat/getLabListByTCode',
          data: {
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token'),
          },
          success (res) {
            res = res.data
            console.log(res);
            if(res.error_code === 0 ) {
              console.log(res)
              _this.labdata = res.data.data;
              // wx.showToast({
              //   title: '修改成功',
              //   icon: 'none',
              //   duration:2000
              // })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration:2000
              })
            }
          },
        })
      }
    },
    mounted(){
    },
    onLoad: function () {
      let _this = this;
      _this.accounttype = wx.getStorageSync('accounttype');
    },
    onShow() {
      this.getLabListByTeacherCode();
    }
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
