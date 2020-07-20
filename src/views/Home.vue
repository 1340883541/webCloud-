<template>
  <el-row class="container" v-cloak>
    <el-col :span="24" class="header">
      <el-col  v-if="onoff" :span="4" class="logo logo-width">
        <template>
          <img v-if="getusers.logo != ''" :src="imgUrl+getusers.logo" width="190" height="46" />
          <img v-else src="../assets/logo.jpg" />
        </template>
      </el-col>
     <el-col v-if="!onoff" :span="4" class="logo logo-collapse-width">
         <template>
          <img v-if="getusers.littleLogo" :src="imgUrl+getusers.littleLogo" width="56" height="46" />
          <img v-else src="../assets/collapsed_logo.png" />
        </template>
      </el-col>
      <el-col class="userinfo">
        <div class="head_menu_li fl" @click="handleclicktirggermenu">
           <img v-show="!onoff" src="../assets/menu_open.png" alt="">
           <img v-show="onoff" src="../assets/menu_close.png" alt="">
        </div>
        <div
          class="head_menu_li fl"
          :class="{'head_menu_active':headCurr==index}"
          v-for="(item,index) in menulistJson"
          :key="index"
          v-if="item.resType == 'MODULE' && item.accessPath != '/web/empCenter'"
        >
          <span class="title" @click="spikHeadmenu(item,index)">{{item.resName}}</span>
        </div>
        <!-- <el-col :span="2" class="head_menu_li">
          <span class="title" @click="styemClick">系统设置</span>
        </el-col>-->

        <!-- 个人中心 -->
        <div class="head_r clearfix">
          <div class="chname" @click="handleOpenPerson" v-if="getusers.chName">{{getusers.chName}}</div>
          <div class="chname" @click="handleOpenPerson" v-else>{{getusers.corpName}}(管理员)</div>
          <div class="logout_div" @click="logout">退出</div>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24" class="main">
      <!-- 导航菜单 -->
      <!-- <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
        <el-scrollbar style="height:100vh" v-if="collapsed == false">
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleopen"
            @select="handleselect"
            unique-opened
            router
          >
            <template v-for="(item,index) in meunList">
              <el-submenu :index="index+''" :key="index" v-if="item.children != ''">
                <template slot="title">
                  <div @click="routerUrl(item.url)">
                    <i class="fa" :class="item.icon"></i>
                    <span>{{item.name}}</span>
                  </div>
                </template>
                <el-menu-item
                  class="erji_menu"
                  @click="menuTitle(child.name)"
                  v-for="child in item.children"
                  :index="child.url"
                  :key="child.url"
                >{{child.name}}</el-menu-item>
              </el-submenu>
              只有一个节点
              <el-menu-item
                @click="menuTitle(item.name, item.children)"
                v-if="item.children == ''"
                :index="item.url"
                :key="index"
              >
                <i class="fa" :class="item.icon"></i>
                <span>{{item.name}}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-scrollbar>
      </aside>-->
      <!-- 导航菜单 -->
      <aside :class="!onoff?'menu-collapsed':'menu-expanded'">
        <el-scrollbar style="height:100vh" >
          <el-menu
           :collapse="isCollapse"
            class="el-menu-vertical-demo"
           :default-active="this.$route.path"
            @open="handleopen"
            @select="handleselect"
            unique-opened
            router
            ref = "menuCollapsed"
          >
                <template  v-for="(item,index) in meunList">
                  <el-submenu :index="index+''" :key="index" v-if="item.resType == 'MENU'" >
                    <template slot="title">
                      <div @click="routerUrl(item.routePath)" class="img_wid">
                        <img v-if="item.icon" :src="imgUrl+item.icon" />
                        <span>{{item.resName}} </span>
                      </div>
                    </template>
                  <template v-if="collapsedList[index].length>0">
                    <el-menu-item
                      class="erji_menu normal-title"
                      @click="menuTitle(child.routePath)"
                       v-for="child in collapsedList[index]"
                      :index="child.routePath"
                      :key="child.routePath"
                    >{{child.resName}} </el-menu-item>
                  </template>
                <el-menu-item 
                      class="erji_menu specil-title"
                       @click="menuTitle(item.routePath)"
                        :index="item.routePath"
                        v-if="collapsedList[index].length<=0 && !onoff"
                    >
                   <i class="triangle"></i>
                    {{item.resName}} </el-menu-item>
                    <!-- <el-menu-item
                      class="erji_menu"
                      v-if="item.routePath == 'all_file'">
                    >文档</el-menu-item>-->
                  </el-submenu>
                  <!-- 只有一个节点 -->
                  <!-- <el-menu-item
                    @click="menuTitle(item.resName, item.children)"
                    v-if="item.children == ''"
                    :index="item.routePath"
                    :key="index"
                  >
                    <img :src="imgUrl+item.icon">
                    <span>{{item.resName}}</span>
                  </el-menu-item>-->
               </template> 
   
          </el-menu>
        </el-scrollbar>
          
              <!-- <el-submenu :index="index+''" :key="index" v-if="item.resType == 'MENU'">
                <template slot="title">
                  <div @click="routerUrl(item.routePath)" class="img_wid" @mouseover="showchildMenu">
                    <img v-if="item.icon" :src="imgUrl+item.icon" /> -->
                    <!-- <span>{{item.resName}}</span> -->
                  <!-- </div>
                </template>
                <el-menu-item
                  class="erji_menu"
                  @click="menuTitle(child.resName)"
                  v-for="child in item.children"
                  :index="child.routePath"
                  :key="child.routePath"
                  v-if="child.resType && child.resType == 'MENU'" -->
                <!-- >{{child.resName}}</el-menu-item> -->
                <!-- <el-menu-item
                  class="erji_menu"
                  v-if="item.routePath == 'all_file'">
                >文档</el-menu-item>-->
              <!-- </el-submenu> -->
              <!-- 只有一个节点 -->
              <!-- <el-menu-item
                @click="menuTitle(item.resName, item.children)"
                v-if="item.children == ''"
                :index="item.routePath"
                :key="index"
              >
                <img :src="imgUrl+item.icon">
                <span>{{item.resName}}</span>
              </el-menu-item>-->

      </aside>

      <section class="content-container">
        <div class="grid-content bg-purple-light">
          <!-- <el-col :span="24" class="breadcrumb-container">
						<strong class="title">{{meuntit}}</strong>
          </el-col>-->
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view :key="$route.fullPath"></router-view>
            </transition>
            <!-- 下载文件进度列表 -->
            <file-down-upload></file-down-upload>
          </el-col>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import filedownupload from '../components/file_down_upload'
import { getData } from "../api/api";
import {downloadStore} from "../api/download_store.js";
import {getCookie} from "../api/util.js";
// import fileprogress from '../components/file_progress'
import { construct, destruct } from "@aximario/json-tree";
export default {
  components:{
        'file-down-upload':filedownupload
    },
  data() {
    return {
      getusers: "",
      //顶部菜单
      headCurr: 0,
      //左侧菜单
      imgUrl: '',
      collapsed: false,
      allmenu: [],
      menulistJson: [],
      meunList: [],
      onoff:true,
      isCollapse:false,
      collapsedList:[],//单独处理的缩小menu list
      isView:false,
        };
  },
  mounted() {

    //   this.isCollapse = sessionStorage.getItem("isCollapse")
    this.getusers = localStorage.getItem("user");
    let token = getCookie("token");
    if (token) {
      //字符串转对象
      this.getusers = eval("(" + this.getusers + ")");
        this.getrbacData();
      // 
    } else {
      // this.$router.push("/login");
    }
  },
  watch: {
    //监听页面路由变化
    $route: {
      handler: function(val, oldVal){ 
        if(val.path == '/all_file'){
          $('.el-menu.el-menu-vertical-demo>li').removeClass('is-active is-opened')
          $('.el-menu.el-menu-vertical-demo>li:first-child').addClass('is-active is-opened')
          $(".el-submenu .el-menu-item").removeClass("is-active");
        }else{
          if($('.el-menu.el-menu-vertical-demo>li:first-child').hasClass('is-active is-opened')){
            $('.el-menu.el-menu-vertical-demo>li:first-child').removeClass('is-active is-opened')
          }
          // $('.el-menu.el-menu-vertical-demo>li').removeClass('is-active is-opened')
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    //菜单资源权限
    //菜单\功能\子功能操作权限
    getrbacData() {
      let that = this;
      getData("open/api/res/findResByEmpAcc", {
        'empAccId': this.getusers.empAccId
      }).then(res => {
        if (res.code == 200) {
          that.allmenu = res.data || [];
          that.menulistJson = construct(that.allmenu, {
            id: "resTarId",
            pid: "resParentId",
            children: "children"
          });
          if (that.menulistJson.length > 0) {
            that.menulistJson.map((v, i) => {
              if (
                v.children &&
                Object.prototype.toString.call(v.children).toLowerCase() ===
                  "[object array]" &&
                v.children.length > 0
              ) {
                v.children.map((val, index) => {
                  let menu_file= {
                   menu_file_doc: {
                      resName: "文档",
                      resType: "MENU",
                      accessPath: "/web/file",
                      routePath: "/file_doc",
                      icon: null
                    },
                  menu_file_img:{
                      resName: "图片",
                      resType: "MENU",
                      accessPath: "/web/file",
                      routePath: "/file_img",
                      icon: null
                    },
                  menu_file_video :{
                      resName: "视频",
                      resType: "MENU",
                      accessPath: "/web/file",
                      routePath: "/file_video",
                      icon: null
                    }
                  }
                  
                  if (val.routePath == "/all_file") {
                    if (!val.children) {
                      that.$set(val, "children", []);
                    }
                    val.children.push(menu_file.menu_file_doc);
                    val.children.push(menu_file.menu_file_img);
                    val.children.push(menu_file.menu_file_video);
                  }
                  return val;
                });
              }
              return v;
            });
          }
          if (that.menulistJson.length > 0) {
            if(that.menulistJson[0].children && that.menulistJson[0].children.length > 0 ){
              that.meunList = that.menulistJson[0].children;
            }
          } else {
            that.meunList = [];
          }
          // console.log(JSON.stringify(that.meunList, null, "\t"))
          // console.log(JSON.stringify(that.menulistJson, null, "\t"))
          that.$nextTick(() => {
             that.imgUrl = axios.defaults.baseURL;
          })
      var newArr =   that.meunList.map((item)=>{
        if(item.children){
            return   item.children.filter((child)=>{
                    return child.resType=="MENU";
             }) 
        }else{
              return []
        }
       
      })       
      that.collapsedList = newArr;
      that.ismeunList = true;
        } else {
          if (res.code == 1001 || res.code == 1002) {
            sessionStorage.removeItem("user");
            that.$router.push("/login");
          }
        }
      });
    },
    //顶部菜单
    spikHeadmenu: function(item, index) {
      this.headCurr = index;
      this.$router.push(item.routePath);
      this.meunList =
        item.children &&
        Object.prototype.toString.call(item.children).toLowerCase() ===
          "[object array]" &&
        item.children.length > 0
          ? item.children
          : [];
     var newArr =   this.meunList.map((item)=>{
        if(item.children){
            return   item.children.filter((child)=>{
                    return child.resType=="MENU";
             }) 
        }else{
              return []
        }
       
      })       
      this.collapsedList = newArr;
          console.log( this.collapsedList )
      // console.log(JSON.stringify(this.meunList, null, "\t"));
    },
    //左侧菜单
    menuTitle: function(url) {
      // console.log(JSON.stringify( downloadStore.getMessage(),null,'\t'))
      sessionStorage.removeItem("newbrod")
      let store_msg = {
        'is_d_progress':false,
        'is_p_suox':true
      }
      downloadStore.setMessageItem(store_msg)
      this.$router.push({ path: url,query:{r:Math.random()}}); 
    },
     //收缩菜单左侧菜单
     expandedmenuTitle(url){
            sessionStorage.removeItem("newbrod")
      let store_msg = {
        'is_d_progress':false,
        'is_p_suox':true
      }
      downloadStore.setMessageItem(store_msg)
      this.$router.push({ path: url,query:{r:Math.random()}});
     },
    handleopen(key, keyPath) {
      $(".el-submenu .el-menu-item").removeClass("is-active");   
    },
    handleselect: function(a) {
      // this.getrbacData(a)
      let page = this.$route.path;
    
      //  this.$router.push({ path: url,query:{r:Math.random()}});
      

    },
    routerUrl: function(url,index) {
      // console.log(JSON.stringify( downloadStore.getMessage(),null,'\t'))
      let page = this.$route.path;
      sessionStorage.removeItem("newbrod")
      let store_msg = {
        'is_d_progress':false,
        'is_p_suox':true
      }
   
       this.$router.push({ path: url,query:{r:Math.random()}});
      
      downloadStore.setMessageItem(store_msg)
   
    },
    //个人中心
    handleOpenPerson(){
      this.$router.push("/person");
    },
    //退出登录
    logout: function() {
      var that = this;
      getData("open/api/emp/logout", "").then(res => {
        if (res.code == 200) {
          sessionStorage.removeItem("user")
          that.$router.push("/login")
          downloadStore.clearMessageAction()
        }
      })
    },
    // 系统设置
    styemClick: function() {
      this.$router.push("/styemSet");
    },
    //左侧菜单收起
    handleclicktirggermenu(){
        this.isCollapse =!this.isCollapse;
        this.onoff = !this.onoff;
    }
  }
};
</script>
