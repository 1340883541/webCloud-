<template>
    <div class="container person_container">
        <div class="person_head breadcrumb">
            <div class="header_info">
                <span class="curr_title">当前位置：</span>
                <span class="title">首页</span>
                <i>|</i>
                <span class="title_i">个人中心</span>
            </div>
        </div>
        <div class="person_body">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号: ">
             <span>{{username}}</span>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input type="text" style="ime-mode:disabled;" v-model.trim="ruleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model.trim="ruleForm.pass"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model.trim="ruleForm.checkPass"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="$router.go(-1)" size="small">返回</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')" size="small">确认修改</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import { getData } from "../api/api.js";
import {Dialog,getCookie} from "../api/util.js";
import { construct, destruct } from "@aximario/json-tree";
import { base64encode, utf16to8, utf8to16, base64decode } from "../api/base64";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback();
      }else if(value.length<6 || value.length>12){
        callback(new Error("密码为6到12位"))
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (this.ruleForm.pass != "" && value === "") {
       callback(new Error("请输入确认密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      username:'',
      ruleForm: {
        email:'',
        pass: "",
        checkPass: "",
      },
      rules: {
        email: [{ message: '请输入邮箱', trigger: "blur" }],
        pass: [{validator: validatePass, trigger: "blur" }],
        checkPass: [{validator: validatePass2, trigger: "blur" }],
      },
      corpAccId:null,
      empAccId:null,
      //菜单资源权限
      isRbac_list: false, //列表
      isRbac_edit: false, //修改
    };
  },
  mounted() {
    let userData = localStorage.getItem("user");
    let token = getCookie("token");
    if (token) {
      let userDataJson = eval("(" + userData + ")");
      // console.log(userDataJson.corpAccId)
      // console.log(userDataJson.empAccId)
      this.username = userDataJson.username;
      this.ruleForm.email = userDataJson.email;
      this.corpAccId = userDataJson.corpAccId;
      this.empAccId = userDataJson.empAccId;
    } else {
      this.$router.push("/login");
    }
  },
  methods: {
    //修改提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          getData("web/empCenter/edit", {
            'empAccId':this.empAccId,
            'username':this.username,
            // 'password':base64encode(utf16to8(this.ruleForm.pass)),
            'newPassword':base64encode(utf16to8(this.ruleForm.checkPass)),
            'email':this.ruleForm.email
          }).then(res => {
            this.logining = false;
            if (res.code == 200) {
              let data_bs64 = res.data;
              sessionStorage.setItem("user", JSON.stringify(data_bs64));
              Dialog.message('修改成功!','success',1500)
            } else {
                if (res.code == 1001) {
                    
                    this.$router.push({ path: "/403" });
                }else{
                  Dialog.message(res.message,'error',1500)
                }
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.person_container {
  position: relative;
}
.person_body{
  width: 32vw;
  margin-top: 20px;
}
</style>