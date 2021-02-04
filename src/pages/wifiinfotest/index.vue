<template>
  <div class="page">

    <div class="card">
      <div class="card_left card_all">
        <div class="card_title">当前匹配地点:</div>
        <div class="card_con">{{ resultloc_name }}</div>
      </div>
      <div class="card_right card_all">
        <div class="card_title">测试点编号:</div>
        <div class="card_con">{{ loc_id }}</div>
      </div>
    </div>

    <div class="card">
      <div class="card_left card_all">
        <div class="card_title">经度:</div>
        <div class="card_con">{{ longitude }}</div>
      </div>
      <div class="card_right card_all">
        <div class="card_title">纬度:</div>
        <div class="card_con">{{ latitude }}</div>
      </div>
    </div>
    <div class="card">
      <div class="card_left card_all">
        <div class="card_title">微信经度:</div>
        <div class="card_con">{{ wechatlongitude }}</div>
      </div>
      <div class="card_right card_all">
        <div class="card_title">微信纬度:</div>
        <div class="card_con">{{ wechatlatitude }}</div>
      </div>
    </div>
    <div class="savebutton">
      <van-button color="#a7a388" round block @click="subinfo">开始测试</van-button>
    </div>

  </div>
</template>

<script>
  // import BMap from 'BMap'

  export default {
    name: "wifitest",
    components: {},
    data: function () {
      return {
        sendtype: 1,
        resultloc_name: '',
        longitude: '',
        latitude: '',
        loc_id: '',
        wechatlatitude: '',
        wechatlongitude: ''
      }
    },
    methods: {
      subinfo() {
        var _this = this;
        wx.getSystemInfo({
              success:function(res){
                if(res.platform == "devtools"){
                    console.log("PC")
                }else if(res.platform == "ios"){
                  _this.sendtype = 3;
                  _this.getwifiinfo();
                }else if(res.platform == "android"){
                  _this.sendtype = 2;
                  _this.getwifiinfo();
                }
              }
          })
      },
      getwifiinfo() {
        var _this = this;
        try {
          // 调用微信接口获取wifi列表
          wx.getLocation({
              type: 'wgs84',
              isHighAccuracy: true,
              success (res) {
                _this.wechatlatitude = res.latitude.toFixed(6)
                _this.wechatlongitude = res.longitude.toFixed(6)
              },
              fail(res) {

                // console.log(res.errMsg === "getLocation:fail auth deny")
                if( res.errMsg === "getLocation:fail auth deny" ) {
                  console.log("sole")
                  wx.showModal({
                    title: '操作提示',
                    content: '你点击了拒绝授权，将无法进行下一步操作，请先同意授权。',
                    success:function(res){
                      if(res.confirm){
                        wx.openSetting({
                          success: function (res) {

                          }
                        })
                      }
                    }
                  })
                } else {
                  wx.showToast({
                    title: res.errMsg,
                    icon: 'none',
                    duration:2000
                  })
                }

              }
            })
          // 判断wifi是否打开，如否则尝试打开wifi

          wx.startWifi({
            success (res) {
              wx.getWifiList ({})
              console.log("success")
            },
            fail( rse ) {
              console.log( rse )
            }
          })
          console.log(_this.sendtype)
          wx.getWifiList({
            success( res ) {
              console.log("success")
              console.log(res)
            },
            fail(res) {
              if( res.errCode == 12005 ) {wx.showToast({ title: "请打开wifi开关", icon: 'none', duration:2000 })}
              else {wx.showToast({ title: res.errMsg , icon: 'none', duration:2000 })}
            }
          })
          wx.onGetWifiList(function (CALLBACK){
            var wifilist = CALLBACK.wifiList;
            console.log(wifilist)
            if( wifilist.length > 0 ) {

                wx.request({
                  method: 'POST',
                  url: _this.GLOBAL.baseUrl + 'wifi/nn_match',
                  data: {
                    wifi_info_list : JSON.stringify( { "wifi_test_list": wifilist }),
                    num: 1,
                    type: _this.sendtype,
                    average: 0
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded', // 默认值
                    'token': wx.getStorageSync('token')
                  },
                  success (res) {
                    console.log(res.data)
                    if( res.data.error_code === 0 ) {
                      // console.log(res.data.data[0].result.loc_name)
                      _this.resultloc_name = res.data.data[0].result.loc_name
                      _this.longitude = res.data.data[0].result.longitude
                      _this.latitude = res.data.data[0].result.latitude
                      _this.loc_id = res.data.data[0].result.loc_id
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration:2000
                      })
                    }
                  }
                })
            } else {
              wx.showToast({
                title:'wifi列表获取失败',
                icon: 'none',
                duration:2000
              })
            }
          });
        } catch (e) {
          wx.showToast({
            title:'wifi信号获取失败',
            icon: 'none',
            duration:2000
          })
        }
      },
    },
    created() {
      // this.getlocallist();
      // this.deviceManufacturer = device.model;
      // this.setlat_lot();
      // setInterval(this.getwifilist, 30000);
    },
    mounted() {

    },
    destroyed() {
      clearTimeout(this.timer);
    }

  }
</script>

<style scoped>
  .testbut {
    box-shadow: 0 0 20px #dcdde1;
    justify-content: center;
    align-items: center;
    display: flex;
    margin-bottom: 30px;
    width: 170px;
    height: 170px;
    margin-left: calc(50% - 85px);
    border-radius: 100px;
    background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  }
  .testbut_forn {
    font-size: 20px;
  }
  .card {
    display: flex;
    justify-content: center;
  }
  .card_all {
    border-radius: 10px;
    box-shadow: 0 0 2px #dcdde1;
    background-color: white;
    justify-content: center;
    align-items: center;
    height: 90px;
    width: 50%;
  }
  .card_title {
    font-size: 13px;
    margin-top: 10px;
    display: flex;
    margin-left: 20px;
  }
  .card_con {
    font-size: 20px;
    margin-top: 15px;
    text-align: center;
  }
  .card_left {

  }
  .card_right {
    margin-left: 2%;
    margin-bottom: 10px;
  }
  .cardtype2 {
    display: flex;
    width: calc(100% - 20px);
    margin-left: 10px;
    margin-bottom: 10px;
    justify-content: center;
    height: 70px;
    border-radius: 10px;
    box-shadow: 0 0 2px #dcdde1;
    background-color: white;
    justify-content: center;
    align-items: center;
  }
  .cardtype2_font {
    font-size: 20px;
  }
  .localitem {
    position: absolute;
    margin-left: 100px;
  }
  .localitemcell {
    width: 200px;
  }
  .latitudeandlongitudefont {
    font-size: 15px;
    line-height: 20px;
    margin-top: 10px;
  }
  .map {
    height: 100%;
    position: absolute;
    width: 100%;
  }
  .getlocal {
    font-size: 20px;
    line-height: 30px;
    height: 30px;
    border: ghostwhite 1px solid;
  }
  .limit {
    height: 80%;
    overflow: scroll;
  }
  .circle {
    position: absolute;
    margin-left: calc(50% - 85px);
  }
  .addpoint {
    margin-top: 10px;
  }
  .savebutton {
    width: 80%;
    margin-top: 30rpx;
    margin-left: 10%;
  }
</style>
