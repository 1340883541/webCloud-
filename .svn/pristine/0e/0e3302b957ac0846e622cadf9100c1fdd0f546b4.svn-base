<template>
  <section>
    <el-row v-if="tableData.length>0">
      <div class="pages">
        <div class="breadcrumb">
          <div class="header_info">
            <span class="curr_title">当前位置：</span>
            <span class="title">首页</span>
            <i>/</i>
            <span class="title_i">常用文件</span>
          </div>
        </div>
      </div>
      <div class="page-container">
        <el-col :span="24">
          <!-- <div class="file-h-p0">
            <el-breadcrumb separator-class="el-icon-arrow-right" style="line-height:22px;">
              <el-breadcrumb-item
                @click.native="handleAllFilebreadb"
                style="cursor:pointer;color:#18B270"
              >全部文件</el-breadcrumb-item>
              <el-breadcrumb-item
                style="cursor:pointer;"
                v-for="(item,index) in breadcrumbtitList"
                :key="index"
                @click.native="handleItemFilebreadb(item.fileTarId,index,item)"
              >{{item.fileName}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div> -->
        </el-col>
        <!-- 表格 -->
        <div class="table_info">
          <el-table
            :data="tableData"
            ref="multipleTable"
            :header-cell-style="{background:'#fff',fontSize:'14px',color:'#666',fontWeight:'400',padding:' 8px 0'}"
            style="width: 100%"
            v-loading = "listLoading" :element-loading-text="loadlistTxt" element-loading-background="rgba(255, 255, 255, 0.7)"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="位置:">
                    <!-- <span>{{ props.row.visitUrl}}</span> -->
                    <div
                      class="flex-wrap elipseone wj_path_div"
                      @click.stop="handleLinkPath(props.row)"
                    >{{props.row.visitUrl}}</div>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="fileName" min-width="200">
              <template slot-scope="scope">
                <div class="flex-wrap flex-con">
                  <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                  <img
                    class="filename_icon fl"
                    v-if="scope.row.type == 0"
                    src="../../assets/type/wjj_small.png"
                  />
                  <!-- 文档 -->
                  <img style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    class="filename_icon fl"
                    v-if="scope.row.suffix=='.doc'||scope.row.suffix=='.docx'||scope.row.suffix=='.docm'||
                                        scope.row.suffix=='.dotm'||scope.row.suffix=='.dotx'||scope.row.suffix=='.wps'||scope.row.suffix=='.doc'||
                                        scope.row.suffix=='.rtf'"
                    src="../../assets/type/doc-small.png"
                  />
                  <img style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    class="filename_icon fl"
                    v-if="scope.row.suffix=='.ppt'||scope.row.suffix=='.pptx'||scope.row.suffix=='.pptm'||
                                        scope.row.suffix=='.ppsx'||scope.row.suffix=='.ppsm'||scope.row.suffix=='.potx'||scope.row.suffix=='.potm'||
                                        scope.row.suffix=='.ppam'"
                    src="../../assets/type/ppt-small.png"
                  />
                  <img style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    class="filename_icon fl"
                    v-if="scope.row.suffix=='.pdf'"
                    src="../../assets/type/PDF-small.png"
                  />
                  <img style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    class="filename_icon fl"
                    v-if="scope.row.suffix=='.txt'"
                    src="../../assets/type/txt-small.png"
                  />
                  <img style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    class="filename_icon fl"
                    v-if="scope.row.suffix=='.rar'||scope.row.suffix=='.gz'||scope.row.suffix=='.arj'||
                                        scope.row.suffix=='.zip'"
                    src="../../assets/type/rar-small.png"
                  />
                  <img style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    class="filename_icon fl"
                    v-if="scope.row.suffix=='.csv'||scope.row.suffix=='.xls'||scope.row.suffix=='.xlsx'||scope.row.suffix=='.xlsm'||scope.row.suffix=='.xltx'||
                                        scope.row.suffix=='.xltm'||scope.row.suffix=='.xlsb'||scope.row.suffix=='.xlam'"
                    src="../../assets/type/xls-small.png"
                  />
                  <!--图片 -->
                  <img
                    class="filename_icon fl"
                    v-if="scope.row.type == 2"
                    style="cursor: pointer" @click="dblclickFileRow(scope.row)"
                    src="../../assets/type/JPG-small.png"
                  />
                  <!-- 音乐视频 -->
                  <img
                    class="filename_icon fl"
                    v-if="scope.row.type == 3 || scope.row.type == 4"
                    @click="dblclickFileRow(scope.row)"
                    src="../../assets/type/MP3-small.png"
                  />
                  <!-- 其它 -->
                  <img class="filename_icon fl" v-if="scope.row.type == 5" src="../../assets/type/other-small.png">
                  <span class="table_filename elipseone" :title="scope.row.fileName" style="cursor: pointer" @click="dblclickFileRow(scope.row)">{{ scope.row.fileName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="文件大小" :formatter="TsizeFormat" prop="sizeFormat" width="120"></el-table-column>
            <el-table-column label="更新时间" prop="lastModifiedDate" width="200"></el-table-column>
            <el-table-column label="更新人" prop="modifier" width="120"></el-table-column>
            <el-table-column label="备注" :formatter="Tdescription" prop="description" min-width="120"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="manage_page" v-if="tableData!=''">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="page_size"
              :pager-count="pager_count"
              layout="prev, pager, next, total"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-row>
    <!-- <div class="page-container_info" v-else>
      <div class="info_box">
          <p class="p1">暂无收藏文件（夹），赶紧去试一下吧</p>
          <img class="img" src="../../assets/icon-nodata.png" />
      </div>
    </div> -->

    <!-- 图片预览查看 -->
    <viewer :images="viewer_imgs" ref="viewerFuj" @inited="initedFj" style="display:none;">
        <!-- viewer_imgs 一定要一个数组，否则报错 -->
        <img v-for="(src,index) in viewer_imgs" :src="src" :key="index">
    </viewer>
         <!-- 视频预览查看 -->
       <div class="video-page-cover" ref="videoCover" v-show="coverHidden">
            <div class="video-player"    v-if="viewVideo">
              <i class="icon_close el-icon-close" @click="viewVideo = false;coverHidden=false"></i>
                <video-player  class="video-player vjs-custom-skin"
                    ref="videoPlayer"
                    :playsinline="true"
                    :options="playerOptions"
                >
                
                </video-player>
            </div>
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
import { construct, destruct } from "@aximario/json-tree";
import {Dialog,getCookie} from "../../api/util.js";
export default {
  components: {},
  data() {
    return {
      corpAccId: null, //企业id
      empAccId: null, //员工id
      getusers: "",
      page: 1, //列表分页
      page_size: 10, //一页10调
      pager_count: 9, //
      total: 1,
      listLoading: true,
      loadlistTxt:'',
      tableData: [],
      fileShareTarIds: [],
      parentFileId: null,
      parentFileName: "",
      breadcrumbtitList: [],
      isRbac_list: false, //列表
      //图片预览
      viewer_imgs:[],
      //视频预览
      playerOptions:[],
      viewVideo:false,
      coverHidden:false,
      srcView:'',
    };
  },
  mounted() {
    let _this = this;
    let userData = localStorage.getItem("user");
    let token = getCookie("token"); 
    if (token) {
      let userDataJson = eval("(" + userData + ")");
      this.corpAccId = userDataJson.corpAccId;
      this.empAccId = userDataJson.empAccId;
      this.getrbacData();
    } else {
      this.$router.push("/login");
    }
    // this.getusers = sessionStorage.getItem("user");
    // if (this.getusers) {
    //   //字符串转对象
    //   this.getusers = eval("(" + this.getusers + ")");
    // }
    // _this.corpAccId = _this.getusers.corpAccId;
    // _this.empAccId = _this.getusers.empAccId;
    // _this.getrbacData();
  },
  computed: {},
  methods: {
    //菜单资源权限
    //菜单\功能\子功能操作权限
    getrbacData() {
      let that = this;
      getData("open/api/res/findResByEmpAcc", {
        'empAccId': this.empAccId
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
                v.children.map((val, idx) => {
                  if (val.routePath == "/usedFiles") {
                    //功能操作
                    if (val.children && val.children.length > 0) {
                      // console.log(JSON.stringify(val.children, null, "\t"));
                      val.children.map((value, index) => {
                        if (value.resType == "FUNC") {
                          switch (value.accessPath) {
                            case "/":
                              that.isRbac_list = true;
                              break;
                          }
                        }else if(!that.isRbac_list){
                           that.$router.push({ path: "/403" });
                        }
                      });
                    }
                  }
                });
              }
            });
          }
          that.init();
        }
      });
    },
    // 获取列表
    init: function() {
      let _this = this;
      let para = {
        'page': _this.page,
        'empAccId': _this.empAccId,
        'corpAccId': _this.corpAccId,
        'size': _this.page_size,
        'collected': 1
      };
      _this.listLoading = true;
      getData("web/file/empAcc/files", para).then(res => {
        if (res.code == 200) {
          _this.listLoading = false;
            if(res.data==null|| res.data==''){
            _this.$router.push('/collection')
           }else{
            _this.tableData = res.data;
            _this.page_size = res.currentSize;
            _this.total = res.totalCount;
            _this.parentFileId = res.parentFileId
           }
          let data = res.data.map(function(v, i) {
            if (v.visitUrl.indexOf(res.parentFileName) > -1) {
              let arr_visitUrl = v.visitUrl.split(
                "/" + res.parentFileName + "/"
              );
              let string_v_url = arr_visitUrl[arr_visitUrl.length - 1];
              string_v_url = string_v_url.substr(
                0,
                string_v_url.lastIndexOf("/")
              );
              v.visitUrl = "全部文件/" + string_v_url;
            }
            return v;
          });
        }else if (res.code == 1001) {
            Dialog.message(res.message,'error',1500)
            _this.$router.push({ path: "/403" });
        }
      }),
        err => {
          console.log(err);
        };
    },
    // 路径
    handleLinkPath: function(row) {
      let s_visitUrl = row.visitUrl
      let arr_visitUrl = s_visitUrl.split('全部文件/')
      let arr_idPath = row.idPath.split('/'+this.parentFileId+'/')

      let arr_url_split = arr_visitUrl[arr_visitUrl.length-1].split('/');
      let arr_idPath_split = arr_idPath[arr_idPath.length-1].split('/');
      // console.log(arr_url_split)
      // console.log(arr_idPath_split)

      let newbrod = [],that=this;
      if(arr_url_split.length>0){
          arr_url_split.map((v,i) => {
              if(v){
                  let item = {
                      'fileName':v,
                      'fileTarId':arr_idPath_split[i]
                  }
                  newbrod.push(item)
              }
          })
      }
      // console.log(JSON.stringify(newbrod))

      if(row.type==0){
        // console.log(JSON.stringify(newbrod))
        sessionStorage.setItem("newbrod", JSON.stringify(newbrod))
        this.$router.push({
          path: "/all_file",
          query: {
            fileTarId:row.fileTarId
          }
        })
      }else if(row.type!=0){
        let popped_newbrod = newbrod.pop();
        // console.log(JSON.stringify(newbrod))
        sessionStorage.setItem("newbrod", JSON.stringify(newbrod))
        this.$router.push({
          path: "/all_file",
          query: {
            fileTarId:row.parentFileId
          }
        })
      }
    },

    // //每页显示条目个数
    handleSizeChange: function(val) {
      this.page = val;
      this.page_size = val;
      this.init();
    },
    //条目改变时
    handleCurrentChange(val) {
      this.page = val;
      this.init();
    },
    TsizeFormat(row) {
      return row.sizeFormat ? row.sizeFormat : "-";
    },
    Tdescription(row) {
      return row.description ? row.description : "-";
    },

    //单击文件(夹)
    dblclickFileRow(row) {
      if(row.type == 2){
        this.viewer_imgs = [axios.defaults.baseURL+'upload'+encodeURI(row.localUrl)]
        this.$viewerFuj.show();
      }
      //文档
      if(row.type == 1){
          this.listLoading=true
          this.loadlistTxt='拼命加载打开文件，请稍等'
          this.docPreview(row.fileTarId)
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
          this.coverHidden = true;
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
    docPreview(fileid){
        getData("web/file/preview", {
            'fileTarId':fileid
        }).then(res => {
            if (res.code == 200) {
                if(res.data){
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
                this.listLoading=false
                this.loadlistTxt=''
            }, 2000);
        });
    },
  }
};
</script>


<style scoped lang="scss">
.pages {
  width: 100%;
  // border-bottom: 1px solid #dcdfe6;
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
.wj_path_div {
  font-size: 14px;
  color: #4489ed;
  cursor: pointer;
  width: 86vw;
  position: absolute;
  z-index: 1;
}
.demo-table-expand .el-form-item {
  width: 100% !important;
}
.demo-table-expand {
  font-size: 0;
  // margin-left: -32px;
  // background: #F5F7FA;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 10px;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.filename_icon {
  width: 20px;
  height: 20px;
}
.page-container {
  // padding: 0 15px;
  // margin-top: 17px;
}
.addmenu_box .el-input__icon {
  position: absolute;
  right: 10px;
  color: #666;
}

.file_h_item {
  display: block;
  float: left;
  margin-right: 8px;
  margin-top: 15px;
  //   margin-bottom: 16px;
}
.el-button--small {
  font-size: 14px;
  border-radius: 4px;
  padding: 7px 14px;
}
.el-button--small img {
  vertical-align: bottom;
  margin-right: 2px;
  width: 16px;
  height: 16px;
}
.table_filename {
  margin-left: 10px;
  color: #222;
  font-size: 14px;
}

.page-container_info {
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
.page-container_info .img{
    display: block;
    margin: auto;
}
.video-page-cover{
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.1);
    z-index: 6665;
    position: absolute;
    top: 0;
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
</style>
