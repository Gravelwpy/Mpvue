<template>
  <div class="signdetialclass">
    <div class="classinfocard">
      <div class="classname">{{ classdata.sign_item_name }}</div>
      <div class="classtime">时间:{{ classdata.sign_item_begin_time + '--' +  classdata.sign_item_end_time}}</div>
      <div class="classroomname">{{ classdata.room_name }}</div>
      <div class="classtime">老师:{{ classdata.name }}</div>
      <div class="class">班级:{{ classdata.sign_item_classid }}</div>
      <div class="signdetiallink" @click="signdetiallink" v-if="accounttype === 2" >签到详情</div>
      <div class="signdetiallink" @click="showleavedialog" v-if="accounttype === 1 && logintype === 1 && seatArray.length>0 && signing === 1" >请假</div>
    </div>

    <div class="cinema-wrapper">
      <!--<h1 class="title">选择位置签到</h1>-->
      <div class="seat-wrapper">
        <div class="illustration">
          <div class="illustration-img-wrapper unselected-seat">
          </div>
          <span class="illustration-text">可选</span>
          <div class="illustration-img-wrapper selected-seat">
          </div>
          <span class="illustration-text">已选</span>
          <div class="illustration-img-wrapper bought-seat">
          </div>
          <span class="illustration-text">不可选</span>
        </div>
        <div class="screen">
          讲台 {{ date }}
        </div>
        <div class="btn-buy" @click="stopsign" v-if="logintype === 2 && itemtype === 1 && seatArray.length>0 && signing === 1">
          停止签到
        </div>
        <div class="btn-buy" @click="beginsign" v-else-if="logintype === 2 && itemtype === 1 && seatArray.length>0 && signing === 0">
          开始签到
        </div>
        <div class="btn-buy" @click="position" v-else-if="logintype === 1 && seatArray.length>0 && signing === 1 && type === 1">
          立即签到
        </div>
        <div class="btn-buy-forben" v-else-if="logintype === 1 && seatArray.length>0 && signing === 0 && type === 1">
          禁止签到
        </div>
        <!--实验室签到-->
        <div class="btn-buy" @click="labPosition" v-else-if="logintype === 1 && seatArray.length>0 && signing === 1 && type === 2">
          立即签到
        </div>
        <div class="btn-buy-forben" v-else-if="logintype === 1 && seatArray.length>0 && signing === 0 && type === 2">
          禁止签到
        </div>

        <div class="inner-seat-wrapper" ref="innerSeatWrapper" id="innerSeatWrapper">
          <div v-for="(row, index) in seatRow" :key="index">
            <!--这里的v-if很重要，如果没有则会导致报错，因为seatArray初始状态为空-->
            <div v-if="seatArray.length>0">
              <div v-for="(col, index1) in seatCol"
                   :key="index1"
                   class="seat"
                   :style="{width:seatSize+'px',height:seatSize+'px'}">
                <div class="inner-seat"
                     @click="handleChooseSeat(index,index1)"
                     v-if="seatArray[index][index1].is_seat!==-1"
                     :class="seatArray[index][index1].is_seat===2?'bought-seat':(seatArray[index][index1].is_seat===1?'selected-seat':'unselected-seat')">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <mp-dialog title="请输入签到码" :show="dialogshow" :buttons="buttons" @close="bindclose" @buttontap="buttontap">
      <input style="margin-top: 10px;" v-model="checkpass" type="digit" placeholder="请输入签到码"/>
    </mp-dialog>
    <mp-dialog title="请输入请假原因" :show="leaveshow" :buttons="buttons" @close="bindclose" @buttontap="signleave">
      <input style="margin-top: 10px;" v-model="leavereason" type="digit" placeholder="请输入请假原因"/>
    </mp-dialog>

  </div>
</template>

<script>
  export default {
    name: "studentsigndetail",
    data: function () {
      return {
        leaveshow: false,
        leavereason: '',
        accounttype: '',
        signing: 0,
        logintype: 1,
        itemtype: -1,
        checkpass: '',
        buttons: [{text: '取消'}, {text: '确定'}],
        dialogshow: false,
        seatArray: {},
        classdata: '',
        signtiemid: -1,
        classroomid: 0,
        signitemtype: -1,
        latitude: -1,
        longitude: -1,
        radius: -1,
        seatRow: 0,
        seatCol: 0,
        seatSize: 0,
        preRow: -1,
        preCol: -1,
        Row: -1,
        Col: -1,
        wifilist: [
        ],

        sendtype: 1,
        wechatlatitude: -1,
        wechatlongitude: -1,
        nnlatitude: -1,
        nnlongitude: -1,

        type: '',
        begintimehour: 0,
        begintimeminute: 0,
        endtimehour: 0,
        endtimeminute: 0,

        date: 0,
      }
    },
    watch: {
      checkpass(val) {
        this.checkpass = val.replace(/[^\d]/g,'');
      }
    },

    methods: {
      showleavedialog() {
        let _this = this;
        _this.leaveshow = true;
      },
      //--------请假-----------
      signleave(e) {
        let _this = this;
        if( e.target.index === 0 ) {
          _this.leavereason = '';
          _this.leaveshow = false
        } else {
          if( this.leavereason === '' ) {
            wx.showToast({
              title: '请输入请假原因',
              icon: 'none',
              duration:2000
            })
          } else {
            wx.request({
              method: 'POST',
              url: _this.GLOBAL.baseUrl + 'sign/addLeaveRecord',
              data: {
                signtiemid: _this.signtiemid,
                leavereason: _this.leavereason
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token'),
              },
              success (res) {
                res = res.data
                console.log(res);
                if(res.error_code === 0 && (res.data !== null || res.data !== '')) {
                  wx.setStorageSync('signitemid', _this.signtiemid);
                  wx.redirectTo({
                    url: "/pages/sutdengsignresult/main"
                  })
                } else {
                  wx.showToast({
                    title: '操作失败',
                    icon: 'none',
                    duration:2000
                  })
                }
              },
              complete(res) {
                _this.leavereason = '';
                _this.leaveshow = false
              }
            })
          }
        }

      },
      //-------（老师端）显示学生签到详情------
      signdetiallink() {
        let _this = this;
        if( _this.signing === 1 &&  _this.itemtype === 1) {
          wx.showToast({
            title: '签到中，请先停止签到',
            icon: 'none',
            duration:2000
          })
        } else {
          if( _this.itemtype === 2 ) {
            wx.setStorageSync('labsigndetiallinksignitemid', _this.signtiemid);
            wx.navigateTo({
              url: "/pages/labsigndetiallink/main"
            })
          } else {
            wx.setStorageSync('signdetiallinksignitemid', _this.signtiemid);
            wx.navigateTo({
              url: "/pages/signdetiallink/main"
            })
          }

        }
      },
      //--------（老师端）停止签到------
      stopsign() {
        let _this = this;
        wx.request({
          method: 'POST',
          url: _this.GLOBAL.baseUrl + 'sign/teacherStopSign',
          data: {
            signtiemid: _this.signtiemid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token'),
          },
          success (res) {
            res = res.data
            console.log(res);
            if(res.error_code === 0 ) {
              _this.signing = 0;
              wx.showToast({
                title: '修改成功',
                icon: 'none',
                duration:2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration:2000
              })
            }
          },
        })

      },
      //---------（老师端）设置开始签到-------------
      beginsign() {
        let _this = this;
        wx.request({
          method: 'POST',
          url: _this.GLOBAL.baseUrl + 'sign/teacherBeginSign',
          data: {
            signtiemid: _this.signtiemid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token'),
          },
          success (res) {
            res = res.data
            console.log(res);
            if(res.error_code === 0 ) {
              _this.signing = 1;
              wx.showToast({
                title: '修改成功',
                icon: 'none',
                duration:2000
              })
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration:2000
              })
            }
          }
        })

      },

      bindclose(e) {
        let _this = this;
        _this.dialogshow = false
        _this.leaveshow = false
      },
      buttontap(e) {
        let _this = this;
        if( e.target.index === 0 ) {
          _this.checkpass = '';
          _this.dialogshow = false
        } else {
          if( this.checkpass === '' ) {
            wx.showToast({
              title: '请输入签到码签到',
              icon: 'none',
              duration:2000
            })
          } else {
            wx.request({
              method: 'POST',
              url: _this.GLOBAL.baseUrl + 'sign/addSignRecordCheckPass',
              data: {
                signtiemid: _this.signtiemid,
                row: _this.Row,
                col: _this.Col,
                checkpass: _this.checkpass
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token'),
              },
              success (res) {
                res = res.data
                console.log(res);
                if(res.error_code === 0 && (res.data !== null || res.data !== '')) {
                  _this.preRow = -1;
                  _this.preCol = -1;
                  let oldArray = _this.seatArray.slice();
                  oldArray[_this.Row][_this.Col].is_seat=2;
                  _this.seatArray = oldArray;
                  wx.setStorageSync('signitemid', _this.signtiemid);
                  wx.redirectTo({
                    url: "/pages/sutdengsignresult/main"
                  })
                  // localStorage.setItem('signitemid', JSON.stringify(this.signtiemid));
                  // this.$router.push('/sutdengsignresult');
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration:2000
                  })
                }
              },
              complete(res) {
                _this.dialogshow = false
              }
            })
          }
        }
      },
      // 计算签到距离（两地的经纬度距离）
      distance: function (la1, lo1, la2, lo2) {
        var La1 = la1 * Math.PI / 180.0;
        var La2 = la2 * Math.PI / 180.0;
        var La3 = La1 - La2;
        var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
        s = s * 6378.137;//乘以地球半径
        s = s * 1000;
        return s;
      },
      //------进行定位------
      getLocalInfo: function (num) {
        let _this = this;
        // 进行wifi定位
        //判断使用平台（获取手机操作系统）
        wx.getSystemInfo({
          success:function(res){
            if(res.platform == "devtools"){
              _this.sendtype = 1;//PC端
              console.log("PC")
            }else if(res.platform == "ios"){
              _this.sendtype = 3;//ios小程序
            }else if(res.platform == "android"){
              _this.sendtype = 2;//安卓小程序
            }
          }
        })
        // 开始收集wifi信息
        wx.startWifi({
          success (res) {
            wx.getWifiList ({})
            console.log("success1")
          },
          fail( rse ) {
            console.log( rse )
          }
        })
        console.log("使用平台"+_this.sendtype)
        wx.getWifiList({  //请求获取wifi列表
          success( res ) {
            console.log("success2")
            console.log(res)
          },
          fail(res) {
            if( res.errCode == 12005 ) {
              wx.showToast({ title: "请打开wifi开关", icon: 'none', duration:2000 })
              }
            else {
              wx.showToast({ title: res.errMsg , icon: 'none', duration:2000 })
              }
          }
        })
        wx.onGetWifiList(function (CALLBACK){//监听获取到Wi-Fi列表数据事件
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
                if( res.data.error_code === 0 ) {
                  var nnlatituderesult = res.data.data[0].result.latitude
                  var nnlongituderesult = res.data.data[0].result.longitude
                  console.log("距离：")
                  console.log(_this.distance(_this.latitude,_this.longitude,nnlatituderesult,nnlongituderesult))
                  console.log("签到范围")
                  console.log(_this.radius)
                  if( _this.distance(_this.latitude,_this.longitude,nnlatituderesult,nnlongituderesult) > _this.radius ) {
                    wx.showToast({
                      title: '超出签到范围',
                      icon: 'none',
                      duration:2000
                    })
                  } else {
                    // 调用签到方法
                    _this.buySeat();
                  }
                } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration:2000
                    })
                }

              },
              fail( e ) {
                // （匹配不成功）尝试调用微信接口获取位置信息
                // 进行微信定位
                wx.getLocation({
                  type: 'wgs84',
                  isHighAccuracy: true,
                  success (res) {
                    const latitude = res.latitude
                    const longitude = res.longitude
                    if( _this.distance(_this.latitude,_this.longitude,latitude,longitude) > _this.radius ) {
                      wx.showToast({
                        title: '超出签到范围',
                        icon: 'none',
                        duration:2000
                      })
                    } else {
                      // 调用签到方法
                      _this.buySeat();
                    }
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
      },
      // 判断是否是实验室签到，如果是则进行时间范围检查，否则直接调用position方法
      timeJudge() {
        var _this = this;
        // begintimehour: 0,
        //   begintimeminute: 0,
        //   endtimehour: 0,
        //   endtimeminute: 0,
      },
      // 实验室签到会先判断时间
      labPosition() {
        var _this = this;
        if( (new Date().getHours() > _this.begintimehour) && (new Date().getHours() < _this.endtimehour)
          || (new Date().getHours() == _this.begintimehour && new Date().getMinutes > _this.begintimeminute )
          || (new Date().getHours() == _this.endtimehour && new Date().getMinutes < _this.endtimeminute ) ) {
          _this.position();
        } else {
          wx.showToast({
            title: '不在签到时间内',
            icon: 'none',
            duration:2000
          })
        }
      },
      // ---------定位算法(跳转getLocalInfo)-----------
      position: async function() {
        var _this = this;
        if(_this.Row === -1 && _this.Col === -1 ) {
          wx.showToast({
            title: '请选择座位',
            icon: 'none',
            duration:2000
          })
        } else {
          await  _this.getLocalInfo(1);
        }
      },
      //处理座位选择逻辑
      handleChooseSeat(row,col){
        let _this = this;
        if( _this.logintype === 1 ) { // 只有学生能够签到
          let seatValue = this.seatArray[row][col].is_seat;
          let newArray = this.seatArray;
          //如果是不可选座位，直接返回
          if(seatValue===2) return
          //如果是已选座位点击后变未选
          if(seatValue === 1){
            this.preRow = -1;
            this.preCol = -1;
            this.Row = -1;
            this.Col = -1;
            newArray[row][col].is_seat=0
          } else if(seatValue === 0){
            if( this.preCol == -1 && this.preRow == -1) {
              newArray[row][col].is_seat=1;
              this.preRow = row;
              this.preCol = col;
            } else {
              newArray[this.preRow][this.preCol].is_seat=0;
              newArray[row][col].is_seat=1;
              this.preRow = row;
              this.preCol = col;
            }
            this.Row = row;
            this.Col = col;
          }
          //必须整体更新二维数组，Vue无法检测到数组某一项更新,必须slice复制一个数组才行
          this.seatArray = newArray.slice();

        }
      },
      //-----签到算法后的签到记录-------
      buySeat: function(){
        var _this = this;
        if(_this.Row === -1 && _this.Col === -1 ) {
          wx.showToast({
            title: '请选择座位',
            icon: 'none',
            duration:2000
          })
        } else if(_this.signitemtype === -1) {
          wx.showToast({
            title: '页面出错，请返回重试',
            icon: 'none',
            duration:2000
          })
        } else {
          console.log(":" + _this.signitemtype)
          if( _this.signitemtype === 0 ) {
            wx.request({
              method: 'POST',
              url: _this.GLOBAL.baseUrl + 'sign/addSignRecord',
              data: {
                signtiemid: _this.signtiemid,
                row: _this.Row,
                col: _this.Col
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token'),
              },
              success (res) {
                res = res.data
                console.log(res);
                if(res.error_code == 0 && res.data !== null || res.data !== '') {
                  _this.preRow = -1;
                  _this.preCol = -1;
                  let oldArray = _this.seatArray.slice();
                  oldArray[_this.Row][_this.Col].is_seat=2;
                  _this.seatArray = oldArray;
                  wx.setStorageSync('signitemid', _this.signtiemid);
                  wx.redirectTo({
                    url: "/pages/sutdengsignresult/main"
                  })
                  // localStorage.setItem('signitemid', JSON.stringify(this.signtiemid));
                  // this.$router.push('/sutdengsignresult');
                } else {
                  wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration:2000
                  })
                }
              }
            })
          } else if( _this.signitemtype === 1 ){
            _this.dialogshow = true;
          } else {
            wx.showToast({
              title: '签到验证出错，请联系老师',
              icon: 'none',
              duration:2000
            })
          }
        }
      },

    },
     // 获取签到信息以及座位信息
    onShow() {
      let _this = this;
      _this.accounttype = wx.getStorageSync('accounttype');
      _this.logintype = wx.getStorageSync('accounttype');
      // this.getSignSeatData();
     
      wx.request({
        method: 'POST',
        url: _this.GLOBAL.baseUrl + 'sign/getStudentSignDetial',
        data: {
          signid: wx.getStorageSync('studentsignid')
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': wx.getStorageSync('token'),
        },
        success (res) {
          //console.log("sssb")
          let swidth;
          wx.getSystemInfo({
            success: res => {
              swidth = res.screenWidth;
            }
          })
          res = res.data;
          console.log(res.data)
          console.log(res.data.signitem.id)
          
          if(res.error_code === 0 ) {
            _this.seatArray = res.data.roomseatlist.data;
            _this.classdata = res.data.signitem;
            _this.signtiemid = res.data.signitem.id;
            _this.classroomid = res.data.signitem.classid;
            _this.signitemtype = res.data.signitem.sign_item_sign_type;
            _this.itemtype = res.data.signitem.sign_item_type;
            _this.latitude = res.data.signitem.sign_item_latitude;
            _this.longitude = res.data.signitem.sign_item_longitude;
            _this.radius = res.data.signitem.sign_item_radius
            _this.seatRow = _this.seatArray.length;
            _this.seatCol = _this.seatArray[0].length;
            _this.seatSize = parseInt(parseInt(swidth,10) / _this.seatCol,10) - 1;
            _this.signing = res.data.signitem.sign_item_in_signing;

            _this.type = res.data.signitem.sign_item_type; // 2 为实验室签到
            _this.begintimehour = parseInt(res.data.signitem.sign_item_begin_time.substring(0,2));
            _this.begintimeminute = parseInt(res.data.signitem.sign_item_begin_time.substring(3,5));
            _this.endtimehour = parseInt(res.data.signitem.sign_item_end_time.substring(0,2));
            _this.endtimeminute = parseInt(res.data.signitem.sign_item_end_time.substring(3,5));
          } else {
            wx.showToast({
              title: '数据错误！',
              icon: 'none',
              duration:2000
            })
          }
        }
      })
      console.log("logintype:" + _this.logintype)
      console.log("signing:" + _this.signing)
    }

  }
</script>

<style scoped>
  @import './../../../static/weui-miniprogram/weui-wxss/dist/style/weui.wxss';
  .classinfocard {
    background-color: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 10px;
    padding: 10px;
    text-align: left;
    border-radius: 10px;
  }
  .classname {
    font-size: 16px;
    color: #585858;
  }
  .classtime {
    font-size: 14px;
    color: #585858;
  }
  .classroomname {
    color: #585858;
    position: relative;
    float: right;
    margin-top: -25px;
  }
  .wrapper{
    width: 100%;
    height:100%;
    box-sizing: border-box;
  }
  .cinema-wrapper{
    height:100%;
  }
  .title{
    text-align: center;
  }
  .seat-wrapper{
    /*width:500px;*/
    border:1px dotted #c5c5c5;
    position: relative;
  }
  .screen{
    margin: 0 auto;
    height:30px;
    width:300px;
    background-color: #e3e3e3;
    border-radius: 0 0 30px 30px;
    color: #585858;
    line-height: 30px;
    text-align: center;
  }
  .inner-seat-wrapper{
    position: absolute;
    top:120px;
    bottom:0;
    width:100%;
    box-sizing: border-box;
  }
  .seat{
    float:left;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .inner-seat{
    width:60%;
    height:60%;
    cursor: pointer;
  }
  .selected-seat{
    background: url('./../../assets/selected.png') center center no-repeat;
    background-size: 100% 100%;
  }
  .unselected-seat{
    background: url('./../../assets/unselected.png') center center no-repeat;
    background-size: 100% 100%;
  }
  .bought-seat{
    background: url('./../../assets/bought.png') center center no-repeat;
    background-size: 100% 100%;
  }
  .screen-center{
    position: absolute;
    left:50%;
    transform: translateX(-50%);
    padding:5px;
    font-size: 13px;
    border-radius: 5px;
    top:50px;
    background-color: #f6f6f6;
    color: #636363;
    border:1px solid #b1b1b1;
  }
  .mid-line{
    position: absolute;
    left:50%;
    transform: translateX(-50%);
    top:100%;
    width:1px;
    height:800px;
    border-left:1px dashed #919191;
  }
  .btn-wrapper{
    margin: 20px auto;
    width:auto;
    height:30px;
    text-align: center;
  }
  .btn-buy{
    height:30px;
    line-height: 30px;
    font-size: 14px;
    border-radius: 5px;
    padding:0 5px;
    background-color: #ffa349;
    color: #ffffff;
    display: inline-block;
    cursor: pointer;
    margin-top: 50px;
    margin-left: calc(50% - 34px);
    /*margin-right: 10px;*/
  }
  .btn-buy-forben{
    height:30px;
    line-height: 30px;
    font-size: 14px;
    border-radius: 5px;
    padding:0 5px;
    background-color: #909399;
    color: #ffffff;
    display: inline-block;
    cursor: pointer;
    margin-top: 50px;
    margin-left: calc(50% - 34px);
    /*margin-right: 10px;*/
  }
  .smart{
    background-color: #39ac6a;
  }
  .illustration{
    position: absolute;
    left:calc(50% - 100px);
    top:40px;
    height:35px;
    width:300px;
  }
  .illustration-img-wrapper{
    width:25px;
    height:25px;
    position: relative;
    top:50%;
    display: inline-block;
    transform: translateY(-50%);
    margin-left: 10px;
  }
  .illustration-text{
    display: inline-block;
    height:100%;
    line-height: 35px;
    font-size: 14px;
    position: relative;
    top:-2px;
  }
  .class {
    font-size: 28rpx;
    color: #585858;
  }
  .signdetiallink {
    position: relative;
    font-size: 25rpx;
    top:-30rpx;
    float: right;
    margin-right: 10rpx;
    color: #F56C6C;
    text-decoration: underline;
  }
</style>
