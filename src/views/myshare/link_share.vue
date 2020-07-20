<template>
<!-- 分享 -->
  <section >
    <el-col :span="24" class="header">
      <el-col :span="4" class="logo logo-width">
        <img  src="../../assets/logo.jpg" />
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
          <!-- <div class="chname" @click="handleOpenPerson">{{getusers.chName}}</div> -->
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
                  <div @click="spikHeadmenu(item,index)">
                    <span>{{item.resName}}</span>
                  </div>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </el-scrollbar>
      </aside>
      <section class="content-container" v-loading="loading" :element-loading-text="loadlistTxt">
        <div class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
               <el-row v-if="this.code == 200">
                  <div class="pages">
                    <el-col :span="24">
                      <span class="times">{{times}}</span>
                      <span class="sxTimes">
                        失效时间：
                        <i>{{num}}</i>
                      </span>
                      <el-button class="color-green" v-if="isShow" size="small" @click.stop="handledownloadWj">
                        <img src="../../assets/icon_xz.png" />下载
                      </el-button>
                      <el-button class="color-green" size="small" v-if="isShowInfo">
                        <img src="../../assets/icon_xz.png" />下载中
                      </el-button>
                    </el-col>
                    <el-col :span="24">
                      <div class="file-h-p0">
                        <!-- <span class="back" @click="handleAllFilebreadb">返回上一级</span>
                        <i>|</i>-->
                        <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:22px;">
                          <el-breadcrumb-item
                            @click.native="handleAllFilebreadb"
                            style="cursor:pointer;color:#18B270"
                          >全部文件</el-breadcrumb-item>
                          <el-breadcrumb-item
                            style="cursor:pointer;"
                            v-if="breadcrumbtitList"
                            v-for="(item,index) in breadcrumbtitList"
                            :key="index"
                            @click.native="handleItemFilebreadb(item.fileTarId,index)"
                          >{{item.fileName}}</el-breadcrumb-item>
                        </el-breadcrumb>
                      </div>
                      <div class="file-h-p1">已加载{{tableData.length}}个，共{{tableData.length}}个文件</div>
                    </el-col>
                  </div>
                  <!-- 内容区 -->
                  <div class="file_body">
                    <el-col :span="24" style="margin-top:10px;">
                      <div class="all_checkbox">
                        <el-checkbox v-model="thumb_checkAll" @change="handlethumbCheckAll">全选</el-checkbox>
                      </div>
                      <div class="thumbnail_list clearfix">
                        <div
                          class="thumbnail_item"
                          v-for="(item,index) in tableData"
                          :key="index"
                          :class="{'thumbnail_item_active':item.isChecked || currthumbindex==index}"
                          @mouseenter="spikEnterlist(index)"
                          @click.stop="dblclickFileRow(item)"
                        >
                          <div
                            class="thumbnail_item_top clearfix"
                            v-show="currthumbindex==index || item.isChecked"
                          >
                            <img
                              class="radio_img fl"
                              src="../../assets/icon_check_radiao.png"
                              :class="{'opcity':item.isChecked}"
                              @click.stop="spikthumbRadio(item,index)"
                            />
                          </div>
                          <div class="thumbnail_item_info flex-wrap flex-hh flex-center flex-align-item-flex-end">
                            <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                            <!-- 文件夹 -->
                            <img v-if="item.type == 0" src="../../assets/type/wjj.png" class="thumbnail_item_img" />
                            <!-- 文档 -->
                            <img
                              v-if="item.suffix=='.doc'||item.suffix=='.docx'||item.suffix=='.docm'||
                                              item.suffix=='.dotm'||item.suffix=='.dotx'||item.suffix=='.wps'||item.suffix=='.doc'||
                                              item.suffix=='.rtf'"
                              src="../../assets/type/doc.png"
                              class="thumbnail_item_img"
                            />
                            <img
                              v-if="item.suffix=='.ppt'||item.suffix=='.pptx'||item.suffix=='.pptm'||
                                              item.suffix=='.ppsx'||item.suffix=='.ppsm'||item.suffix=='.potx'||item.suffix=='.potm'||
                                              item.suffix=='.ppam'"
                              src="../../assets/type/ppt.png"
                              class="thumbnail_item_img"
                            />
                            <img
                              v-if="item.suffix=='.pdf'"
                              src="../../assets/type/pdf.png"
                              class="thumbnail_item_img"
                            />
                            <img
                              v-if="item.suffix=='.txt'"
                              src="../../assets/type/txt.png"
                              class="thumbnail_item_img"
                            />
                            <img
                              v-if="item.suffix=='.rar'||item.suffix=='.gz'||item.suffix=='.arj'||
                                              item.suffix=='.zip'"
                              src="../../assets/type/rar.png"
                              class="thumbnail_item_img"
                            />
                            <img
                              v-if="item.suffix=='.csv'||item.suffix=='.xls'||item.suffix=='.xlsx'||item.suffix=='.xlsm'||item.suffix=='.xltx'||
                                              item.suffix=='.xltm'||item.suffix=='.xlsb'||item.suffix=='.xlam'"
                              src="../../assets/type/xls.png"
                              class="thumbnail_item_img"
                            />
                            <!-- 图片 -->
                            <img v-if="item.type == 2" src="../../assets/type/JPG.png" class="thumbnail_item_img" />
                            <!-- 音乐视频 -->
                            <img
                              v-if="item.type == 3 || item.type == 4"
                              src="../../assets/type/MP3.png"
                              class="thumbnail_item_img"
                            />
                            <!-- 其它 -->
                           <img v-if="item.type == 5" src="../../assets/type/other.png" class="thumbnail_item_img">

                            <div class="thumbnail_item_text w-elli">{{item.fileName}}</div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </div>
            </el-row>
            <div class="page-container" v-if="invalid">
                <div class="info_box">
                    <p class="p1">分享的文件已取消分享或已过期</p>
                    <img class="img" src="../../assets/icon_fx.png" />
                </div>
            </div> 
          </el-col>
        </div>
      </section>

      
    </el-col>
    <!-- 下载文件进度列表 -->
      <file-progress></file-progress>
            <!-- 图片预览查看 -->
        <viewer :images="viewer_imgs" ref="viewerFuj" @inited="initedFj" style="display:none;">
            <!-- viewer_imgs 一定要一个数组，否则报错 -->
            <img v-for="(src,index) in viewer_imgs" :src="src" :key="index">
        </viewer>
     <!-- 视频预览查看 -->
        <div class="video-player"    v-if="viewVideo">
            <i class="icon_close el-icon-close" @click="viewVideo = false"></i>
            <video-player  class="video-player vjs-custom-skin"
                ref="videoPlayer"
                :playsinline="true"
                :options="playerOptions"
            >
            
            </video-player>
        </div>
            <!-- 文件预览 -->
        <div class="src-view" v-show="srcView" ref="iframeCover"> 
          <span class="border-radius"> <i class="icon_docview_close el-icon-close" @click="srcView = '';"></i></span>
          <iframe src="" frameborder="0" ref="iframeView" class="iframe-view"></iframe>
      </div>
  </section>
</template>
<script>
import axios from "axios";
import { getData } from "../../api/api";
import {Dialog} from "../../api/util.js";
import {downloadStore} from "../../api/download_store.js";
import fileprogress from '../../components/file_progress'
export default {
  components:{
        'file-progress':fileprogress
    },
  data() {
    return {
      loading:true,
      loadlistTxt:'',
      invalid:false,//分享失效
      corpAccId: "", //企业id
      getusers: "",
      num: "",
      times: "",
      thumb_checkAll: false,
      tableData: [],
      currthumbindex: null,
      radio_arrIds: [],
      r_fileTarId: [],
      r_toFileTarId: "",
      breadcrumbtitList: [],
      fileTarId: "",
      isSearch: false, //判断是否触发了搜索
      empAccId: "",
      shareCode: "",
      code:'',
      collapsed:false,
      menulistJson: [
        {resName:'云盘'},
        {resName:'系统设置'},
        {resName:'帮助'},
      ],
      meunList:[],
      isShow:true,
      isShowInfo:false,
      //文件（夹）下载
      download_fileTarIds:[], //传后台数据
      download_fileTarId:'',
      download_progress_all:[], //总进度
      download_filename:'', //下载文件名
      is_d_progress:false, //进度条展示控制
      download_progress_list:[], //下载列表
      download_p_list:[], //下载列表
      is_p_suox:false, //控制下载弹框是否缩小显示，
        //图片预览
      viewer_imgs:[],
      //视频预览
      playerOptions:[],
      viewVideo:false,
      srcView:'',

    };
  },
  mounted() {
    let _this = this;
    var url = window.location.href;
    if (url.indexOf("?") > -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      strs[0].split("=")[1];
      _this.shareCode = strs[0].split("?")[1];
    }
    if (_this.shareCode != "") {
      _this.init();
    }
  },
  computed: {},
  methods: {
    init: function() {
      let _this = this;
      let para = {
        'shareCode': _this.shareCode
      };
      this.listLoading = true;
      getData("open/api/myShare/visit", para).then(res => {
        this.listLoading = false;
        _this.code = res.code;
        if (res.code == 200) {
          _this.num = res.data.expireDate == null ? '永久有效' : res.data.expireDate
          _this.times = res.data.shareDate;
          _this.empAccId = res.data.empAccId;
          if(res.data.sharesFile && res.data.sharesFile.length>0){
            _this.tableData = res.data.sharesFile.map((v, i) => {
              _this.$set(v, "isChecked", false);
              return v;
            });
          }
          _this.loading = false;
        }else {
          // this.$router.push("./invalidshare")
          _this.invalid = true
          _this.loading = false;
          Dialog.message(res.message,'error',1500)
        }
      }),
        err => {
          console.log(err);
        };
    },
    // 全选
    handlethumbCheckAll: function() {
      const ids = [];
      if (this.thumb_checkAll) {
        this.tableData.map(function(v, i) {
          if (v.isChecked == false) {
            v.isChecked = true;
          }
          ids.push(v.fileTarId);
          return v;
        });
        this.r_fileTarId = ids;
        // console.log(this.r_fileTarId);
      } else {
        this.tableData.map(function(v, i) {
          if (v.isChecked == true) {
            v.isChecked = false;
          }
          return v;
        });
        this.r_fileTarId = [];
      }
    },
    spikEnterlist(index) {
      this.currthumbindex = index;
    },
    handleAllFilebreadb: function() {
      let _this = this;
      this.breadcrumbtitList = [];
      let param = {
        'shareCode': _this.shareCode,
        'fileTarId': null
      };
      this.listLoading = true;
      getData("open/api/myShare/visit", param).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          _this.num = res.data.expireDate;
          _this.times = res.data.shareDate;
          _this.tableData = res.data.sharesFile.map((v, i) => {
            _this.$set(v, "isChecked", false);
            return v;
          });
        }
      }),
        err => {
          console.log(err);
        };
    },
    dblclickFileRow(row) {
      //双击行
      console.log(row);
      let _this = this;
      if (row.type == 0) {
        this.fileTarId = row.fileTarId;
        this.breadcrumbtitList.push(row);
        this.now_page = 1;
        let param = {
          'shareCode': _this.shareCode,
          'fileTarId': row.fileTarId
        };
        this.listLoading = true;
        getData("open/api/myShare/visit", param).then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            _this.num = res.data.expireDate;
            _this.times = res.data.shareDate;
            _this.tableData = res.data.sharesFile.map((v, i) => {
              _this.$set(v, "isChecked", false);
              return v;
            });
          }
        }),
          err => {
            console.log(err);
          };
      }
       //图片
        if(row.type == 2){
            this.viewer_imgs = [axios.defaults.baseURL+'upload'+encodeURI(row.localUrl)]
            console.log(axios.defaults.baseURL+'upload'+encodeURI(row.localUrl))
            this.$viewerFuj.show();
        }
        //文档
        if(row.type == 1){
            this.loading=true
            this.loadlistTxt='拼命加载打开文件，请稍等'
            this.docPreview(row)
        }
           //视频
        if(row.type == 4){
          if(row.suffix!=='.mov' && row.suffix!=='.mkv' &&row.suffix!=='.mp4' ){
            Dialog.message('暂不支持播放','error',1500)
            return
         }
        var sources = [{
            type: "video/mp4",
            src:axios.defaults.baseURL+'upload'+encodeURI(row.localUrl)
        }]
        this.viewVideo = true;
        this.playerOptions= {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources:sources,
                poster: "../../static/images/test.jpg", //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true  //全屏按钮
                }
            }

        }
    },
        //赋值图片预览
    initedFj(viewer) {
      this.$viewerFuj = viewer;
    },
        //文档预览
    docPreview(row){
        getData("web/file/preview", {
            'fileTarId':row.fileTarId
        }).then(res => {
            if (res.code == 200) {
                if(res.data){
                    // var url = encodeURI(axios.defaults.baseURL+res.data)
                    var url = axios.defaults.baseURL+res.data
                    //window.open(url,'_blank',"menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
                    //使用window.open方法打开的窗口可能被拦截的替代方案，可利用超链接打开的url是不会被浏览器拦截
                    // var el = document.createElement("a");
                    // document.body.appendChild(el);
                    // el.href = encodeURI(url);
                    // el.target = '_blank';
                    // el.click();
                    var dom = this.$refs.iframeView;
                    var cover = this.$refs.iframeCover;
                    var windH = document.documentElement.clientHeight || document.body.clientHeight;
                    var windW = document.documentElement.clientWidth || document.body.clientWidth;
                    dom.style.height = windH+'px';
                    cover.style.height = windH+'px';
                    cover.style.width = windW+'px';
                    setTimeout(()=>{
                                 this.srcView = true;
                    },500)
                     dom.src= url
                }
            }else{
                Dialog.message(res.message,'error',1500)
            }
            setTimeout(() => {
                this.loading=false
                this.loadlistTxt=''
            }, 2000);
        });
        //  var url = axios.defaults.baseURL+'upload'+row.localUrl
        //       url= url.substring(0,url.length-1)
        //     //window.open(url,'_blank',"menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1");
        //     //使用window.open方法打开的窗口可能被拦截的替代方案，可利用超链接打开的url是不会被浏览器拦截
        //     window.open('http://192.168.110.92:8012/onlinePreview?url='+encodeURIComponent(url))
    },
    //单选
    spikthumbRadio(item, index) {
      let that = this;
      const ids = [];
      this.tableData[index].isChecked = !this.tableData[index].isChecked;
      if (this.tableData[index].isChecked) {
        this.radio_arrIds.push(this.tableData[index]);
      } else {
        this.radio_arrIds.map(function(v, i) {
          if (v.fileTarId == that.tableData[index].fileTarId) {
            if (i > -1) {
              that.radio_arrIds.splice(i, 1);
            }
          }
        });
      }
      this.radio_arrIds.map(item => {
        ids.push(item.fileTarId);
      });
      this.r_fileTarId = ids;
      // console.log(ids);
    },
    handleItemFilebreadb(fileTarId, index) {
      let _this = this,
        num = index + 1;
      this.breadcrumbtitList.splice(num, this.breadcrumbtitList.length - num);
      // console.log(JSON.stringify(this.breadcrumbtitList,null,'\t'))
      this.fileTarId = fileTarId;
      // this.now_page = 1;
      let param = {
        'shareCode': _this.shareCode,
        'fileTarId': this.fileTarId
      };
      this.isSearch = false;
      getData("open/api/myShare/visit", param).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          _this.num = res.data.expireDate;
          _this.times = res.data.shareDate;
          _this.tableData = res.data.sharesFile.map((v, i) => {
            _this.$set(v, "isChecked", false);
            return v;
          });
        }
      }),
        err => {
          console.log(err);
        };
    },
    //下载
    //单个下载
    handledownloadWj(row){
        let that = this;
        if(that.r_fileTarId && that.r_fileTarId.length>0){
          that.isShow = false;
          that.isShowInfo = true;
          this.preDownloadWj()
        }else{
          Dialog.message('请先选择下载的文件!','error',1500)
        }
    },
    //预下载
    preDownloadWj(){
        let that = this
        getData("/open/api/file/preDownload", {
            'empAccId':this.empAccId,
            'fileTarIds':this.r_fileTarId
        }).then(res => {
            if (res.code == 200) {
                let row = res.data
                that.is_d_progress=true
                that.is_p_suox=false
                
                if(that.download_progress_list.length > 0){
                    var ret2 = that.download_progress_list.findIndex((v) => {
                        return v.size == row.size;
                    })
                    if(ret2 <= -1){
                        // 当返回-1时，则说明objArr中没有
                        that.ajaxDownloadWj(row)
                    }
                }else{
                    that.ajaxDownloadWj(row)
                }
            }else{
              setTimeout(function(){
                 that.isShow = true;
                 that.isShowInfo = false;
              },1000)
            }
        });
    },
    ajaxDownloadWj(row){
      this.download_progress_list.push({
        // 'id':row.fileTarId,
        'type':row.type,
        'suffix':row.suffix,
        'sizeFormat':row.sizeFormat,
        'size': row.size,
        'name':row.fileName,
        'progress':0
      })
      this.xhrDownloadWj(row)
    },
    xhrDownloadWj(row){
      let that=this,download_speed=0;//下载文件网速 kb/s
      let f_name = encodeURI(row.fileName)
      let ajaxUrl = axios.defaults.baseURL+'open/api/myShare/download?empAccId='+this.empAccId+'&fileTarIds='+this.r_fileTarId+'&shareCode='+this.shareCode+'&fileName='+f_name;
      let startTime, endTime, fileSize, d_currt=0; // 下载文件网速
      var xhr = new XMLHttpRequest();
      xhr.open('GET', ajaxUrl, {
              'empAccId': that.empAccId,
              'fileTarIds': that.r_fileTarId,
              'shareCode': that.shareCode
            });
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.responseType = "blob";
      startTime = Date.now();
      xhr.onprogress = function (event) {
          if(row.size > 0){
            var progress = parseInt(event.loaded / row.size * 100)
          }else{
            var progress = 100
          }
          // console.log('progress------' + progress)
          // 文件下载网速
          ++d_currt
          endTime = Date.now();
          fileSize = event.loaded;
          let time = endTime - startTime
          if(time > 0){
              var speed = fileSize / (time / 1000) / 1024;
          }
          download_speed = Number.isInteger(d_currt / 9) ? Math.floor(speed) : download_speed <=0 ? Math.floor(speed) : download_speed
          //文件下载网速结束

          var p_arr = that.download_progress_list.map((v,i)=>{
              if(row.size == v.size){
                  v.progress = progress >= 100 ? 100 : progress,
                  v.d_speed = download_speed
              }
              return v
          })
          that.download_p_list = p_arr

          let store_msg={
              'download_p_list':that.download_p_list
          }
          downloadStore.setMessageAction(store_msg)
      };
      let store_p_msg = {
          'is_d_progress':true,
          'is_p_suox':false
      }
      downloadStore.setMessageItem(store_p_msg)
      xhr.onload = function (oEvent) {
          if (xhr.readyState === 4 && xhr.status === 200) {
              //争对空文件做处理，进度条直接100%
              if(row.size <= 0){
                  var p_arr = that.download_progress_list.map((v,i)=>{
                          if(row.fileName == v.name){
                              v.progress = 100,
                              v.d_speed = 10
                          }
                          return v
                      })
                  that.download_p_list = p_arr
                  let store_msg={
                      'download_p_list':that.download_p_list,
                      // 'startTime':startTime
                  }
                  downloadStore.setMessageAction(store_msg)
              }

              var blob = new Blob([xhr.response]);
              var csvUrl = URL.createObjectURL(blob);
              var link = document.createElement('a');
              link.href = csvUrl;
              link.download = row.fileName;
              link.click();

              //判断下载文件浏览器已经操作下载，但进度条未到100%，执行处理
              let p_list = that.download_p_list.map((item,index)=>{
                if(item.name == row.fileName && item.progress < 100){
                  item.progress = 100
                }
                return item
              })
              let store_msg={
                'download_p_list':p_list
              }
              downloadStore.setMessageAction(store_msg)

              //
              setTimeout(function(){
                that.isShow = true;
                that.isShowInfo = false;
              },1000)
              
          }
      }
      xhr.send();
    },
    //下载结束

    //导航菜单
    spikHeadmenu:function(){
      this.$router.push('./login')
    },
    logout:function(){
        this.$router.push('./login')
    },
  }
};
</script>
<style scoped lang="scss">
.pages {
  padding: 10px 14px;
}
.times {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  margin-right: 20px;
}
.sxTimes {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  margin-right: 10px;
}
.sxTimes > i {
  font-style: normal;
  color: #ed9944;
}
.file-h-p0 {
  width: 100%;
  display: block;
  color: #222;
  font-size: 14px;
  margin-top: 7px;
  line-height: 22px;
  display: flex;
}
.file-h-p0 .back {
  font-size: 14px;
  line-height: 22px;
  color: rgba(68, 137, 237, 1);
  cursor: pointer;
}
.file-h-p0 i {
  font-style: normal;
  color: #9b9b9b;
  padding: 0 6px;
}

.file-h-p1 {
  width: 100%;
  display: block;
  font-size: 12px;
  color: #999999;
  line-height: 22px;
}
.el-button--small {
  font-size: 14px;
  border-radius: 4px;
  padding: 4px 14px;
}
.file_body .all_checkbox {
  padding-left: 15px;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 4px;
}
/* 缩略图 */
.thumbnail_list {
  position: relative;
}
.thumbnail_list .thumbnail_item {
  width: 124px;
  height: 96px;
  cursor: pointer;
  margin-left: 8px;
  margin-top: 7px;
  padding-top: 16px;
  padding-bottom: 16px;
  float: left;
  border: 1px solid #fff;
  position: relative;
}
.thumbnail_list .thumbnail_item:hover {
  background: #f5f7fa;
  //   border: 1px solid #dcdfe6;
  border-radius: 10px;
}
.thumbnail_item_active {
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
}
/* .thumbnail_list .thumbnail_item:hover{
     background: #F5F7FA;
     border: 1px solid #DCDFE6;
     border-radius:10px;
 } */
.thumbnail_item .thumbnail_item_info {
  height: 100%;
  width: 100%;
}
.thumbnail_list .thumbnail_item_text {
  width: 100%;
  text-align: center;
  display: block;
  height: 16px;
  color: #222;
}
.thumbnail_list .thumbnail_item_text:hover {
  color: #18b270;
}
.thumbnail_list .thumbnail_item_top {
  position: absolute;
  width: 100%;
  top: 5px;
  left: 5px;
}
.thumbnail_list .thumbnail_item_top img {
  vertical-align: middle;
}
.thumbnail_list .radio_img {
  opacity: 0.5;
}
.thumbnail_list .radio_img.opcity {
  opacity: 1;
}
.thumbnail_list .radio_more {
  width: 16px;
  height: 16px;
  margin-right: 10px;
}
.thumbnail_list .radio_more img {
  width: auto;
  vertical-align: middle;
}

/* 缩略图下拉 */
.more_dropdown {
  width: 84px;
  border: 1px solid #18b270;
  border-radius: 4px;
  position: absolute;
  top: 4px;
  right: -90px;
  z-index: 1;
  background: #fff;
  display: block;
  animation: mymove 5s infinite;
  -webkit-animation: mymove 5s infinite;
}
.more_dropdown::after {
  box-sizing: content-box;
  width: 0px;
  height: 0px;
  position: absolute;
  top: 4px;
  left: -16px;
  padding: 0;
  border-right: 8px solid #18b270;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  display: block;
  content: "";
  z-index: 10;
}

// 空列表的时候
.page-container {
    text-align: center;
    height: 100vh;
    background: #fff;
}
.info_box{
    padding-top: 24vh;
    width: 300px;
    margin: auto;
    height: auto;
}
.info_box p{
    text-align: left;
    padding-left: 22px;
}
.info_box .p0{
    color: #333;
    font-size: 48px;
    margin-bottom: 16px;
}
.info_box .p1{
    margin-bottom: 38px;
    font-size: 16px;
    color: #939393
}
.page-container .img{
    display: block;
    margin: auto;
}
.video-player{
    width: 50vw;
    height: 20vh;
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6666;
}
.video-player /deep/.video-js .vjs-big-play-button{
    top: 50%;
    left: 50%!important;
    transform: translate(-50%, -50%);
}
.icon_close{
    position: absolute;
    right: 8px;
    top: 108px;
    color: #fff;
    font-size: 24px;
    z-index: 6667;
    cursor: pointer;
}
.src-view{
    background: rgba(0, 0, 0, 0.8);
    position: fixed;
    z-index: 6665;
    top: 0;
    left: 0;
}
.border-radius{
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    width: 30px;
    height: 30px;
    display: block;
    position: absolute;
    right: 27px;
    top: 52px;
    z-index: 6667;
    text-align: center;
}
.icon_docview_close{
    color: #fff;
    z-index: 6667;
    font-size: 24px;
    line-height: 30px;
    cursor: pointer;

}
.iframe-view{
  width:100% ;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 6666;
}
</style>;
