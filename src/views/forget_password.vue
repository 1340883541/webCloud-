<template>
  <div class="login-container flex-wrap">
    <div class="login-bj flex-con">
      <img src="../assets/login_bj.jpg" />
      <div class="login-tit-box">
        <p class="p0">欢迎使用ForestFile</p>
        <p class="p1">企业智能文件管理，多人实时共同协作</p>
        <p class="p1">数据高效存储，访问更安全</p>
      </div>
    </div>
    <div class="login-content">
      <div class="login-c-head flex-wrap">
        <div class="login-h-l">
          <img src="../assets/login_h_icon.png" />
        </div>
        <div class="login-h-r flex-con flex-wrap flex-align-item flex-end">
          <div class="p0">
            <span>中</span>
            <span class="icon-fenge">/</span>
            <span class="color-blue">En</span>
          </div>
          <div class="p1">
            <img src="../assets/icon_help.png" alt />
            <span style="vertical-align: top;line-height: 15px;">帮助中心</span>
          </div>
        </div>
      </div>
      <div class="login-c-c">
        <div class="buzhou_box clearfix">
          <div class="buzhou_one fl clearfix">
            <span class="buzhou-radio buzhou-radio-active">1</span>
          </div>
          <!-- border_color -->
          <div class="buzhou_two fl clearfix">
            <span class="buzhou-fenge" :class="{'border_color':isTwoCla==true}"></span>
            <span class="buzhou-radio" :class="{'buzhou-radio-active':isTwoCla==true}">2</span>
          </div>
          <div class="buzhou_three fl clearfix">
            <span class="buzhou-fenge" :class="{'border_color':isThreeCla==true}"></span>
            <span class="buzhou-radio" :class="{'buzhou-radio-active':isThreeCla==true}">3</span>
          </div>
        </div>
        <div class="login-c-tit">忘记密码</div>
        <!-- 步骤一：获取验证码 -->
        <div class="login-form" v-if="isOne">
          <div class="login-from-item">
            <label class="login-lable">账号</label>
            <input class="login-input" type="text" v-model.trim="username" placeholder="请输入账号" />
          </div>
          <div class="login-from-item">
            <label class="login-lable">邮箱</label>
            <input class="login-input" type="passsword" v-model.trim="email" placeholder="请输入邮箱" />
          </div>
          <div class="login-btn-box flex-wrap">
            <el-button
              class="login-btn flex-con"
              :class="{'login-btn-active':logining==true}"
              :loading="logining"
              @click="handlegetCode"
            >获取验证码</el-button>
          </div>
        </div>
        <!-- 步骤二：设置新密码 -->
        <div class="login-form" v-if="isTwo">
          <div class="login-from-item">
            <label class="login-lable">邮箱验证码</label>
            <input class="login-input" type="text" v-model.trim="emailCode" max-length="6" placeholder="请输入邮箱验证码">
          </div>
          <div class="login-from-item">
            <label class="login-lable">新密码</label>
            <input class="login-input" type="password" v-model.trim="passsword" placeholder="请输入密码">
          </div>
          <div class="login-from-item">
            <label class="login-lable">确认新密码</label>
            <input class="login-input" type="password" v-model.trim="newPassword" placeholder="请再次输入新密码">
          </div>
          <div class="login-btn-box flex-wrap">
            <el-button class="login-btn flex-con" :loading="logining" @click="handleSetpass">确认</el-button>
            <el-button class="login-back-btn flex-con" @click="handleBackOne">返回上一步</el-button>
          </div>
        </div>
        <!-- 步骤三：完成，去登录 -->
        <div class="login-form" v-if="isThree">
          <div class="login-finsh flex-wrap flex-align-item">
            <div class="lofin-f-info">
              <img src="../assets/icon_success.png" />
              <p>
                密码已修改成功
                <a @click="$router.push({path:'/login'})">去登录</a>
              </p>
            </div>
          </div>
        </div>
        <div v-if="!isThree" class="login-forget" @click="$router.push({path:'/login'})">去登录</div>
      </div>
      <div class="login-c-foot">蜀ICP备16023577号-1 成都金鼎时代网络科技有限公司提供技术支撑</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getData } from "../api/api";
import { base64encode, utf16to8, utf8to16, base64decode } from "../api/base64";
import {Dialog} from "../api/util.js";

export default {
  data() {
    return {
      logining: false,
      username: "",
      email: "",
      emailCode:'',
      passsword:'',
      newPassword:'',
      isOne:true,
      isTwo:false,
      isTwoCla:false,
      isThree:false,
      isThreeCla:false,
    };
  },
  mounted() {},
  methods: {
    //获取验证码
    handlegetCode() {
      // 由字母、数字、下划线、短线 - 、点号 . 组成 @ 域名，域名由字母、数字、短线 - 域名后缀组成
      let that = this, mailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if(this.username == ""){
        Dialog.message("请输入账号!",'error',1500)
        return false
      }
      if(this.username.length > 30){
        Dialog.message("账号长度为30位以内!",'error',1500)
        return false
      }
      if(this.email == ""){
        Dialog.message("请输入邮箱!",'error',1500)
        return false
      }
      if(this.email.length > 0){
        if(!mailReg.test(this.email)){
          Dialog.message("请输入合法的邮箱地址!",'error',1500)
          return false
        }
      }
      this.logining = true;
      getData("open/api/emp/forgetPassGetCode", {
        'username':this.username,
        'email': this.email
      }).then(res => {
        that.logining = false;
        if (res.code == 200) {
          Dialog.message('验证码已发送，请注意查收!','success')
          that.isOne=false
          that.isTwoCla=true
          that.isTwo=true
        } else {
          if(res.code == 1003){
            Dialog.message("请输入合法的邮箱地址!",'error',1500)
          }else{
            Dialog.message(res.message,'error')
          }
        }
      })


      // if (this.username != "" && this.email != "") {
      //   if(this.username.length>30){
      //     Dialog.message("账号长度为30位以内!",'error',1500)
      //   }else{
      //     this.logining = true;
      //     getData("open/api/emp/forgetPassGetCode", {
      //       'username':this.username,
      //       'email': this.email
      //     }).then(res => {
      //       that.logining = false;
      //       if (res.code == 200) {
      //         Dialog.message('验证码已发送，请注意查收!','success')
      //         that.isOne=false
      //         that.isTwoCla=true
      //         that.isTwo=true
      //       } else {
      //         Dialog.message(res.message,'error')
      //       }
      //     })
      //   }
      // } else {
      //   if (this.username == "") {
      //     Dialog.message("请输入账号!",'error',1500)
      //   } else {
      //     Dialog.message("请输入邮箱!",'error',1500)
      //   }
      // }
    },
    //返回上一步
    handleBackOne(){
      this.isOne = true
      this.isTwoCla=false
      this.isTwo = false
    },
    //设置新密码
    handleSetpass(){
      let that = this;
      if(this.emailCode == ''){
        Dialog.message('请输入邮箱验证码!','error', 1500)
        return false
      }
      if(this.emailCode.length > 6){
        Dialog.message('请输入验证码为1到6位!','error', 1500)
        return false
      }
      if(this.passsword == ''){
        Dialog.message('请输入新密码!','error', 1500)
        return false
      }
      if(this.passsword.length<6 || this.passsword.length>12){
        Dialog.message('密码为6到12位!','error', 1500)
        return false
      }
      if(this.newPassword == ''){
        Dialog.message('请输入确认新密码!','error', 1500)
        return false
      }
      if(this.newPassword.length<6 || this.newPassword.length>12){
        Dialog.message('密码为6到12位!','error', 1500)
        return false
      }
      if(this.passsword != this.newPassword){
        Dialog.message('两次输入密码不一致!','error', 1500)
        return false
      }
      this.logining = true;
      getData("open/api/emp/forgetPassNewPass", {
        'username':this.username,
        'email': this.email,
        'empCode':this.emailCode,
        'newPassword':base64encode(utf16to8(this.newPassword))
      }).then(res => {
        that.logining = false;
        if (res.code == 200) {
          Dialog.message('重置密码成功!','success', 1500)
          that.isOne=false
          that.isTwo=false
          that.isTwoCla=true
          that.isThreeCla=true
          that.isThree=true
        } else {
          if(res.code == 1003){
            Dialog.message("请检查输入的格式是否正确!",'error',1500)
          }else{
            Dialog.message(res.message,'error')
          }
        }
      })
    },
  }
};
</script>

<style lang="css" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: #fff;
}
.login-bj {
  /* background: url('../assets/login_bj.jpg') no-repeat center center; */
  /* background-size: cover; */
}
.login-bj img {
  width: 100%;
  display: block;
  height: 100vh;
  object-fit: cover;
}
/* 登录页标题 */
.login-bj .login-tit-box {
  width: auto;
  height: auto;
  position: absolute;
  z-index: 1;
  top: 28vh;
  left: 12%;
}
.login-bj .login-tit-box .p0 {
  color: #a2d8f7;
  font-size: 22px;
  line-height: 22px;
  margin-bottom: 14px;
}
.login-bj .login-tit-box .p1 {
  color: #a2d8f7;
  font-size: 14px;
  line-height: 20px;
  
}
.login-content {
  width: 38%;
  height: 100vh;
  overflow: hidden;
}
.login-c-head {
  width: 100%;
  height: 46px;
  box-shadow: 0 0 34px rgba(0, 0, 0, 0.2);
}
.login-h-r {
  font-size: 14px;
}
.login-h-r .p0 {
  color: #333;
}
.login-h-r .p1 {
  margin-left: 30px;
  color: #626e95;
  padding-right: 32px;
}
.icon-fenge {
  color: #aaaaaa;
  font-size: 12px;
  padding: 0px 4px;
}
.color-blue {
  color: #4489ed !important;
  font-size: 13px;
}
.login-h-r .p1 img {
  width: 14px;
  height: 14px;
  padding-top: 1px;
}
.login-c-c {
  height: 280px;
  width: 305px;
  padding-left: 17px;
  margin-top: -moz-calc((100vh - 330px) / 2);
  margin-top: -webkit-calc((100vh - 330px) / 2);
  margin-top: calc((100vh - 350px) / 2);
}
.login-form {
  width: 305px;
  margin-top: 16px;
}
.login-from-item {
  margin-bottom: 8px;
}
.login-form .login-lable {
  color: #333333;
  font-size: 14px;
  line-height: 14px;
  margin-bottom: 4px;
  display: block;
}
.login-form .login-input {
  height: 40px;
  width: 295px;
  border: 1px solid #cbd4ef;
  color: #333;
  padding-left: 8px;
  font-size: 14px;
}
.login-form .login-input:focus {
  border: 1px solid #18b270;
}
.login-btn {
  height: 40px;
  background: #21ce81;
  color: #fff;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
  cursor: pointer;
  border-radius: 0
}
.login-btn:active,
.login-btn-active {
  background: #1bb671;
}
.login-back-btn {
  height: 40px;
  background: #fff;
  color: #333;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
  border: 1px solid #9198ad;
  margin-left: 5px;
  cursor: pointer;
  border-radius: 0
}
/*  */
.login-c-tit {
  color: #7580a3;
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  text-align: center;
}
.login-forget {
  color: #626e95;
  font-size: 14px;
  line-height: 14px;
  text-align: left;
  display: inline-block;
  margin-top: 15px;
  cursor: pointer;
}
.login-c-foot {
  width: 100%;
  height: 13px;
  font-size: 12px;
  line-height: 13px;
  color: #7580a3;
  position: fixed;
  bottom: 12px;
  padding-left: 17px;
}

/* // 设置密码步骤 */
.buzhou_box {
  display: block;
  position: relative;
  margin-bottom: 16px;
}
.buzhou-radio {
  width: 32px;
  height: 32px;
  display: inline-block;
  background: #fff;
  border: 1px dashed #9198ad;
  color: #7580a3;
  border-radius: 50%;
  font-size: 16px;
  text-align: center;
  line-height: 32px;
  float: left;
}
.buzhou-radio-active {
  color: #1bb992;
  border: 1px solid #1bb992;
}
.buzhou-fenge {
  /* color: #9198AD; */
  width: 100px;
  height: 1px;
  /* background: #9198AD; */
  float: left;
  margin-top: 17px;
  border-top: 1px dashed #9198ad;
}
.border_color {
  border-top: 2px solid #1eba93;
}
.buzhou_two {
  float: left;
}
/* 完成设置去登录 */
.login-finsh {
  width: 305px;
  height: 163px;
  background: #f5f7fa;
}
.lofin-f-info {
  width: 100%;
  height: 44px;
  line-height: 44px;
  padding-left: 40px;
  padding-right: 38px;
  color: #022222;
  font-size: 16px;
  padding: 0 36px;
  cursor: pointer
}
.lofin-f-info img {
  width: 44px;
  height: 44px;
  display: block;
  float: left;
  margin-right: 10px;
}
.lofin-f-info p {
}
.lofin-f-info a {
  color: #3397ee;
  padding-left: 12px;
}
</style>