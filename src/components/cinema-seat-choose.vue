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
        <div class="btn-buy" @click="buySeat">
          立即签到
        </div>
        <div class="inner-seat-wrapper" ref="innerSeatWrapper" >
          <div v-for="row in seatRow">
            <!--这里的v-if很重要，如果没有则会导致报错，因为seatArray初始状态为空-->
            <div v-for="col in seatCol"
                 v-if="seatArray.length>0"
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
</template>

<script>
  import axios from 'axios'
  import { Toast } from 'vant';
	export default {
		name: 'cinemaSeatChoose',
    props: ['seatarray'],
		data () {
			return {
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
        preCol: -1
			}
		},
    computed:{
    },
    watch: {
      seatarray(val) {
        this.seatArray = val
      }
    },
    methods:{
      getdata: function() {
        if (this.seatArray) { // 请求成功
          this.seatRow = this.seatArray.length
          this.seatCol = this.seatArray[0].length

          this.initSeatArray()
        } else {
          console.log('请求的数据不见了，去看一下你的json文件')
        }
      },
			//选定且购买座位
      buySeat: function(){
        this.preRow = -1;
        this.preCol = -1;
      	//遍历seatArray，将值为1的座位变为2
        let oldArray = this.seatArray.slice();
        for(let i=0;i<this.seatRow;i++){
        	for(let j=0;j<this.seatCol;j++){
        		if(oldArray[i][j].state===1){
              oldArray[i][j].state=2
            }
          }
        }
        this.seatArray = oldArray;
      },
			//处理座位选择逻辑
      handleChooseSeat: function(row,col){
        let seatValue = this.seatArray[row][col].state;
        let newArray = this.seatArray;
        //如果是不可选座位，直接返回
        if(seatValue===2) return
        //如果是已选座位点击后变未选
        if(seatValue === 1){
          this.preRow = -1;
          this.preCol = -1;
          newArray[row][col].state=0
        }else if(seatValue === 0){
          if( this.preCol == -1 && this.preRow == -1) {
            newArray[row][col].state=1;
            this.preRow = row;
            this.preCol = col;
          } else {
            newArray[this.preRow][this.preCol].state=0;
            newArray[row][col].state=1;
            this.preRow = row;
            this.preCol = col;
          }
        }
        //必须整体更新二维数组，Vue无法检测到数组某一项更新,必须slice复制一个数组才行
        this.seatArray = newArray.slice();
      },
      //初始座位数组
      initSeatArray: function(){
        this.seatRow = this.seatArray.length;
        this.seatCol = this.seatArray[0].length;
        // let seatArray = Array(this.seatRow).fill(0).map(()=>Array(this.seatCol).fill(0));
        // this.seatArray = seatArray;
        this.seatSize = this.$refs.innerSeatWrapper
                        ? parseInt(parseInt(window.getComputedStyle(this.$refs.innerSeatWrapper).width,10) / this.seatCol,10)
                        :0;
        //初始化不是座位的地方
        this.initNonSeatPlace();
      },
      //初始化不是座位的地方 -1为不是座位的地方
      initNonSeatPlace: function(){
        // for(let i=0;i<1;i++){
        //   this.seatArray[i][0].state=-1;
        // }
        // for(let i=0;i<5;i++){
        //   this.seatArray[i][this.seatArray[0].length-1]=-1;
        //   this.seatArray[i][this.seatArray[0].length-2]=-1;
        // }
        // for(let i=0;i<5;i++){
        //   this.seatArray[i][this.seatArray[0].length-3]=-1;
        // }
        // for(let i=0;i<this.seatArray[0].length;i++){
        //   this.seatArray[2][i]=-1;
        // }

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
