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
            <span class="color-blue">中</span>
            <span class="icon-fenge">/</span>
            <span class="">En</span>
          </div>
          <div class="p1" @click="hlepCenter">
            <img src="../assets/icon_help.png" />
            <span style="vertical-align: top;line-height: 15px;">帮助中心</span>
          </div>
        </div>
      </div>
      <div class="login-c-c">
        <div class="login-c-tit">ForestFile登录</div>
        <div class="login-form">
          <div class="login-from-item">
            <label class="login-lable">用户名</label>
            <input class="login-input" type="text" placeholder="请输入用户名" v-model.trim="username" @keyup.enter="focusNextInput(1)"/>
          </div>
          <div class="login-from-item">
            <label class="login-lable">密码</label>
            <input class="login-input" type="password" placeholder="请输入密码" v-model.trim="password" @keyup.enter="focusNextInput(2)"/>
          </div>
          <div class="login-from-item">
            <!-- <Vcode class="login-input" :imgs="codeimgs" :show="isShow" @onSuccess="onSuccess" @onClose="onClose"/> -->
            <div class="vue-auth-box" v-show="isShow" @click="flag && onClose()">
              <div class="vcode-box" @click.stop="stopPropagation">
                <slide-verify :l="42" :r="10"
                  :w="305"
                  :h="155"
                  ref="slideblock"
                  @again="onAgain"
                  @fulfilled="onFulfilled"
                  @success="onSuccess"
                  @fail="onFail"
                  @refresh="onRefresh"
                  :accuracy="accuracy"
                  :slider-text="text"
                  :imgs="codeimgs"
                  ></slide-verify>
              </div>
            </div>
          </div>
          <el-button
            class="login-btn"
            :class="{'login-btn-active':logining==true}"
            type="primary"
            style="width:100%;"
            @click="spikLoginComfrim"
            :loading="logining"
          >立即登录</el-button>
        </div>
        <div class="login-forget" @click="$router.push({path:'/forget_password'})">忘记密码</div>
      </div>
      <div class="login-c-foot">蜀ICP备16023577号-1 成都金鼎时代网络科技有限公司提供技术支撑</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getData } from "../api/api.js";
import {downloadStore} from "../api/download_store.js";
// import Vcode from "vue-puzzle-vcode";
import { base64encode, utf16to8, utf8to16, base64decode } from "../api/base64";
import {Dialog,setCookie} from "../api/util.js";
import SparkMD5 from 'spark-md5'
import Img1 from '@/assets/code/code1.jpg';
import Img2 from '@/assets/code/code2.jpg';
import Img3 from '@/assets/code/code3.jpg';
import Img4 from '@/assets/code/code4.jpg';
import Img5 from '@/assets/code/code5.jpg';

export default {
  // components: {
  //   Vcode
  // },
  data() {
    return {
      isShow: false, // 验证码模态框是否出现
      codeimgs:[Img1, Img2, Img3, Img4, Img5],
      username: "",
      password: "",
      codenum:null,
      logining: false,
      //滑动验证码
      text: '向右滑',
      // 精确度小，可允许的误差范围小；为1时，则表示滑块要与凹槽完全重叠，才能验证成功。默认值为5
      accuracy: 5,
      flag:true,
    };
  },
  mounted() {
    this.loginPre()
    downloadStore.clearMessageAction()
  },
  methods: {
    loginPre() {
      let that = this;
      axios.get(axios.defaults.baseURL+'open/api/emp/loginPre').then(function (res) {
        if(res.data.code == 200){
          that.codenum = res.data.data
        }
      })
    },
    //点击滑动验证码模态框不冒泡
    stopPropagation(){
      this.isShow = true;
    },
    // 用户通过了验证
    onSuccess(){
      this.isShow = false; // 通过验证后，需要手动隐藏模态框
      this.ajaxLogin();
    },
    //验证不通过
    onFail(){
    },
    //点击了刷新小图标
    onRefresh(){
    },
    //点击了刷新小图标,刷新成功啦！
    onFulfilled() {
      this.loginPre()
    },
    //检测到非人为操作的哦！
    onAgain() {
        // 刷新/重置
        // this.$refs.slideblock.reset();
    },
    // 用户点击遮罩层，应该关闭模态框
    onClose() {
      this.$message.error({
            message: '请拖动滑块完成验证!',
            type: 'warning',
            duration:1500
          });
      this.isShow = false;
    },
    //input回车键操作
    focusNextInput(thisInput){
      var inputs = $('.login-form .login-input')
      if(inputs.length == thisInput){
          this.spikLoginComfrim();
      }else{
        inputs[thisInput].focus();
      }
    },
    spikLoginComfrim() {
      setTimeout(()=>{
             if (this.username && this.password) {
        this.$refs.slideblock.reset();
        this.isShow = true;
      } else {
        if (this.username == "") {
          Dialog.message("用户名不能为空!",'error',1500)
          return false;
        }
        if(this.username.length > 30){
           Dialog.message("账号长度为30位以内!",'error',1500)
           return false;
        }
        if (this.password == "") {
          Dialog.message("密码不能为空!",'error',1500)
          return false;
        }
      }
      },150)
      
    },
    ajaxLogin() {
      var that = this;
      this.logining = true;
      let p_bs64 = base64encode(utf16to8(this.password));
      let loginParams = {
        'username': this.username,
        'password': p_bs64,
        'code':this.codenum
      };
      getData("open/api/emp/login", loginParams).then(res => {
        that.logining = false;
        if (res.code == 200) {
          that.$router.push({ path: "/all_file" });
          let data_bs64 = res.data;
          that.flag = false;
          let spark = new SparkMD5();
          let token = data_bs64.corpName+data_bs64.corpAccId
          spark.appendBinary(token);
          let tokenMd5=spark.end();
          localStorage.setItem("user", JSON.stringify(data_bs64));
          setCookie('token', tokenMd5, 0.5)
        } else {
          setCookie('token', '', -1)
          if(res.code == 1004){
            Dialog.message('您的账户已被禁用，请联系公司管理员!','error',1500)
          }else{
            Dialog.message(res.message,'error',1500)
          }
          that.loginPre()
          that.isShow = false;
        }
      });
    },
    hlepCenter: function() {
      this.$router.push({ path: "/helpCenter" });
    }
  }
};
</script>

<style lang="scss" scoped>
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
.login-bj .login-tit-box{
  width: auto;
  height: auto;
  position:absolute;
  z-index: 1;
  top: 28vh;
  left: 12%;
}
.login-bj .login-tit-box .p0{
  color: #A2D8F7;
  font-size: 22px;
  line-height: 22px;
  margin-bottom: 14px;
}
.login-bj .login-tit-box .p1{
  color: #A2D8F7;
  font-size: 14px;
  line-height: 20px;
  
}
/* 登录页内容 */
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
  cursor: pointer;
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
  height: 260px;
  width: 340px;
  padding-left: 17px;
  margin-top: -moz-calc((100vh - 330px) / 2);
  margin-top: -webkit-calc((100vh - 330px) / 2);
  margin-top: calc((100vh - 330px) / 2);
  position: relative;
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
.login-form .login-input:focus{
  border: 1px solid #18B270;
}
.login-btn {
  width: 305px;
  height: 40px;
  background: #21ce81;
  line-height: 40px;
  color: #fff;
  font-size: 14px;
  margin-top: 15px;
  text-align: center;
  padding: 0;
}
.login-btn:active,
.login-btn-active{
  background: #1bb671
}
.login-c-tit {
  width: 305px;
  color: #7580a3;
  font-size: 22px;
  font-weight: bold;
  line-height: 22px;
  text-align: center;
  margin-bottom: 16px;
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
</style>