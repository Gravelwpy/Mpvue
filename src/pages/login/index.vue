<template>
<div class="outer">
<image class="picture" src="/static/images/logo.png" mode="aspectFit"></image>
   <div class="container">
      <div class="input">
        <image class="side" src="/static/images/account.png" mode="aspectFit"></image>
        <input class="inputstyle" v-model="account" type="digit" placeholder="请输入账号"/>
        <image class="side" src="/static/images/key.png" mode="aspectFit"></image>
        <input class="inputstyle" v-model="password" type="password" placeholder="请输入密码" />
      </div>

      <div class="loginbutton">
        <van-button color="#a7a388" @click="Login" round size="large">登录</van-button>
      </div>

      <dwiv class="resignbutton">
        <van-button color="#a7a388" @click="Rsgister" round size="large">注册</van-button>
      </dwiv>
    </div>
</div>
</template>

<script>

  export default {
    name: "index",
    data() {
      return {
        account: '',
        password: 123,
        type: 1
      }
    },
    methods: {
      Rsgister() {            //注册跳转页面
        wx.navigateTo({
          url: "/pages/register/main"
        })
      },
      Login() {          //登录按钮
        let _this = this;
        console.log(_this.account.length)
        if( _this.account.length >= 10 ) {
          _this.type = 1
        } else {
          _this.type = 2
        }
        if( _this.account === '' || _this.password === '' ) {
          wx.showToast({
                title:'请按要求输入',
                icon: 'none',
                duration:2000
              })
        } else {
          wx.switchTab({             //进入首页
                  url: "/pages/schedule/main"
                })
          // wx.request({
          //   method: 'POST',
          //   url: _this.GLOBAL.baseUrl + 'account/login',
          //   data: {
          //     account: _this.account,
          //     password: _this.password,
          //     type: _this.type
          //   },
          //   header: {
          //     'content-type': 'application/x-www-form-urlencoded' // 默认值
          //   },
          //   success (res) {
          //     console.log(res.data)
          //     if( res.data.error_code === 0 ) {
          //       wx.setStorageSync('token', res.data.data.token);
          //       wx.setStorageSync('accounttype', res.data.data.type);
          //       wx.setStorageSync('accountinfo', res.data.data.account);
          //       // console.log(wx.getStorageSync('accounttype'));
          //       // 2 为老师 1为学生
          //       // console.log(wx.getStorageSync('accountinfo'));
          //       wx.switchTab({
          //         url: "/pages/schedule/main"
          //       })
          //     } else {
          //       wx.showToast({
          //         title: res.data.msg,
          //         icon: 'none',
          //         duration:2000
          //       })
          //     }
          //   }
          // })
        }
      }
    }
  };
</script>


<style scoped>
.outer{
padding-top: 0%;
margin-top: 0%;
align-content: center;
}

.picture{
  padding-top: 0%;
  align-content: center;
}

.button {
  margin-top: 30%;
  margin-left: 10%;
  width: 80%;
  /*border: red 1px solid;*/
}

.show_pro {
  margin-left: calc(50% - 45px);
  margin-top: 20%;
  width: 90px;
  height: 90px;
  border-radius: 3em;
}

.side{
  width:10%;
  vertical-align: middle;
}

.input {
  width: 80%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.loginbutton {
  width: 80%;
}
.resignbutton {
  margin-top: 20rpx;
  width: 80%;
}
.inputstyle {
  padding: 20rpx 30rpx;
  color: #333;
  font-size: 28rpx;
  vertical-align: middle;
}

</style>
