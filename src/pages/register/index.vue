<template>
  <div>
    <div class="register">
      <van-cell-group>

        <van-field
          v-model="studentnumber"
          label="学号"
          placeholder="请输入学号"
          @change="studentnumberchange"
          :error-message="studentnumbererror"
        />

        <van-field
          v-model="studentname"
          label="姓名"
          placeholder="请输入姓名"
          @change="studentnamechange"
          :error-message="studentnameerror"
        />

        <van-field
          v-model="studentgradename"
          label="班级"
          disabled
          @click="choosegrade"
          placeholder="请选择班级"
          :error-message="studentgradeerror"
        />

        <div class="sexchoose">
          <div @click="chooseman" class="mancss" v-bind:class="{ choosebackground: studentsex == '男' }">男</div>
          <div @click="choosewoman" class="womancss" v-bind:class="{ choosebackground: studentsex == '女' }">女</div>
        </div>

        <van-field
          v-model="studenttelephone"
          label="电话"
          placeholder="请输入电话"
          @change="studenttelephonechange"
          :error-message="studenttelephoneerror"
        />

        <van-field
          v-model="studentemail"
          label="邮箱"
          placeholder="请输入邮箱"
          @change="studentemailchange"
          :error-message="studentemailerror"
        />

        <van-field
          :value="studentpassword"
          label="密码"
          placeholder="请输入密码"
          @change="studentpasswordchange"
          :error-message="studentpassworderror"
        />

        <van-field
          v-model="studentpasswordagain"
          label="重输密码"
          placeholder="请再次输入密码"
          @change="studentpasswordagainchange"
          :error-message="studentpasswordagainerror"
        />

      </van-cell-group>
    </div>
    <div class="subbut">
      <van-button color="#a7a388" @click="onSubmit" round size="large">提交</van-button>
    </div>

    <van-action-sheet
      :show="show"
      cancel-text="取消"
      @cancel="onCancel"
      :actions="classactions"
      @select="onSelect" />

  </div>
</template>

<script>
  export default {
    name: 'Index',
    components: {},
    data: function() {
      return {
        studentnumber: '',
        studentnumbererror: '',
        studentname: '',
        studentnameerror: '',
        studenttelephone: '',
        studenttelephoneerror: '',
        studentemail: '',
        studentemailerror: '',
        studentsex: '男',
        studentpassword: '',
        studentpassworderror: '',
        studentpasswordagain: '',
        studentpasswordagainerror: '',
        studentgrade: '',
        studentgradename: '',
        classactions: [],
        show: false
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      onSelect(item) {
        this.studentgradename = item.target.name
        this.studentgrade  = item.target.class_id
        this.show = false;
      },
      onCancel() {
        let _this = this;
        _this.show = false;
      },
      choosegrade() {
        let _this = this;
        wx.request({
          method: 'GET',
          url: _this.GLOBAL.baseUrl + 'class/getclasslist',
          data: { },
          header: {
            'content-type': 'application/x-www-form-urlencoded',
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
      onSubmit() {
        if( this.studentnumbererror != '' ||
          this.studentnameerror != '' ||
          this.studentemailerror != '' ||
          this.studentpassworderror != '' ||
          this.studentpasswordagainerror != '' ||
          this.studenttelephoneerror != ''||

          this.studentnumber == ''||
          this.studentname == ''||
          this.studenttelephone == ''||
          this.studentemail == ''||
          this.studentpassword == ''||
          this.studentpasswordagain == ''||
          this.studentgrade == ''
        ) {
          wx.showToast({
            title:'请按要求输入个人信息',
            icon: 'none',
            duration:2000
          })
        } else {
          var _this = this;
          wx.request({
            method: 'POST',
            url: _this.GLOBAL.baseUrl + 'account/signup',
            data: {
              stu_code: this.studentnumber,
              password: this.studentpassword,
              stu_name: this.studentname,
              sex: this.studentsex,
              grade: this.studentgrade,
              tele: this.studenttelephone,
              email: this.studentemail
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'token': wx.getStorageSync('token'),
            },
            success (res) {
              console.log(res.data)
              if( res.data.error_code === 0 ) {
                wx.showToast({
                  title: '注册成功',
                  icon: 'none',
                  duration:2000
                })
                wx.navigateBack({
                  delta: 1
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
      },
      chooseman() {
        this.studentsex = '男'
      },
      choosewoman() {
        this.studentsex = '女'
      },
      studentnumberchange(event) {
        var reg=/^[0-9]{10}$/;   /*定义验证表达式*/
        if( reg.test(event.mp.detail )) {
          this.studentnumbererror = ''
          this.studentnumber = event.mp.detail
        } else {
          this.studentnumbererror = '请输入正确的学号'
        }
        console.log(this.studentnumber )
      },
      studentnamechange(event) {
        var reg=/^[\u4E00-\u9FA5]{2,8}$/;   /*定义验证表达式*/
        if( reg.test(event.mp.detail )) {
          this.studentnameerror = ''
          this.studentname = event.mp.detail
        } else {
          this.studentnameerror = '请输入名字'
        }
      },
      studenttelephonechange(event) {
        var reg=/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;   /*定义验证表达式*/
        if( reg.test(event.mp.detail )) {
          this.studenttelephoneerror = ''
          this.studenttelephone = event.mp.detail
        } else {
          this.studenttelephoneerror = '请输入正确的电话号码'
        }
      },
      studentemailchange(event) {
        var reg=/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;   /*定义验证表达式*/
        if( reg.test(event.mp.detail )) {
          this.studentemailerror = ''
          this.studentemail = event.mp.detail
        } else {
          this.studentemailerror = '请输入正确的邮箱'
        }
      },
      studentpasswordchange(event) {
        var reg=/^[0-9A-Za-z]+$/;   /*定义验证表达式*/
        console.log(this.studentpassword)
        if( reg.test(event.mp.detail )) {
          this.studentpassworderror = ''
          this.studentpassword = event.mp.detail
        }else {
          this.studentpassworderror = '请正确设置密码(英文加数字)'
        }
        if( this.studentpassword != this.studentpasswordagain) {
          this.studentpasswordagainerror = '密码不一致 '
        } else if( this.studentpassword == this.studentpasswordagain && this.studentpassword != '' &&  this.studentpasswordagain != ''){
          this.studentpassworderror = ''
          this.studentpasswordagainerror = ''
        }

      },
      studentpasswordagainchange(event) {
        var _this = this;
        var reg=/^[0-9A-Za-z]+$/;   /*定义验证表达式*/
        if(  reg.test(event.mp.detail ) && event.mp.detail == _this.studentpassword) {
          this.studentpasswordagain = event.mp.detail
          _this.studentpasswordagainerror = ''
        } else {
          _this.studentpasswordagainerror = '密码不一致 '
        }
      },
    }

  }
</script>

<style scoped>
.register {
  width: 90%;
  margin-left: 5%;
  margin-top: 10%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
  .sexchoose {
    height: 80rpx;
    display: flex;
  }
  .mancss {
    width: 50%;
    font-size: 28rpx;
    text-align: center;
    line-height: 80rpx;
  }
  .womancss {
    width: 50%;
    font-size: 28rpx;
    text-align: center;
    line-height: 80rpx;
  }
  .choosebackground {
    background-color: #a7a388;
  }
  .subbut {
    width: 80%;
    margin-left: 10%;
    margin-top: 40rpx;
  }
</style>
