<template>
  <div class="addsign">
    <div class="itemborder" @click="setItemLocal">
      <div class="item">
        <div class="itemtitle">当前地点:</div>
        <div class="itemcontent">{{ chooseItem.localnamefirst }}</div>
      </div>
      <div class="item">
        <div class="itemtitle">当前测试点:</div>
        <div class="itemcontent">{{ chooseItem.localsubname }}</div>
      </div>
    </div>

    <div class="itemborder">
      <div class="item">
        <div class="itemtitle">测试组数:</div>
        <div class="itemcontent"><van-stepper :value="chooseItem.testnumber" step="10" min="10" max="100" /></div>
      </div>
      <div class="item">
        <div class="itemtitle">经纬度:</div>
        <div class="itemcontent">经度:{{ chooseItem.longitude }}</div>
        <div class="itemcontent" style="margin-top: -5rpx;">纬度:{{ chooseItem.latitude }}</div>
      </div>
    </div>

    <div class="itemborder">
      <div class="item">
        <div class="itemtitle">当前手机品牌:</div>
        <div class="itemcontent">{{ chooseItem.brand }}</div>
      </div>
      <div class="item">
        <div class="itemtitle">当前手机型号:</div>
        <div class="itemcontent">{{ chooseItem.deviceManufacturer }}</div>
      </div>
    </div>

    <!-- <div class="newitem">
      <div class="group">
        <van-cell title="考勤点" class="content" :value="chooseItem.localname" @click="setItemLocal" is-link/>
      </div>
    </div> -->
    <div class="savebutton">
      <van-button color="#a7a388" round block @click="getwifiinfo">开始测试</van-button>
    </div>
    <!--弹出层-->
    <van-action-sheet
      :show="show"
      cancel-text="取消"
      @cancel="onCancel"
      :actions="classactions"
      @select="onSelect" />

    <van-action-sheet
      :show="groupshow"
      cancel-text="取消"
      @cancel="onCancel"
      :actions="groupactions"
      @select="onGroupSelect" />


    <mp-dialog title="请输入考勤组名称" :show="dialogshow" :buttons="buttons" @close="bindclose" @buttontap="buttontap">
      <input style="margin-top: 10px;" v-model="chooseItem.name" type="digit" placeholder="请输入实验室签到名称" v-if="chooseItem.typeid === 2"/>
      <input style="margin-top: 10px;" v-model="chooseItem.name" type="digit" placeholder="建议格式为日期加课程名加上课班级" v-else-if="chooseItem.typeid === 1"/>
      <div v-else>请先选择考勤类型</div>
    </mp-dialog>

    <van-action-sheet
      :show="typeshow"
      cancel-text="取消"
      @cancel="onCancel"
      :actions="typeactions"
      @select="onSelectType" />

    <van-action-sheet
      :show="timeshow"
      :actions="timeactions"
      @select="onSelectTime"
      cancel-text="确定"
      @cancel="onCancelTime">
    </van-action-sheet>

    <van-action-sheet
      style="height: 50%;overflow: auto"
      :show="localshow"
      :actions="localactions"
      cancel-text="取消"
      @select="onSelectLocal"
      @cancel="onCancel"
    />

    <van-action-sheet
      style="height: 50%;overflow: auto"
      :show="roomidshow"
      :actions="roomidactions"
      @select="onSelectRoomId"
      cancel-text="取消"
      @cancel="onCancel"
    />

    <mp-dialog title="请输入考勤范围" :show="areashow" :buttons="buttons" @close="areabindclose" @buttontap="areabuttontap">
      <input style="margin-top: 10px;" v-model="chooseItem.area" type="digit" placeholder="请输入考勤范围"/>
    </mp-dialog>


    <van-action-sheet
      :show="signtypeshow"
      cancel-text="取消"
      @cancel="onCancel"
      :actions="signtypeshowactions"
      @select="onSelectSignType" />

    <!-- <van-dialog :showCancelButton="false" :closeOnClickOverlay="true" v-model="passshow" title="请输入签到码" show-cancel-button>
      <input style="margin-top: 10px;" v-model="chooseItem.password" type="digit" placeholder="请输入签到码"/>
    </van-dialog> -->
    <mp-dialog title="请输入签到码" :show="passshow" :buttons="buttons" @close="passbindclose" @buttontap="passbuttontap">
      <input style="margin-top: 10px;" v-model="chooseItem.password" type="digit" placeholder="请输入签到码"/>
    </mp-dialog>

    <van-datetime-picker
      v-if="chooseBeginTime"
      class="begintime"
      type="time"
      :value="chooseItem.begintime"
      @input="onInputBegin"
      @confirm="confirmBeginTimeChoose"
      @cancel="cancelBeginTimeChoose"
    />

    <van-datetime-picker
      v-if="chooseEndTime"
      class="begintime"
      type="time"
      :min-hour="endMinHour"
      :min-minute="endMinMinute"
      :value="chooseItem.endtime"
      @input="onInputEnd"
      @confirm="confirmEndTimeChoose"
      @cancel="cancelEndTimeChoose"
    />

  </div>
</template>

<script>
  export default {
    name: 'teacheraddsign',
    data() {
      return {
        // time
        datatime: [
          { name: '周一'},
          { name: '周2'},
          { name: '周3'},
          { name: '周4'},
          { name: '周5'},
          { name: '周6'},
          { name: '周7'},
        ],
        endMinMinute: 0,
        endMinHour: 0,
        chooseEndTime: false,
        chooseBeginTime: false,
        groupshow: false,
        roomidshow: false,
        passshow: false,
        signtypeshow: false,
        areashow: false,
        localshow: false,
        defaulttime: new Date(2016, 9, 10, 18, 40),
        timeshow: false,
        typeshow: false,
        false: false,
        true: true,
        buttons: [ {text: '确定'}],
        chooseItem: {
          sendtype: 1,
          loc_id: '',
          timer: '',
          gettestnumber: 0,
          wifilist: [],
          testnumber: 10,
          deviceManufacturer: '',
          brand: '',

          begintime: '',
          endtime: '',
          minBeginHour: 10,
          maxBeginHour: 20,

          groupid: '',
          groupname: '',
          roomname: '',
          roomid: '',
          classname: '',
          classid: '',
          name: '',
          type: '',
          typeid: '',
          time: '',
          localname: '',
          localnamefirst: '',
          localsubname: '',
          latitude: '',
          longitude: '',
          area: 200,
          signtype: 0,
          signtypename: '直接签到',
          password: ''
        },
        dialogshow: false,
        show: false,
        groups: [
          { text: '示例菜单', value: 1 },
          { text: '示例菜单', value: 2 },
          { text: '负向菜单', type: 'warn', value: 3 }
        ],
        timeactions: [
          { name: '设置签到开始时间', timetype: 0 },
          { name: '设置签到结束时间', timetype: 1 }
        ],
        signtypeshowactions: [
          { name: '直接签到', subname: '学生可直接点击签到', type: 0 },
          { name: '签到码签到', subname: '学生需要输入签到码签到', type: 1 }
        ],
        roomidactions: [
          { name: '选项' },
          { name: '选项' },
          { name: '选项', subname: '描述信息' }
        ],
        localactions: [
          { name: '选项' },
          { name: '选项' },
          { name: '选项', subname: '描述信息' }
        ],
        classactions: [
          { name: '选项' },
          { name: '选项' },
          { name: '选项', subname: '描述信息' }
        ],
        groupactions: [
          { name: '选项' },
          { name: '选项' },
          { name: '选项', subname: '描述信息' }
        ],
        typeactions: [
          { name: '课堂签到', typeid: 1 ,subname: '上课签到'},
          { name: '实验室签到', typeid: 2 ,subname: '实验室定时签到'},
        ],
        count: 0,
        isLoading: false
      }
    },
    watch:{
      'chooseItem.area':{
        deep:true,
        handler:function(val){
          this.chooseItem.area = val.replace(/[^\d]/g,'');
        }
      }
    },
    methods: {
      getwifiinfo() {
        var _this = this;
        if( _this.chooseItem.localnamefirst === '' && _this.chooseItem.localnamefirst === '' ) {
        //if(false) {
          wx.showToast({
            title: "请选择地点或测试点",
            icon: 'none',
            duration:2000
          })
        } else{
          var _this = this;
          wx.getSystemInfo({
            success:function(res){
              if(res.platform == "devtools"){
                console.log("PC")
              }else if(res.platform == "ios"){
                _this.chooseItem.sendtype = 3;
                // 需要跳转到系统 WiFi 列表，等到列表刷新出 WiFi，在微信前台的小程序才会收到 onGetWifiList 的回调；
                console.log("IOS")
                // 初始化计数
                _this.chooseItem.gettestnumber = 0;
                // console.log("test1");
                _this.timer = setInterval(async () => {
                  await setTimeout(_this.geiandroidwifiinfo(), 0)
                }, 3000)
              }else if(res.platform == "android"){//安卓微信小程序
                _this.chooseItem.sendtype = 2;
                // 初始化计数
                _this.chooseItem.gettestnumber = 0;
                // console.log("test1");
                _this.timer = setInterval(async () => {
                  await setTimeout(_this.geiandroidwifiinfo(), 0)
                }, 3000)
              }
            }
          })

        }
      },
      geiandroidwifiinfo() {
        var _this = this;
        if( _this.chooseItem.gettestnumber > _this.chooseItem.testnumber ) {
          clearTimeout(this.timer);
          // console.log(_this.chooseItem.wifilist)
          // save info
          console.log(_this.chooseItem.wifilist)
          wx.request({
            method: 'POST',
            url: _this.GLOBAL.baseUrl + 'wifi_record/add_record',
            data: {
              loc_id : _this.chooseItem.loc_id,
              phone_info: _this.chooseItem.brand + " " + _this.chooseItem.deviceManufacturer,
              wifi_info_list : JSON.stringify( { "wifi_test_list": _this.chooseItem.wifilist}),
              type: _this.chooseItem.sendtype
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded', // 默认值
              'token': wx.getStorageSync('token')
            },
            success (res) {
              console.log(res.data)
              if( res.data.error_code === 0 ) {
                wx.showToast({
                  title:'测试成功',
                  icon: 'none',
                  duration:2000
                })
                _this.chooseItem.wifilist = [];
              } else {
                wx.showToast({
                  title: res.data.msg,
                  duration:2000
                })
              }
            }
          })

        } else {
          // console.log("test");
          try {
            wx.startWifi({
              success (res) {
                // console.log(res.errMsg)
                wx.getWifiList ({
                })
              }
            })
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
              var a = CALLBACK.wifiList;
              _this.chooseItem.wifilist[ _this.chooseItem.gettestnumber - 1 ] = a;
              _this.chooseItem.gettestnumber++;
              console.log(a);
            });
          } catch (e) {
            wx.showToast({
              title:'wifi信号获取失败',
              icon: 'none',
              duration:2000
            })
          }
        }
         console.log(_this.chooseItem.gettestnumber);
         console.log(_this.chooseItem.testnumber);
      },
      onCheckChange(e) {
        console.log(e)
      },
      cancelEndTimeChoose() {
        let _this = this;
        _this.chooseEndTime = false;
      },
      confirmEndTimeChoose() {
        let _this = this;
        _this.chooseEndTime = false;
      },
      onInputEnd( obj ) {
        let _this = this;
        _this.chooseItem.endtime = obj.target[0] + obj.target[1] + obj.target[2] + obj.target[3] + obj.target[4]
      },
      cancelBeginTimeChoose() {
        let _this = this;
        _this.chooseBeginTime = false;
      },
      confirmBeginTimeChoose() {
        let _this = this;
        _this.chooseBeginTime = false;
      },
      onInputBegin( obj ) {
        let _this = this;
        _this.chooseItem.begintime = obj.target[0] + obj.target[1] + obj.target[2] + obj.target[3] + obj.target[4]
        _this.endMinHour = 10 * obj.target[0] + obj.target[1]
        _this.endMinMinute = 10 * obj.target[3] + obj.target[4]
        _this.chooseItem.endtime = obj.target[0] + obj.target[1] + obj.target[2] + obj.target[3] + obj.target[4]
      },
      onSelectTime(obj) {
        let _this = this;
        if( obj.target.timetype === 0 ) { // 开始时间
          _this.chooseBeginTime = true;
        } else if( obj.target.timetype === 1 ) { // 设置结束时间
          _this.chooseEndTime = true;
        }
      },
      onGroupSelect(item) {
        let _this = this;
        console.log(item)
        _this.chooseItem.groupname = item.target.name
        _this.chooseItem.groupid = item.target.id
        _this.groupshow = false;
      },
      getgrouplist() {
        let _this = this;
        wx.request({
          method: 'GET',
          url: _this.GLOBAL.baseUrl + 'group/miniPrograGetTeacherGroupList',
          data: { },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
          },
          success (res) {
            console.log(res.data)
            if( res.data.error_code === 0 ) {
              _this.groupactions = res.data.data;
              _this.groupshow = true;
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration:2000
              })
            }
          }
        })
      },
      selectGroup() {
        this.getgrouplist();
      },
      passbuttontap(e) {
        let _this = this;
        _this.passshow = false
      },
      passbindclose(e) {
        let _this = this;
        _this.passshow = false
      },
      areabuttontap(e) {
        let _this = this;
        _this.areashow = false
      },
      areabindclose(e) {
        let _this = this;
        _this.areashow = false
      },
      buttontap(e) {
        let _this = this;
        _this.dialogshow = false
      },
      bindclose(e) {
        let _this = this;
        _this.dialogshow = false
      },
      nameclose() {
        this.dialogshow = false;
      },
      getAllRoom() {
        let _this = this;
        wx.request({
          method: 'POSt',
          url: _this.GLOBAL.baseUrl + 'classroom/miniproTeacherGetClassRoomList', //仅为示例，并非真实的接口地址
          data: { },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
          },
          success (res) {
            console.log(res.data)
            if( res.data.error_code === 0 ) {
              _this.roomidactions = res.data.data.data;
              _this.roomidshow = true;
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration:2000
              })
            }
          }
        })
      },
      onSelectRoomId(item) {
        this.chooseItem.roomid = item.target.id
        this.chooseItem.roomname = item.target.name
        this.roomidshow = false
      },
      setItemRoomId() {
        this.getAllRoom();
        // this.roomidshow = true
      },
      testTime() {
        console.log(this.chooseItem.time[0])
      },
      subMsg() {
        let _this = this;
        if( _this.chooseItem.classid === '' ) {
          _this.chooseItem.classid = _this.chooseItem.groupid
        }
        if( _this.chooseItem.type === '' ||
          _this.chooseItem.name === '' ||
          _this.chooseItem.classid === '' ||
          _this.chooseItem.latitude === '' ||
          _this.chooseItem.longitude === '' ||
          _this.chooseItem.area === '' ||
          _this.chooseItem.roomid === ''
        ) {
          wx.showToast({
            title: '请按要求填写输入信息',
            icon: 'none',
            duration:2000
          })
        } else {
          if(( ( _this.chooseItem.begintime === '' || _this.chooseItem.endtime === '' ) && _this.chooseItem.typeid  === 2) ||  (_this.chooseItem.signtype === 1 && _this.chooseItem.password === '')) {
            wx.showToast({
              title: '请按要求填写输入信息',
              icon: 'none',
              duration:2000
            })
          } else {
            let _this = this;
            wx.request({
              method: 'POSt',
              url: _this.GLOBAL.baseUrl + 'sign/addSignItem', //仅为示例，并非真实的接口地址
              data: {
                type: _this.chooseItem.typeid,
                name: _this.chooseItem.name,
                classid: _this.chooseItem.classid,
                latitude:_this.chooseItem.latitude,
                longitude:_this.chooseItem.longitude,
                radius:_this.chooseItem.area,
                begintime: _this.chooseItem.begintime,
                endtime: _this.chooseItem.endtime,
                check: _this.chooseItem.password,
                signtype: _this.chooseItem.signtype,
                classroomid: _this.chooseItem.roomid,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token')
              },
              success (res) {
                console.log(res.data)
                if( res.data.error_code === 0 ) {
                  wx.showToast({
                    title: '添加成功',
                    icon: 'none',
                    duration:2000
                  })
                } else {
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
      },
      setSignTypePass() {
        this.passshow = true
      },
      onSelectSignType(item) {
        this.chooseItem.signtype = item.target.type
        this.chooseItem.signtypename = item.target.name
        this.signtypeshow = false
      },
      setSignTypeName() {
        this.signtypeshow = true
      },
      setItemLocalArea() {
        this.areashow = true
      },
      onSelectLocal(item) {
        console.log(item)
        this.chooseItem.loc_id = item.target.loc_id
        this.chooseItem.latitude = item.target.latitude
        this.chooseItem.longitude = item.target.longitude
        this.chooseItem.localname = item.target.name + item.target.subname
        this.chooseItem.localnamefirst = item.target.name
        this.chooseItem.localsubname = item.target.subname
        this.localshow = false;
      },
      getLocalListByName() {
        let _this = this;
        wx.request({
          method: 'POSt',
          url: _this.GLOBAL.baseUrl + 'location/getLocList', //仅为示例，并非真实的接口地址
          data: { },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
          },
          success (res) {
            console.log(res.data)
            if( res.data.error_code === 0 ) {
              _this.localactions = res.data.data[0].list;
              _this.localshow = true;
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration:2000
              })
            }
          }
        })
      },
      setItemLocal() {
        this.getLocalListByName()
      },
      onCancelTime() {
        let _this = this;
        _this.timeshow = false
        // console.log("sss")
      },
      setItemTime() {
        this.timeshow = true
      },
      onSelectType(item) {
        console.log(item)
        this.chooseItem.type = item.target.name
        this.chooseItem.typeid = item.target.typeid
        this.typeshow = false
      },
      setItemType() {
        this.typeshow =true
      },
      setItemName() {
        this.dialogshow = true
      },
      getclasslist() {
        let _this = this;
        wx.request({
          method: 'GET',
          url: _this.GLOBAL.baseUrl + 'class/miniPrograGetTeacherTeachClass', //仅为示例，并非真实的接口地址
          data: { },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'token': wx.getStorageSync('token')
          },
          success (res) {
            console.log(res.data)
            if( res.data.error_code === 0 ) {
              _this.classactions = res.data.data;
              _this.show = true;
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration:2000
              })
            }
          }
        })
      },
      selectClass() {
        this.getclasslist();
      },
      onSelect(item) {
        let _this = this;
        console.log(item)
        _this.chooseItem.classname = item.target.name
        _this.chooseItem.classid = item.target.class_id
        _this.show = false;
      },
      onCancel() {
        let _this = this;
        _this.groupshow = false;
        _this.show = false
        _this.typeshow = false
        _this.localshow = false
        _this.roomidshow = false
        _this.signtypeshow = false
      },
      onClickLeft() {
        this.$router.push('/sign');
      },
      showmap() {

        let onDeviceReady = function () {
          initBaiduMap();
        };

        function initBaiduMap() {
          // 进行定位
          if ('baidumap_location' in window) {
            alert("定位中...");
            baidumap_location.getCurrentPosition(function (result) {
              alert(result.latitude);
              alert(result.longitude);
              alert(JSON.stringify(result));
            }, function (error) {
              console.error(error);
            });
          } else {
            console.error('baidumap_location is undefined');
          }
        }

        document.addEventListener("deviceready", onDeviceReady, false);

      },
      apitest() {
        this.$req.post('helloSpringBoot', {
        })
          .then(res => {
            console.log(res);
          })
      },
    },
    onShow: function () {
      try {
        const res = wx.getSystemInfoSync()
        this.chooseItem.deviceManufacturer = res.model;
        this.chooseItem.brand = res.brand;
      } catch (e) {
        wx.showToast({
          title:'设备信息获取失败',
          icon: 'none',
          duration:2000
        })
      }
    },
    mounted(){
    },
  }
</script>

<style scoped>
  .newitem {
    width: 100%;
  }
  .group {
    margin-top: 10px;
  }
  .content {
    text-align: left;
  }
  .savebutton {
    width: 80%;
    margin-top: 30px;
    /*background-color: white;*/
    /*padding: 20px;*/
    /*position:absolute;*/
    /*bottom: 0px;*/
    /*width: calc( 100% - 40px );*/
  }
  .addsign {
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
  .begintime {
    position:absolute;
    width: 100%;
    z-index: 100;
  }
  .week {
    float: left;
  }
  .itemborder {
    height: 600rpx;
    width: 100%;
    display: flex;
  }
  .item {
    border-radius: 20rpx;
    width: 50%;
    margin: 10rpx;
    background-color: white;
  }
  .itemtitle {
    margin-left: 20rpx;
    font-size: 30rpx;
    margin-top: 20rpx;
  }
  .itemcontent {
    text-align: center;
    margin-top: 20rpx;
  }
  .testbut {
    border-radius: 10rem;
    background-color: white;
  }
  .testbut_forn {
    position: absolute;
    font-size: 30rpx;
  }
</style>
