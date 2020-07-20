<template>
      <div>
        <!-- 进度条 -->
        <div class="both_progress" v-show="is_progress">
            <div class="both_p_head">
                  <ul>
                  <li @click="headerActivity=0" :class="{'activity':headerActivity==0}">下载进度({{download_p_list.length}})</li>
                  <li  @click="headerActivity=1" :class="{'activity':headerActivity==1}">上传进度({{upload_p_list.length}})</li>
              </ul>
                <!-- <div class="fr down_p_close" @click.stop="closeProgressDialog"><img src="../assets/icon_delete.png"></div> -->
                <div class="fr down_p_close" @click.stop="suoxProgressDialog('close')">
                    <img v-if="is_progress" src="../assets/icon_suox_new.png">
                </div>
            </div>
            <div class="down-content" v-show="headerActivity==0">
                <ul class="both_p_ul">
                    <li class="both_p_li" v-for="(item,oldindex) in download_p_list" :key="oldindex">
                        <div class="flex-wrap">
                            <div class="both_img_box">
                                    <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                                    <!-- 文档 -->
                                    <img v-if="item.suffix=='.doc'||item.suffix=='.docx'||item.suffix=='.docm'||
                                            item.suffix=='.dotm'||item.suffix=='.dotx'||item.suffix=='.wps'||item.suffix=='.doc'||
                                            item.suffix=='.rtf'" src="../assets/type/doc-small.png">
                                    <img v-if="item.suffix=='.ppt'||item.suffix=='.pptx'||item.suffix=='.pptm'||
                                            item.suffix=='.ppsx'||item.suffix=='.ppsm'||item.suffix=='.potx'||item.suffix=='.potm'||
                                            item.suffix=='.ppam'" src="../assets/type/ppt-small.png">
                                    <img v-if="item.suffix=='.pdf'" src="../assets/type/PDF-small.png">
                                    <img v-if="item.suffix=='.txt'" src="../assets/type/txt-small.png">
                                    <img v-if="item.suffix=='.rar'||item.suffix=='.gz'||item.suffix=='.arj'||
                                        item.suffix=='.zip'" src="../assets/type/rar-small.png">
                                    <img v-if="item.suffix=='.csv'||item.suffix=='.xls'||item.suffix=='.xlsx'||item.suffix=='.xlsm'||item.suffix=='.xltx'||
                                        item.suffix=='.xltm'||item.suffix=='.xlsb'||item.suffix=='.xlam'" src="../assets/type/xls-small.png">
                                    <!--图片 -->
                                    <img v-if="item.type == 2" src="../assets/type/JPG-small.png">
                                    <!-- 音乐视频 -->
                                    <img v-if="item.type == 3 || item.type == 4" src="../assets/type/MP3-small.png">
                                    <!-- 其它 -->
                                    <img v-if="item.type == 5" src="../assets/type/other-small.png">
                            </div>
                            <div class="both_info_box flex-con">
                                <p class="p0 elipseone">{{item.name}}</p>
                                <p class="p1 elipseone">{{item.sizeFormat}}  {{item.d_speed}}KB/s</p>
                            </div>
                        </div>
                    <el-progress :width="300" :stroke-width="6" :percentage="item.progress" color="#18B270"></el-progress>
                    <div class="both_progress_text" v-if="item.progress != 100">下载中…</div>
                    <div class="both_progress_text" v-if="item.progress == 100">下载完成!</div>
                    </li>
                </ul>
   
            </div>
            <div class="upload-content" v-show="headerActivity==1">
                <ul class="both_p_ul">
                    <li class="both_p_li" v-for="(item,index) in upload_p_list" :key="index" v-if="item.type!=1001">
                        <div class="flex-wrap">
                            <div class="both_img_box">
                                    <img v-if="fileType(item.files.name) =='pdf'" src="../assets/type/PDF-small.png">
                                    <img v-else-if="fileType(item.files.name) =='txt'" src="../assets/type/txt-small.png">
                                    <img v-else-if="fileType(item.files.name) =='zip'" src="../assets/type/rar-small.png">  
                                    <img v-else-if="fileType(item.files.name) =='xls'" src="../assets/type/xls-small.png">
                                    <img v-else-if="fileType(item.files.name) =='ppt'" src="../assets/type/ppt-small.png">
                                    <!-- 文档 -->
                                    <img v-else-if="fileType(item.files.name) =='doc'" src="../assets/type/doc-small.png">
                                    <!--图片 -->
                                    <img v-else-if="fileType(item.files.name) =='img'" src="../assets/type/JPG-small.png">
                                    <!-- 音乐视频 -->
                                    <img v-else-if="fileType(item.files.name) =='video'" src="../assets/type/MP3-small.png">
                                    <!-- 其它 -->
                                    <img v-else src="../assets/type/other-small.png">
                            </div>
                            <div class="both_info_box flex-con">
                                <p class="p0 elipseone">{{item.files.name}}</p>
                                <p class="p1 elipseone">
                                    <span v-if="item.files.size>1073741824">{{item.uploadSize}}/{{item.files.size/1073741824 | tofix2}}G</span>  
                                    <span v-if="1048576< item.files.size && item.files.size<1073741824">{{item.uploadSize}}/{{item.files.size/1048576 | tofix2}}M</span>  
                                    <span v-if="item.files.size<1048576">{{item.uploadSize}}/{{(item.files.size)/1024 | tofix2}}Kb</span>  
                                    {{item.uploadSpeed}}</p>
                            </div>
                        </div>
                    <el-progress :width="300" :stroke-width="6" :percentage="item.progress" color="#18B270" style="width:85%;float:left"> </el-progress>
                    <div class="upload_set" v-if="item.type !==1">
                            <i :class="{'icon_stop':item.type!='1002','icon_upload':true,'icon_start':item.type=='1002'} " @click="stopUpload(item,index)"></i>
                            <i class="icon_del icon_upload" @click="delUpload(item,index)"></i>
                      </div>
                    <div class="both_progress_text" v-if="item.progress != 100 && item.type==2 ">正在上传…</div>
                    <div class="both_progress_text" v-if="item.type == 0">排队中…</div>
                    <div class="both_progress_text" v-if="item.progress == 100 && item.type == 1">上传完成!</div>
                    <div class="both_progress_text" v-if="item.progress != 100 && item.type == 1002">暂停中!</div>
                    </li>
                </ul>
            </div>
            <!-- <el-progress :width="160" :stroke-width="8" :percentage="both_progress" color="#18B270"></el-progress> -->
        </div>
        <div v-show="is_p_suox || !is_progress" class="both_progress_suox"  @mousedown="suoxProgressDialog('open')"  ref='moveProgress'>
            <el-progress type="circle" :width="92" :stroke-width="4" :percentage="progress_all" color="#18B270"></el-progress>
            <div class="downprogress_text">已下载: {{download_p_list100.length}}/{{download_p_list.length}}</div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
// import { getData } from "../api/api.js";
import {Dialog, unique,getCookie} from "../api/util.js";
import {downloadStore} from "../api/download_store.js";
import { uploadFile, abortFunc, progressArrFunc } from "../api/uploadFile";
export default {
  data() {
    return {
        //文件（夹）下载
        is_d_progress:false, //下载进度条展示控制 
        is_progress:false, //模块展示控制 
        is_p_suox:false, //控制下载弹框是否缩小显示,
        download_p_list:[], //当前下载列表
        upload_p_list:[], //当前上传列表
        download_p_list100:[], // 下载进度100的列表
        progress_all:0, //总进度展示百分比
        download_store: downloadStore.state,
        moveProgressW:'',
        moveProgressH:'',
        headerActivity:0,
        corpAccId:'',
        empAccId:'',
    };
  },
  mounted() {
        var that = this;
        let userData = localStorage.getItem("user");
        let token = getCookie("token");
        if(token){
            let userDataJson = eval('(' + userData + ')')
         this.corpAccId = userDataJson.corpAccId
         this.empAccId = userDataJson.empAccId
      }else{
          this.$router.push("/login")
      }

        window.onresize = function temp() {
        var clientHeight = `${document.documentElement.clientHeight}`;
        var clientWidth = `${document.documentElement.clientWidth}`;
        var dom = that.$refs.moveProgress     
        var offsetLeft =  dom.offsetLeft;
        var offsetTop = dom.offsetTop;
        if(clientHeight<offsetTop){
            dom.style.top=clientHeight-100+'px';
        }
         if(clientWidth<offsetLeft){
            dom.style.left=clientWidth-100+'px';
        }
    };
  },
  watch:{
      download_store:{
          handler(){
                this.download_p_list = this.download_store.message.download_p_list
                this.download_p_list100 = this.download_store.message.download_p_list.filter(item=>item.progress==100)
                this.progress_all = this.download_store.message.progress_all
                // this.total_speed = this.download_store.message.total_speed
                this.is_d_progress = this.download_store.message.is_d_progress
                this.is_p_suox = this.download_store.message.is_p_suox
                // console.log(JSON.stringify({
                //     'download_p_list':this.download_p_list,
                //     'progress_all':this.progress_all,
                //     'is_d_progress':this.is_d_progress ,
                //     'is_p_suox':this.is_p_suox ,
                // },null,'\t'))
                // console.log(this.total_speed+'KB/s')
                this.upload_p_list = this.download_store.message.upload_p_list;
                this.is_progress = this.download_store.message.is_progress;
                this.headerActivity = this.download_store.message.is_tab_progress;
          },
          deep:true,
          immediate:true
      },
  },
  methods: {
       //关闭下载进度弹框
    suoxProgressDialog(close){
     var store_msg={};
     var fastClick = false;
     var timer = null;
     var _this =this;
    if(close==='open'){
            var dom = this.$refs.moveProgress
            var clentX = event.clientX- dom.offsetLeft;
            var clentY = event.clientY-dom.offsetTop;
            var maxH =document.documentElement.clientHeight || document.body.clientHeight;
                maxH = maxH-100;
            var maxW =document.documentElement.clientWidth|| document.body.clientWidth;
                maxW=maxW-100
         timer =  setTimeout(function(){
                document.onmousemove = function(ev){
            
                var disX = ev.clientX-clentX;
                var disY = ev.clientY - clentY;
                if(disX<=0){
                     dom.style.left=0;
                }else if(disX>=maxW){
                    dom.style.left=maxW+'px';
                }else{
                     dom.style.left=disX+'px';
                }
                if(disY<=0){
                     dom.style.top=0;
                }else if(disY>=maxH){
                    dom.style.top=maxH+'px';
                }else{
                     dom.style.top=disY+'px';
                }
            }
        fastClick=true;
        },300)
        document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
                e.preventDefault;
                if(fastClick){
                
                }else{
                    store_msg = {
                    'is_d_progress':!_this.is_d_progress,
                    'is_p_suox':!_this.is_p_suox
                }
                    clearTimeout(timer)
                downloadStore.setMessageItem(store_msg);
                downloadStore.state.message.is_progress = true
                }
        };

      }else{
          downloadStore.state.message.is_progress = false
    //    store_msg = {
    //        'is_d_progress':!_this.is_d_progress,
    //        'is_p_suox':!_this.is_p_suox
    //     }
    //      downloadStore.setMessageItem(store_msg)
      }
    
    },
     fileType(name){
        let val = name.substr(name.lastIndexOf('.'))
        let  video=new RegExp("\\w*\\.(avi|mpeg|mpg|rmvb|mp4|3gp|mov|flc|flv|asf|vob|ogg|swf|mkv|wmv)$");
        let img=new RegExp("\\w*\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$");
        let doc=new RegExp("\\w*\\.(doc|docx|docm|dotm|dotx|wps|doc|rtf)$");
        let ppt=new RegExp("\\w*\\.(ppt|pptx|pptm|ppsx|ppsm|potx|potm|ppam)$");
        let pdf=new RegExp("\\w*\\.(pdf)$");
        let txt=new RegExp("\\w*\\.(txt)$");
        let zip=new RegExp("\\w*\\.(rar|gz|arj|zip)$");
        let xls=new RegExp("\\w*\\.(csv|xls|xlsx|xlsm|xltx|xltm|xlsb|xlam)$");
        if(video.test(val)) return 'video';
        if(img.test(val))return 'img';
        if(doc.test(val))return 'doc';
        if(ppt.test(val))return 'ppt';
        if(pdf.test(val))return 'pdf';
        if(txt.test(val))return 'txt';
        if(zip.test(val))return 'zip';
        if(xls.test(val))return 'xls';
      },
      //暂停上传
      stopUpload(item,index){
        if(item.type !==1002){
            item.xhr.abort()
            this.download_store.message.upload_p_list[index].type =1002
        }else if(item.type ==1002){
            // return
            this.download_store.message.upload_p_list[index].type  = 0
          uploadFile(item,index, this.empAccId, this.corpAccId, item.parentFileId,item.where,(files,len,progress,isLast,response,chunkSeq) => {
                    // upload-success
                    let responseJson = eval('(' + response + ')');
                    if(responseJson.code == 200){
                        // console.log(files)
                        // console.log(JSON.stringify(that.root_fileTarIds))
                 
                        if( responseJson.data.process==100){
                            downloadStore.state.message.upload_p_list[len].type =1 //上传完成状态

                        }
                        downloadStore.state.message.upload_p_list[len].uploadslices =chunkSeq;
                    }else{
                        if(responseJson.code == 2000){
                            if (document.getElementsByClassName('el-message').length === 0) {
                                Dialog.message('您上传的文件名已被使用（含公司其他账号），请重新命名上传!','error',1500)
                            }
                        }else{
                            Dialog.message(responseJson.message,'error',1500)
                        }
                        // if(isLast == 1){
                        //     that.percentage_num=0;
                        // }
                            event.target.value = ''
                    }
                },(p_arr,len,isLast,response)=>{
                    let responseJson = eval('(' + response + ')');
                    if(responseJson.code == 200){
                        // 文件进度条
                        downloadStore.state.message.upload_p_list[len].progress =p_arr.progress;
                        downloadStore.state.message.upload_p_list[len].uploadSize =p_arr.chunksize
                    }
                },(status,isLast,len)=>{
                    //预请求报错处理
                 
                },(speed,timer,len)=>{
                    //上传文件网速
                    // console.log(speed + " KB/s");
                    downloadStore.state.message.upload_p_list[len].uploadSpeed =speed;
                    downloadStore.state.message.upload_p_list[len].type =2 //上传中状态
                },(xhr,len)=>{
                    downloadStore.state.message.upload_p_list[len].xhr = xhr //保存上传请求用于暂停
                    downloadStore.state.message.upload_p_list[len].type =2 //上传中状态
                })
        }
              
      },
      //删除上传文件
      delUpload(item,index){
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.download_store.message.upload_p_list.splice(index,1);
            item.xhr.abort()
            return
            getData("web/file/batchLogicDelete", data).then(res => {
                if (res.code == 200) {
                    Dialog.message('删除成功!','success',1500)
                    that.now_page=1;
                    let param={
                        'corpAccId':that.corpAccId,
                        'empAccId':that.empAccId,
                        'fileTarId':that.fileTarId,
                        'page':that.now_page,
                        'size':that.page_size
                    }
                    that.ajaxtable(param)
                } else {
                    Dialog.message(res.message,'error',1500)
                }
            });
        }).catch(()=>{

        })
      }
  }
};
</script>

<style lang="scss" scoped>

</style>