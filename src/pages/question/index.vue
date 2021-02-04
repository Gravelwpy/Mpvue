<template>
  <div class="question" >
    <div class="tipfontcss">如果您在使用过程中遇到任何困难或者对本程序有任何的意见或建议可在此反馈，如果您有什么想添加的新功能也可以在此提出，我们将会尽快做出答复</div>
    <van-cell-group>
      <van-field
        v-bind:value="desc"
        type="textarea"
        placeholder="请简要描述遇到的问题"
        autosize
        @change="onChange"
        rows=5
      />
    </van-cell-group>

    <div class="subbut">
      <van-button color="#a7a388" @click="onSubmit" round size="large">提交</van-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    components: {},
    data: function() {
      return {
        desc: ''
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      onChange(e) {
        let _this = this;
        _this.desc = e.mp.detail
      },
      onSubmit() {
        let _this = this;
        if (_this.desc === '') {
          wx.showToast({
                title:'请按要求输入',
                icon: 'none',
                duration:2000
              })
        } else {
            wx.request({
              method: 'POST',
              url: _this.GLOBAL.baseUrl + 'question/addquestion', 
              data: {
                desc: _this.desc
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                'token': wx.getStorageSync('token'),
              },
              success (res) {
                console.log(res.data)
                if( res.data.error_code === 0 ) {
                  wx.showToast({
                    title: '提交成功',
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
    }

  }
</script>

<style scoped>
.question {
  width: 90%;
  margin-top: 30rpx;
  margin-left: 5%;
}
  .subbut {
    width: 80%;
    margin-left: 10%;
    margin-top: 30rpx;
  }
  .tipfontcss {
    color: #C0C4CC;
    font-size: 28rpx;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 20rpx;
    padding: 20rpx;
  }
</style>
