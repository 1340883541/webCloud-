<template>
    <div>

        <!-- 进度条 -->
        <div class="download_progress" v-show="is_d_progress">
            <div class="download_p_head"><strong>下载进度</strong>
                <!-- <div class="fr down_p_close" @click.stop="closeProgressDialog"><img src="../assets/icon_delete.png"></div> -->
                <div class="fr down_p_close" @click.stop="suoxProgressDialog('close')">
                    <img v-if="is_d_progress" src="../assets/icon_suox_new.png">
                </div>
            </div>
            <ul class="download_p_ul">
                <li class="download_p_li" v-for="(item,oldindex) in download_p_list" :key="oldindex">
                    <div class="flex-wrap">
                        <div class="download_img_box">
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
                        <div class="download_info_box flex-con">
                            <p class="p0 elipseone">{{item.name}}</p>
                            <p class="p1 elipseone">{{item.sizeFormat}}  {{item.d_speed}}KB/s</p>
                        </div>
                    </div>
                   <el-progress :width="300" :stroke-width="6" :percentage="item.progress" color="#18B270"></el-progress>
                   <div class="download_progress_text" v-if="item.progress != 100">下载中…</div>
                   <div class="download_progress_text" v-if="item.progress == 100">下载完成!</div>
                </li>
            </ul>
            <!-- <el-progress :width="160" :stroke-width="8" :percentage="download_progress" color="#18B270"></el-progress> -->
        </div>
        <div v-show="is_p_suox" class="download_progress_suox"  @mousedown="suoxProgressDialog('open')"  ref='moveProgress'>
            <el-progress type="circle" :width="92" :stroke-width="4" :percentage="progress_all" color="#18B270"></el-progress>
            <div class="downprogress_text">已下载: {{download_p_list100.length}}/{{download_p_list.length}}</div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
// import { getData } from "../api/api.js";
import {Dialog, unique} from "../api/util.js";
import {downloadStore} from "../api/download_store.js";
export default {
  data() {
    return {
        //文件（夹）下载
        is_d_progress:false, //进度条展示控制 
        is_p_suox:false, //控制下载弹框是否缩小显示,
        download_p_list:[], //当前下载列表
        download_p_list100:[], // 下载进度100的列表
        progress_all:0, //总进度展示百分比
        download_store: downloadStore.state,
        moveProgressW:'',
        moveProgressH:'',
    };
  },
  mounted() {
        var that = this;
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
                downloadStore.setMessageItem(store_msg)
                }
        };
      }else{
       store_msg = {
           'is_d_progress':!_this.is_d_progress,
           'is_p_suox':!_this.is_p_suox
        }
         downloadStore.setMessageItem(store_msg)
      }
    
    },
    closeProgressDialog(){
        let store_msg = {
        'is_d_progress':false,
        'is_p_suox':false
      }
      downloadStore.setMessageItem(store_msg)
    },
  }
};
</script>
