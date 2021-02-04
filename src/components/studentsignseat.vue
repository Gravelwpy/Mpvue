<template>
  <div class="wrapper">
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
          讲台
        </div>
        <div class="btn-buy" @click="position">
          立即签到
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
                    @click="handleChooseSeat(row-1,col-1)"
                    v-if="seatArray[row-1][col-1].is_seat!==-1"
                    :class="seatArray[row-1][col-1].is_seat===2?'bought-seat':(seatArray[row-1][col-1].is_seat===1?'selected-seat':'unselected-seat')">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-dialog
      :showCancelButton="true"
      :closeOnClickOverlay="true"
      v-model="dialogshow"
      title="请输入签到码"
      @confirm="confirm"
      show-cancel-button>
      <input style="margin-top: 10px;" v-model="checkpass" type="digit" oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入签到码"/>
    </van-dialog>
    <div class="map" id="testpoint"></div>
  </div>
</template>

<script>
  // import BMap from 'BMap'
  export default {
    name: 'studentsignseat',
    props: ['seatarray','signtiemid','signitemtype','latitude', 'longitude', 'sign_item_radius'],
    data () {
      return {
        dialogshow: false,
        checkpass: '',
        //影院座位的二维数组,-1为非座位，0为未购座位，1为已选座位(绿色),2为已购座位(红色)
        seatArray: this.seatarray,
        //影院座位行数
        seatRow:0,
        //影院座位列数
        seatCol:0,
        //座位尺寸
        seatSize:'',
        //推荐选座最大数量
        smartChooseMaxNum:5,
        preRow: -1,
        preCol: -1,
        Row: -1,
        Col: -1,
        wifilist: [
        ],
      }
    },
    computed:{
    },
    watch: {
      seatarray(val) {
        this.seatArray = val
        console.log(this.seatArray)
      }
    },
    methods:{
      confirm() {
        if( this.checkpass === '' ) {
          this.$toast('请输入签到码签到');
        } else {
          // this.$req.post('sign/addSignRecordCheckPass', {
          //   signtiemid: this.signtiemid,
          //   row: this.Row,
          //   col: this.Col,
          //   checkpass: this.checkpass
          // })
          //   .then(res => {
          //     console.log(res);
          //     if(res.error_code === 0 && res.data !== null && res.data !== '') {
          //       this.preRow = -1;
          //       this.preCol = -1;
          //       let oldArray = this.seatArray.slice();
          //       oldArray[this.Row][this.Col].is_seat=2;
          //       this.seatArray = oldArray;
          //       localStorage.setItem('signitemid', JSON.stringify(this.signtiemid));
          //       this.$router.push('/sutdengsignresult');
          //     } else {
          //       this.$toast(res.msg);
          //     }
          //   })
        }
      },
      getdata: function() {
        if (this.seatArray) { // 请求成功
          this.seatRow = this.seatArray.length
          this.seatCol = this.seatArray[0].length

          this.initSeatArray()
        } else {
          console.log('请求的数据不见了，去看一下你的json文件')
        }
      },
      // 定位算法
      position: async function() {
        // console.log(this.latitude +  this.longitude)
        var _this = this;
        await  _this.getwifilist(1);
      },
      getwifilist: function (num) {
        // console.log("diaoyong");
        // if( 'cordova' in window ) {
        //   const _this = this;
        //   cordova.plugins.hotspot.scanWifiByLevel(SSIDlist, errorCB);//扫描当前可用WIFI，此函数第一个参数返回的信息是一个包含 [SSID, BSSID, frequency, level, timestamp, capabilities]
        //   async function SSIDlist(info){
        //     console.log(JSON.stringify(info));
        //     _this.wifilist = info;
        //     const wifi_data = { wifi_test_list:_this.wifilist };
        //     console.log(wifi_data.wifi_test_list.length);
        //     if( wifi_data.wifi_test_list.length == 0 ) {
        //       console.log("未获取到wifi信息");
        //     } else {
        //       console.log(JSON.stringify(wifi_data));
        //       _this.$req.post('wifi/nn_match', {
        //         wifi_info_list : JSON.stringify(wifi_data),
        //         num: num,
        //         type: 0
        //       })
        //         .then(res => {
        //           console.log(res);
        //           if(res.error_code === 0 ) {
        //             var map = new BMap.Map("testpoint");
        //             var pointA = new BMap.Point(parseFloat(_this.longitude),parseFloat(_this.latitude));
        //             var pointB = new BMap.Point(parseFloat(res.data[0].result.longitude),parseFloat(res.data[0].result.latitude));
        //             var distance = map.getDistance(pointA,pointB)
        //             if( distance > _this.sign_item_radius ) {
        //               this.$toast('签到超出范围');
        //             } else {
        //               _this.buySeat();
        //             }
        //           }else {
        //             _this.$toast(res.msg);
        //           }
        //         })
        //     }
        //   }
        //   function errorCB(){
        //     if ('baidumap_location' in window) {
        //       baidumap_location.getCurrentPosition(function (result) {
        //         var map = new BMap.Map("testpoint");
        //         var pointA = new BMap.Point(parseFloat(result.longitude),parseFloat(result.latitude));
        //         var pointB = new BMap.Point(parseFloat(_this.longitude),parseFloat(_this.latitude));
        //         var distance = map.getDistance(pointA,pointB)
        //         if( distance > _this.sign_item_radius ) {
        //           this.$toast('签到超出范围');
        //         } else {
        //           _this.buySeat();
        //         }
        //       }, function (error) {
        //         this.$toast(error);
        //       });
        //     }
        //   }
        // }else if ('baidumap_location' in window) {
        //   baidumap_location.getCurrentPosition(function (result) {
        //     // console.log("百度定位")
        //     // _this.longitude = result.latitude;
        //     // _this.latitude = result.longitude;
        //     // _this.addtestpointlongitude = result.latitude;
        //     // _this.addtestpointlatitude = result.longitude;
        //     var map = new BMap.Map("testpoint");
        //     var pointA = new BMap.Point(parseFloat(result.longitude),parseFloat(result.latitude));
        //     var pointB = new BMap.Point(parseFloat(_this.longitude),parseFloat(_this.latitude));
        //     var distance = map.getDistance(pointA,pointB)
        //     if( distance > _this.sign_item_radius ) {
        //       this.$toast('签到超出范围');
        //     } else {
        //       _this.buySeat();
        //     }
        //   }, function (error) {
        //     this.$toast(error);
        //   });
        // } else {
        //   this.$toast('缺少调用组件');
        // }

      },
      //签到
      buySeat: function(){
        if(this.Row === -1 && this.Col === -1 ) {
          this.$toast('请选择座位');
        } else if(this.signitemtype === -1) {
          this.$toast('页面出错，请返回重试');
        } else {
          if( this.signitemtype === 0 ) {
            // this.$req.post('sign/addSignRecord', {
            //   signtiemid: this.signtiemid,
            //   row: this.Row,
            //   col: this.Col
            // })
            //   .then(res => {
            //     console.log(res);
            //     if(res.error_code == 0 && res.data !== null || res.data !== '') {
            //       this.preRow = -1;
            //       this.preCol = -1;
            //       let oldArray = this.seatArray.slice();
            //       oldArray[this.Row][this.Col].is_seat=2;
            //       this.seatArray = oldArray;
            //       localStorage.setItem('signitemid', JSON.stringify(this.signtiemid));
            //       this.$router.push('/sutdengsignresult');
            //     } else {
            //       this.$toast(res.msg);
            //     }
            //   })
          } else if( this.signitemtype === 1 ){
            this.dialogshow = true;
          } else {
            this.$toast('签到验证出错，请联系老师');
          }
        }
      },
      //处理座位选择逻辑
      handleChooseSeat: function(row,col){
        let seatValue = this.seatArray[row][col].is_seat;
        console.log(seatValue)
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
        }else if(seatValue === 0){
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
      },
      //初始座位数组
      initSeatArray: function(){
        let swidth;
        wx.getSystemInfo({
          success: res => {
            swidth = res.screenWidth;
          }
        })
        console.log(swidth)
        this.seatRow = this.seatArray.length;
        this.seatCol = this.seatArray[0].length;
        // let seatArray = Array(this.seatRow).fill(0).map(()=>Array(this.seatCol).fill(0));
        // this.seatArray = seatArray;
        this.seatSize = this.$refs.innerSeatWrapper
          ? parseInt(parseInt(swidth,10) / this.seatCol,10)
          :0;
        //初始化不是座位的地方
        this.initNonSeatPlace();
      },
      //初始化不是座位的地方 -1为不是座位的地方
      initNonSeatPlace: function(){

      }

    },
    created: function() {
      setTimeout(this.getdata, 100)
    },
    mounted:function(){

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    background: url('./../assets/selected.png') center center no-repeat;
    background-size: 100% 100%;
  }
  .unselected-seat{
    background: url('./../assets/unselected.png') center center no-repeat;
    background-size: 100% 100%;
  }
  .bought-seat{
    background: url('./../assets/bought.png') center center no-repeat;
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
    /*margin-right: 10px;*/
  }
  .smart{
    background-color: #39ac6a;
  }
  .illustration{
    position: absolute;
    left:calc(50% - 150px);
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

</style>
