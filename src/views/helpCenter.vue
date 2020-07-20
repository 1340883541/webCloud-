<template>
  <el-row class="container" v-cloak>
    <el-col :span="24" class="header">
      <el-col :span="4" class="logo logo-width">
        <img  src="../assets/logo.jpg" />
      </el-col>
      <el-col class="userinfo">
        <div
          class="head_menu_li fl"
          v-for="(item,index) in menulistJson"
          :key="index"
        >
          <span class="title" @click="spikHeadmenu(item)">{{item.resName}}</span>
        </div>
         <div class="head_r clearfix">
          <div class="logout_div" @click="logout">返回登录</div>
        </div>
      </el-col>
      
    </el-col>
    <el-col :span="24" class="main">
      <!-- 导航菜单 -->
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-scrollbar style="height:100vh">
          <el-menu
            class="el-menu-vertical-demo"
            default-active="2"
            unique-opened
            router
          >
            <template v-for="(item,index) in meunList">
              <el-submenu :index="index+''" :key="index">
                <template slot="title">
                  <div @click="routerUrl(item,index)">
                    <span class="word_all">{{item.faqType}}</span>
                  </div>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </el-scrollbar>
      </aside>
      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
              <div class="center_info_i flex-wrap">
              <div class="rl_info">
                <div class="title">{{faqType}}</div>
                <template v-for="(all,i) in list">
                  <div :key="i">
                    <!-- <div class="title">{{all.faqType}}</div> -->
                    <div class="box_isShow" :class="{'isActive':all.isChecked}">
                      <div class="subject_title" @click="openClick(all,i,all.helpFaqId)">
                        <img src="../assets/icon_arrow.png" v-show="all.isChecked"> 
                        <img src="../assets/icon_narrow.png" v-show="!all.isChecked"> 
                        <span :class="{'isActiveText':all.isChecked}">{{i+1}}.</span><span :class="{'isActiveText':all.isChecked}" v-html="all.subject"></span>
                      </div>
                      <div class="content_title" v-loading="all.listLoading" v-show="all.isChecked" v-html="all.content"></div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import { getData } from "../api/api";
import {Dialog} from "../api/util.js";
export default {
  data() {
    return {
      getusers: "",
      //顶部菜单
      headCurr: 0,
      //左侧菜单
      imgUrl: '',
      collapsed: false,
      allmenu: [],
      menulistJson: [
        {resName:'云盘'},
        {resName:'系统设置'},
        {resName:'帮助'},
      ],
      meunList: [],
      list:[],    
      page: 1, //列表分页
      page_size: 100, //一页10调
      pager_count: 9, //
      total: 1,
      faqType:'',
      content:'',
    };
  },
  mounted() {
    this.init();
  },
  methods: {
   init:function(){
      axios.get("open/api/help/allHelpFaqType").then(res => {
      let _this = this;
      if(res.data.code==200){
      _this.meunList = res.data.data.map(v=>{
          v.isChecked = false
        return v;
      })
        _this.$nextTick(function() {
          _this.collapseInit();
        });
      }
    });
   },
   collapseInit:function(){
     let _this = this;
     if( _this.meunList && _this.meunList.length>0){
      _this.meunList.map((v,i)=>{
        if(i===0){
          this.faqType = v.faqType
          let para = {
          'page': _this.page,
          'helpFaqTypeId': v.helpFaqTypeId,
          'openly':1,
          'size': _this.page_size
        };
        getData("open/api/help/getHelpFaqByType", para).then(res => {
          if (res.code == 200) {
            _this.list = res.data.map(v=>{
              v.isChecked = false
              return v;
          });
            _this.page_size = res.currentSize;
            _this.total = res.totalCount;
          }
        }),
          err => {
            console.log(err);
          }; 
        }
      })
     }
   },
  openClick:function(all,i,id){
     let _this = this;
       all.listLoading = true;
       _this.list[i].isChecked = !_this.list[i].isChecked;
       if(!all.content){
        if( _this.list[i].isChecked){
              var params = {
                helpFaqId: id,
              };
            getData("open/api/help/getHelpFaqContent", params).then(res => {
              if (res.code == 200) {
                  all.content = res.data.content;
                  all.listLoading = false;
                  _this.$forceUpdate();
              } else {
                Dialog.message(res.message,'error',1500)
              }
            })
          }else{
              all.content = ''
          }
       }
   },
   routerUrl:function(item,index){
      // console.log(item)
      this.faqType = item.faqType
      let _this = this;
      _this.meunList.map((v, i) => {
        v.isChecked = false;
      });
        _this.meunList[index].isChecked = !_this.meunList[index].isChecked;
        let para = {
        'page': _this.page,
        'helpFaqTypeId': item.helpFaqTypeId,
        'openly':1,
        'size': _this.page_size
      };
      this.listLoading = true;
      getData("open/api/help/getHelpFaqByType", para).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          _this.list = res.data.map(v=>{
          v.isChecked = false
          return v;
       });
          _this.page_size = res.currentSize;
          _this.total = res.totalCount;
        }
      }),
        err => {
          console.log(err);
        };
   },
   menuTitle:function(){},
   spikHeadmenu:function(){
        this.$router.go(-1)
   },
   logout:function(){
    this.$router.go(-1)
   },
 }
}
</script>
<style lang="scss">
.center_info_i{
  width:100%;
  // height:calc(100vh - 46px);
  background: #EEF1F6;
}
.lf_info{
  width: 120px;
  margin:14px 0 17px 12px;
  background: #fff;
  text-align: center;
  border-right:1px solid #DCDFE6;
}
.rl_info{
  width: calc(100% - 28px) !important;
  margin:14px 0 17px 14px;
  background: #fff;
}
.rl_info .title{
    line-height: 32px;
    border-bottom: 1px solid #DCDFE6;
    padding-left: 12px;
}
.box_isShow{
    margin-left: 12px;
    margin-top: 9px;
    padding: 8px 0;
    border: 1px solid #DCDFE6;
    // border-radius: 4px;
    margin-right: 11px;
    padding-left: 10px;
    background: #f5f7fa;
    margin-bottom: 6px;
}
.content-container{
  background: #EEF1F6!important;
}
.lf_info div{
  line-height: 32px;
  color: #333;
  cursor: pointer;
}
.lf_info .activeInfo{
 color:rgba(24,178,112,1);
 border-right:1px solid rgba(24,178,112,1)

}
.word_all{
     width: 148px;
    display: inline-block;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden; 
}
.isActive{
  background: #fff;
}
.isActiveText{
  font-size:14px;
  font-weight:bold;
  line-height:19px;
  color:rgba(34,34,34,1);
}
.subject_title{
    // margin-left: 12px;
    // margin-top: 9px;
    cursor: pointer;
}
.content_title{
    // margin-left: 16px;
    margin-top: 12px;
    margin-right: 11px;
    padding-left:10px;
}
.content_title img{
     max-width: 100%;
}
</style>
