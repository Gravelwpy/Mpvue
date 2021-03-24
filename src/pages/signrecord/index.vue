<template>
  <div class="signlist">
    <div v-for="(item, index) in tableData" :key="index">
      <div class="itemcard" @click="toSignDetail(item.id)">
        <div class="signname"> {{ item.sign_item_name }} {{ '  ' }}  {{ item.tname }}</div>
        <div class="signtime"> {{ item.signtime }}</div>
        <div class="classname"> {{ item.room_name }}</div>
      </div>
    </div>

    <div class="pagination">
      <div class="propage" @click="getPrePage">
        上一页
      </div>
      <div class="numbersty">
        {{page}}/{{pagetotal}}
      </div>
      <div class="nextpage" @click="getNextPage">
        下一页
      </div>
    </div>
    
  </div>
</template>

<script>
  export default {
    name: "signmanagement",
    components: {},
    data: function () {
      return {
        page: 1,
        size: 4,
        total: 0,
        pagetotal: 0,
        tableData: [],
      }
    },
    methods: {
      getPrePage() {
        if( this.page > 1 ) {
          this.page--;
          this.getTableList();
        } else {
          wx.showToast({
                  title: '已是第一页',
                  icon: 'none',
                  duration:2000
                })
        }
      },
      getNextPage() {
        if( this.page < this.pagetotal ) {
          this.page++;
          this.getTableList();
        } else {
          wx.showToast({
                  title: '已是最后一页',
                  icon: 'none',
                  duration:2000
                })
        }
      },
      // 传参方法要改变
      toSignDetail(tid) {
        wx.setStorageSync('signitemid', tid);
          wx.navigateTo({
            url: "/pages/sutdengsignresult/main"
          })
      },
      change(item) {
        this.page = item;
        this.getTableList()
      },
      onClickLeft() {
        this.$router.push('/sign');
      },
      getTableList() {
        let _this = this;
        wx.request({
            method: 'POST',
            url: _this.GLOBAL.baseUrl + 'sign/getStudeentRecorded',
            data: {
              page: _this.page,
              size: _this.size
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'token': wx.getStorageSync('token'),
            },
            success (res) {
              console.log(res.data)
              if( res.data.error_code === 0 ) {
                _this.tableData = res.data.data.data
                _this.total = res.data.data.number
                let n = _this.total / _this.size
                _this.pagetotal = Math.ceil(n)
              } else {
                wx.showToast({
                  title: '数据错误',
                  icon: 'none',
                  duration:2000
                })
              }
            }
          })
      },
    },
    onShow: function () {
      this.getTableList();
    },
  }
</script>

<style scoped>
  .pagination {
    position: absolute;
    display: flex;
    width: 100%;
    bottom: 0px;
  }
  .propage {
    display: flex;
    width: 33%;
    background-color: #0099ff;
    height: 90rpx;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .numbersty {
    display: flex;
    width: 34%;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .nextpage {
    display: flex;
    width: 33%;
    background-color: #0099ff;
    align-items: center;
    text-align: center;
    justify-content: center;
  }
  .itemade {
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background-color: white;
    height: 62px;
    margin: 5px 10px;
    display: flex;
    padding: 10px;
    font: 12px/1.5 Tahoma,Helvetica,Arial,'宋体',sans-serif;
  }
  .itemname {
    color: #434d57;
    font-size: 16px;
    position: absolute;
  }
  .itemclass {
    color: #434d57;
    font-size: 17px;
    position: absolute;
    right: 30px;
  }
  .itemtime {
    color: #969799;
    font-size: 14px;
    position: absolute;
    margin-top: 30px;
  }
  .signlist {
    height: 100%;
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
  }
  .itemcard {
    margin: 15rpx;
    width: calc(80% - 60rpx);
    margin-left: 10%;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20rpx 30rpx;
    border-radius: 20rpx;
  }
  .signname {
    color: #303133;
    font-size: 30rpx;
  }
  .signtime {
    margin-top: 20rpx;
    color: #909399;
    font-size: 25rpx;
  }
  .signtname {
    position: relative;
    float: right;
    margin-top: -60rpx;
    color: #606266;
    font-size: 30rpx;
  }
  .classname {
    position: relative;
    float: right;
    margin-top: -70rpx;
    color: #606266;
    font-size: 30rpx;
  }
</style>
