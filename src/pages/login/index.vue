<template>
  <div class="outer">
    <div class="pictureBox">
      <image
        class="picture"
        src="/static/images/logo.jpg"
        mode="aspectFit"
      ></image>
    </div>

    <div class="container">
      <div class="input">
        <div class="inputItem">
          <image
            class="side"
            src="/static/images/account.png"
            mode="aspectFit"
          ></image>
          <input
            class="inputstyle"
            v-model="account"
            type="digit"
            placeholder="请输入账号"
          />
        </div>
        <div class="inputItem">
          <image
            class="side"
            src="/static/images/key.png"
            mode="aspectFit"
          ></image>
          <input
            class="inputstyle"
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
        </div>
      </div>

      <div class="buttonStyle">
        <div class="loginbutton" @click="Login">
          <div>登  录</div>
        </div>
        <div class="resignbutton" @click="Rsgister">
          <div>注  册</div>
        </div>
      </div>
      <div class="forget" @click="Forget"><div>忘记密码</div></div>
    </div>
  </div>
</template>

<script>

export default {
  name: "index",
  data() {
    return {
      account: "",
      password: 123,
      type: 1,
    };
  },
  methods: {
    Rsgister() {
      //注册跳转页面
      wx.navigateTo({
        url: "/pages/register/main",
      });
    },
    Forget() {
      //忘记密码跳转页面
      wx.showToast({
          title: "初始密码为123",
          icon: "none",
          duration: 2000,
         });
    },
    Login() {
      //登录按钮

      let _this = this;
      console.log(_this.account.length);
      
      //根据账户的长度来区分老师和学生角色
      if (_this.account.length >= 9) {
            _this.type = 1;
          } else {
            _this.type = 2;
          }
      if (_this.account === "" || _this.password === "") {
         wx.showToast({
          title: "请注意输入不得为空",
          icon: "none",
          duration: 2000,
         });
      } 

      wx.request({
          method: 'POST',
          url: _this.GLOBAL.baseUrl + 'account/login',//向后台提交账户密码信息
          data: {
            account: _this.account,
            password: _this.password,
            type: _this.type
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success (res) {
            console.log(res.data)
            
          if( res.data.error_code === 0 ) {
              wx.setStorageSync('token', res.data.data.token);//缓存信息
              wx.setStorageSync('accounttype', res.data.data.type);
              wx.setStorageSync('accountinfo', res.data.data.account);
              // console.log(wx.getStorageSync('accounttype'));
              // 2 为老师 1为学生
              // console.log(wx.getStorageSync('accountinfo'));
              wx.switchTab({
                url: "/pages/schedule/main"//去往主页
              })
            } 
          else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration:2000
              })
            }
          }
        })
      }
    }
};
 
</script>


<style scoped>
.outer {
  padding: 20rpx;
  overflow-x: hidden;
}
.pictureBox {
  display: flex;
  justify-content: center;
}
.picture {
  margin-top: 30rpx;
  width: 800rpx;
  height: 400rpx;
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

.side {
  /* width:10%; */
  /* vertical-align: middle; */
  padding: 20rpx 30rpx;
  width: 40rpx;
  height: 40rpx;
}

.input {
  width: 80%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30rpx 40rpx;
  margin-bottom: 30rpx;
}
.inputItem {
  display: flex;
  flex-direction: row;
  padding: 20rpx 40rpx;
}
.buttonStyle {
  margin-top: 20rpx;
  width: 100%;
  color: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.loginbutton {
  background-color: #0099ff;
  width: 80%;
  height: 70rpx;
  border-radius: 20rpx;
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.resignbutton {
  background-color: #FF6347;
  width: 80%;
  height: 70rpx;
  border-radius: 20rpx;
  margin-top: 20rpx;
  align-items: center;
  display: flex;
  justify-content: center;
}
.inputstyle {
  padding: 20rpx 30rpx;
  color: #333;
  font-size: 28rpx;
  /* vertical-align: middle; */
}
.forget {
  color: #0099ff;
  font-size: 34rpx;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 50rpx 90rpx;
  width: 90%;
}
</style>
