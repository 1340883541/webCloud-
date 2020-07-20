<template>
    <div class="container file_group_container" @click.stop="spikLeavelist">
        <div class="file_g_head breadcrumb">
            <div class="header_info fl">
            <span class="curr_title">当前位置：</span>
            <span class="title">二级菜单</span>
            <i>|</i>
            <span class="title" @click.stop="openFileGroupath">文件组</span>
            <i>|</i>
            <span class="title_i">{{fileGroupName}}</span>
          </div>
          <div class="root_h_r fr" style="cursor:pointer" @mouseenter="isRootPopver=true" @mouseleave="isRootPopver=false">
                <img  src="../../assets/icon_help.png"/>
                <div class="root_popover" v-if="isRootPopver">
                    1.群组管理员可新增删除该群组的成员，设置成员是否为管理员，可上传，下载，删除文件。<div style="width:100%;height:14px;"></div>
                    2.群组成员仅可查看和下载该群组共享文件。
                </div>
            </div>
        </div>
        <div class="fileg_d_body">
            <!-- 文件组成员 -->
            <div class="fileg_user_box">
                <!-- 管理员 -->
                <div class="fileg_user_div0 flex-wrap">
                    <div class="fileg_user_div0_left">管理员：</div>
                    <ul class="fileg_user_div0_right flex-con">
                        <li class="fileg_user_item clearfix flex-wrap flex-align-item" style="margin-right:10px;"
                            v-for="(i,idx) in empAccList_admin" :key="idx" v-if="i.authority==1">
                            <div v-if="isRbac && empAccList_admin.length > 1" class="fileg_del_box" @click.stop="spikAdminCancel(i,idx)"></div>
                            <img src="../../assets/icon_wjz_admin.png">{{i.chName}} &nbsp;({{i.username}})
                        </li>
                        <span v-if="!isrelAuthor" style="line-height:34px;">无</span>
                    </ul>
                </div>
                <!-- 组成员 -->
                <div class="fileg_user_div1">
                    <!-- 添加组成员 -->
                    <li v-if="isRbac_add && isRbac" class="fileg_user_item fileg_user_add clearfix flex-wrap flex-align-item" @click.stop="splikAddGroup">
                        <img src="../../assets/icon_xz_add.png">
                        <span>新增组成员</span>
                    </li>
                    <!-- 组成员展示 -->
                    <li class="fileg_user_item clearfix flex-wrap flex-align-item" :class="{'user_active':item.isSelet}"
                        v-for="(item,index) in empAccList" :key="index" @click.stop="spikUserSelet(item,index)">
                        <img src="../../assets/icon_wjz_cy.png">
                        <span>{{item.chName}} &nbsp;({{item.username}})</span>
                        <!-- :class="{'display':isUserCurr==index}" -->
                        <i v-if="isRbac && isRbac_admin" class="fileg_user_select_icon" ></i>
                        <!-- 下拉菜单-->
                        <div class="user_select_box" v-if="isRbac && isRbac_admin && item.isSelet && empAccList.length > 1">
                            <div class="user_select">
                                <!-- :class="{'p_item_curr':item.authority==1}" -->
                                <p v-if="item.authority==1" class="p_item" @click.stop="spikSetAdmin(empAccList,item,0)">取消管理员</p>
                                <p v-if="item.authority==0" class="p_item" @click.stop="spikSetAdmin(empAccList,item,1)">设置为管理员</p>
                                <p class="p_item" @click.stop="spikEmpAccDelete(item)">踢出该组</p>
                            </div>
                        </div>
                    </li>
                    <!-- <li class="fileg_user_item clearfix flex-wrap flex-align-item user_active">
                        <img src="../../assets/icon_wjz_cy.png">
                        <span>黄吟（huanyin)</span>
                        <i class="fileg_user_select_icon"></i>
                        下拉菜单
                        <div class="user_select">
                            <p class="p_item ">设置为管理员</p>
                            <p class="p_item p_item_curr">踢出该组</p>
                        </div>
                    </li> -->
                </div>
            </div>
            <!--  表格 -->
            <div class="fileg_table_box">
                <!--  表格标题头部 -->
                <el-col :span="24">
                    <div class="table_head_box">
                        <div class="table_tit">文件组的文件信息</div>
                        <div class="table_btn_box clearfix">
                            <div class="file_h_item" v-if="isRbac_upload && isRbac">
                                <el-dropdown placement="bottom-start" trigger="click" v-if="isuploadWjj">
                                    <el-button type="primary" size="mini">
                                        <img src="../../assets/icon_up.png">上传
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="handleUploadWj">上传文件</el-dropdown-item>
                                        <el-dropdown-item @click.native="handleUploadWjjia">上传文件夹</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                              <el-button type="primary" size="mini" @click.native="handleUploadWj" v-else>
                              <img src="../../assets/icon_up.png">上传
                            </el-button>
                            </div>
                            <div class="file_h_item">
                                <el-button class="color-green" size="mini" @click.stop="handledownloadWjHead">
                                    <img src="../../assets/icon_plxz.png">批量下载
                                </el-button>
                            </div>
                            <div class="file_h_item" v-if="isRbac_del && isRbac">
                                <el-button class="color-green" size="mini" @click="handleDeleteWjHead">
                                    <img src="../../assets/icon_plsc.png">批量删除
                                </el-button>
                            </div>
                            <div class="file_h_right fr" style="margin-top:15px;width:300px;">
                                <el-input placeholder="请输入搜索文件名" class="input-with-select input-search" size="small" 
                                    v-model.trim="keywords" @keyup.enter.native="spikSearchkey">
                                    <el-button slot="append" @click="spikSearchkey"><img style="vertical-align: middle;" src="../../assets/icon_search.png"></el-button>
                                </el-input>
                            </div>
                        </div>
                        <!-- 文件组所有文件面包屑 -->
                        <div class="file-h-p0">
                            <el-breadcrumb separator-class="el-icon-arrow-right">
                                <el-breadcrumb-item @click.native="handleAllFilebreadb" style="cursor:pointer;">全部文件</el-breadcrumb-item>
                                <el-breadcrumb-item style="cursor:pointer;"
                                    v-if="breadcrumbtitList" v-for="(item,index) in breadcrumbtitList"
                                    :key="index"
                                    @click.native="handleItemFilebreadb(item.fileTarId,index)">
                                    {{item.fileName}}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                        </div>
                        <div class="file-h-p1">已加载{{tableData.length}}个，共{{totalCount}}个文件</div>
                    </div>
                </el-col>
                
                <!-- 表格列表 -->
                <el-col v-if="isShowtable" :span="24" v-loading="isloadlist" :element-loading-text="loadlistTxt" element-loading-background="rgba(255, 255, 255, 0.7)">
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%"
                        :select-on-indeterminate="true"
                        :header-cell-style="{background:'#fff',fontSize:'14px',color:'#666',fontWeight:'400',padding:' 8px 0'}"
                        @selection-change="handleCheckChange"
                        >
                        <el-table-column type="selection" width="55" label="全选"></el-table-column>
                        <el-table-column label="文件名" min-width="200">
                            <template slot-scope="scope">
                                <div class="flex-wrap flex-con">
                                    <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                                    <img class="filename_icon fl" v-if="scope.row.type == 0" src="../../assets/type/wjj_small.png" 
                                        style="cursor: pointer" @click="dblclickFileRow(scope.row)">
                                    <!-- 文档 -->
                                    <img style="cursor: pointer" @click="dblclickFileRow(scope.row)" class="filename_icon fl" v-if="scope.row.suffix=='.doc'||scope.row.suffix=='.docx'||scope.row.suffix=='.docm'||
                                      scope.row.suffix=='.dotm'||scope.row.suffix=='.dotx'||scope.row.suffix=='.wps'||scope.row.suffix=='.doc'||
                                      scope.row.suffix=='.rtf'" src="../../assets/type/doc-small.png">
                                    <img style="cursor: pointer" @click="dblclickFileRow(scope.row)" class="filename_icon fl" v-if="scope.row.suffix=='.ppt'||scope.row.suffix=='.pptx'||scope.row.suffix=='.pptm'||
                                      scope.row.suffix=='.ppsx'||scope.row.suffix=='.ppsm'||scope.row.suffix=='.potx'||scope.row.suffix=='.potm'||
                                      scope.row.suffix=='.ppam'" src="../../assets/type/ppt-small.png">
                                    <img style="cursor: pointer" @click="dblclickFileRow(scope.row)" class="filename_icon fl" v-if="scope.row.suffix=='.pdf'" src="../../assets/type/PDF-small.png">
                                    <img style="cursor: pointer" @click="dblclickFileRow(scope.row)" class="filename_icon fl" v-if="scope.row.suffix=='.txt'" src="../../assets/type/txt-small.png">
                                    <img style="cursor: pointer" @click="dblclickFileRow(scope.row)" class="filename_icon fl" v-if="scope.row.suffix=='.rar'||scope.row.suffix=='.gz'||scope.row.suffix=='.arj'||
                                      scope.row.suffix=='.zip'" src="../../assets/type/rar-small.png">
                                    <img style="cursor: pointer" @click="dblclickFileRow(scope.row)" class="filename_icon fl" v-if="scope.row.suffix=='.csv'||scope.row.suffix=='.xls'||scope.row.suffix=='.xlsx'||scope.row.suffix=='.xlsm'||scope.row.suffix=='.xltx'||
                                      scope.row.suffix=='.xltm'||scope.row.suffix=='.xlsb'||scope.row.suffix=='.xlam'" src="../../assets/type/xls-small.png">
                                    <!--图片 -->
                                    <img class="filename_icon fl" v-if="scope.row.type == 2" style="cursor: pointer" @click="dblclickFileRow(scope.row)" src="../../assets/type/JPG-small.png">
                                    <!-- 音乐视频 -->
                                    <img class="filename_icon fl" v-if="scope.row.type == 3 || scope.row.type == 4" @click="dblclickFileRow(scope.row)" src="../../assets/type/MP3-small.png">
                                   <!-- 其它 -->
                                <img class="filename_icon fl" v-if="scope.row.type == 5" src="../../assets/type/other-small.png">

                                    <span class="table_filename elipseone" :title="scope.row.fileName" @click="dblclickFileRow(scope.row)">{{ scope.row.fileName }}</span>
                                    <img style="cursor:pointer;" v-if="scope.row.soleSet == 1" src="../../assets/icon_wjroot.png">
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="sizeFormat" :formatter="sizeFormatFormatter" label="文件大小" width="120"></el-table-column>
                        <el-table-column prop="lastModifiedDate" label="更新时间" width="200"></el-table-column>
                        <el-table-column prop="modifier" :formatter="modifierFormatter" label="更新人" width="150"></el-table-column>
                        <el-table-column prop="description" :formatter="descriptionFormatter" label="备注" min-width="120"></el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <div class="table_cz_icon" @click.stop="handledownloadWj(scope.row)"><img src="../../assets/icon_xz.png"></div>
                                <div v-if="isRbac_del && scope.row.authority == 1" class="table_cz_icon" @click.stop="handleDeleteWj(scope.row.fileTarId)"><img src="../../assets/icon_wj_del.png"></div>
                            </template>
                        </el-table-column>
                        <!-- <el-row slot="append" style="text-align:center; line-height:46px;" v-if="total_page > 1">
                            <a href="javascript:;" class="blue01" style="font-size:12px;" @click.stop="appendTable" :loading="table_loading">{{page_txt}}</a>
                        </el-row> -->
                    </el-table>
                    <div>
                        <el-pagination
                            background
                            layout="prev, pager, next, total"
                            :total="totalCount"
                            :page-size="page_size"
                            @current-change="handleCurrentPageChange">
                        </el-pagination>
                    </div>
                </el-col>
            </div>
        </div>
        <!-- 新增组成员弹框 -->
        <el-dialog
            class="wjroot_dialog"
            title="新增组成员"
            :visible.sync="isUserAdddialog"
            width="50%"
            :close-on-click-modal="false"
            :before-close="handleUserAddClose">
            <div class="root_center">
                <!-- 新增组成员div  -->
                <div class="root_c_div1">
                    <div class="root_div1_bottom flex-wrap">
                        <div class="root_tree_left flex-con">
                            <div class="root_input_box">
                                <el-input placeholder="请输入搜索的成员（姓名或账号）" class="input-with-select input-search" size="small" 
                                    v-model.trim="user_keywords" @keyup.enter.native="enterSearchUser" suffix-icon="el-icon-search">
                                </el-input>
                                <span class="search_btn" @click.stop="spikSearchUser"></span>
                            </div>
                            <div class="root_tree_info">
                                <div class="el-dropdown-link root_tree_company">
                                    <i class="el-icon-arrow-down el-icon-caret-bottom" style="font-size:16px;"></i>
                                    {{corpName}}
                                </div>
                                <div class="root_tree">
                                    <div class="root_tree_li flex-wrap" v-for="(i,index) in user_allBlist" :key="index" :class="{'user_tree_li_active':i.isChecked}">
                                        <div class="root_t_li_left flex-con flex-wrap flex-align-item" @click.stop="handleCheckUserItem(i,index)">
                                            <i class="checkbox_model" :class="{'checkbox_model_active':i.isChecked}"></i>
                                            <p class="w-elli" style="width:16vw;">{{i.chName}}({{i.username}})</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="root_tree_right flex-con">
                            <div class="root_tree_r_box">
                                <div class="tree_r_text" v-if="user_relList.length>0">已选择{{user_relList.length}}个人员</div>
                                <ul class="root_c_div0 tree_r_ul">
                                    <li class="root_div0_li tree_r_li flex-wrap" v-for="(item,index) in user_relList" :key="index">
                                        <div class="li_left flex-con flex-wrap flex-align-item">
                                            <i></i>
                                            <span style="width:16vw;" class="p1 w-elli">{{item.chName}} ({{item.username}})</span>
                                        </div>
                                        <div class="li_right">
                                            <a @click.stop="handleDeleteRelist(item,index)">删除</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click.stop="handleUserAddClose">取 消</el-button>
                <el-button size="small" type="primary" @click.stop="handleSaveUserComfrim" :loading="user_loading">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 文件（夹）上传 -->
        <el-dialog
            class="wjroot_dialog wjload_dialog"
            title="上传文件（夹）"
            :visible.sync="isUpfileWjdialog"
            width="50%"
            :close-on-click-modal="false"
            :before-close="handleUploadWjClose">
            <div class="root_head clearfix">
                <div class="upload_item flex-wrap">
                    <div class="upload-left-lable">
                        <span>上传文件：</span>
                    </div>
                    <div class="upload-right flex-con">
                        <div class="">
                            <!-- <input title="浏览" id="h5Input2" multiple="" webkitdirectory=""
                            accept="*/*" type="file" name="html5uploader"
                            @change="handleuploadWj" ref="uploadInputer"> -->
                            <button @click="fileClick">浏览</button>
                            <label ref="upload" style="position: relative;">
                                <input v-if="is_upload_wj == 1" type="file" accept="*/*" multiple=""
                                    @change="selectFile"
                                    style="position: absolute; width: 1px; height: 1px; opacity: 0; z-index: -1;">
                                <input v-if="is_upload_wj == 0" type="file" accept="*/*" multiple="" webkitdirectory=""
                                    @change="selectFile"
                                    style="position: absolute; width: 1px; height: 1px; opacity: 0; z-index: -1;">
                            </label>
                            <span class="upload_tips">支持docx，xls，jpg等类型的文件</span>
                        </div>
                       <div class="cleafix" style="width:100%;margin-top:5px;">
                           <el-progress :percentage="percentage_num" v-if="percentage_num > 0 && percentage_num <= 100" ></el-progress>
                             <div v-show="isuploadmsg" class="fl upload_speed">正在准备上传文件，请稍等...</div>
                           <div v-if="percentage_num > 0 && percentage_num <= 100 && !isuploadmsg" class="fl upload_numdiv">已上传文件: {{files_all.length}}/{{files_all_length}}</div>
                           <div v-if="percentage_num > 0 && percentage_num <= 100 && !isuploadmsg" class="fl upload_speed">当前速度: {{upload_speed}}</div>
                           <!-- <div v-if="percentage_num > 0 && percentage_num <= 100" class="fl upload_speed">上传中,上传速度监控正在开发中</div> -->
                           <ul class="upload_ul">
                               <li class="flex-wrap flex-align-item flex-hh-not" v-for="(item,index) in files_all" :key="index"
                                @mouseenter="spikEnterUploadli(index)" @mouseleave="spikLeaveUploadli">
                                   <p class="flex-con"><img class="fl" src="../../assets/icon_attached.png"> <span class="elipseone">{{item.name}}</span></p> 
                                   <i class="upload_wj_suc" :class="{'upload_wj_del':currUplaodli==index}" @click="spikUploadDel(item,index)"></i>
                                </li>
                           </ul>
                       </div>
                    </div>
                </div>
                <div class="upload_item flex-wrap">
                    <div class="upload-left-lable">
                        <span>备注：</span>
                    </div>
                    <div class="upload-right flex-con">
                        <textarea class="upload-r-textarea" name="" id="" cols="30" rows="10" maxlength="100" v-model="upload_description"></textarea>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleUploadWjClose">取 消</el-button>
                <el-button v-if="files_all.length <= 0" size="small" type="primary" disabled>保存</el-button>
                <el-button v-if="files_all.length > 0 && files_all.length != files_all_length" size="small" type="primary" disabled>文件上传中</el-button>
                <el-button v-if="files_all.length > 0 && files_all.length == files_all_length" size="small" type="primary" @click="handleSaveUploadComfrim" :loading="upload_loading">保 存</el-button>
            </span>
        </el-dialog>

        <!-- 下载文件进度列表 -->
        <file-progress></file-progress>
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
    </div>
</template>
<script>
import axios from "axios";
import { getData } from "../../api/api.js";
import {downloadStore} from "../../api/download_store.js";
import fileprogress from '../../components/file_progress'
import {Dialog, unique,myBrowser,getCookie,api} from "../../api/util.js";
import { construct, destruct } from "@aximario/json-tree";
import { uploadFile, abortFunc, progressArrFunc } from "../../api/uploadFile";
import SparkMD5 from "spark-md5";
export default {
  components:{
        'file-progress':fileprogress
    },
  data() {
    return {
      //子功能操作权限
      isRbac: false,
      //数据参数
      keywords:'',
      corpAccId: null,
      empAccId: null,
      fileGroupTarId: 0,
      fileGroupName: "",
      fileTarId: null,
      parentFileId: null,
      parentFileName: "",
      fileType: null,
      now_page: 1,
      page_size: 10,
      total_page: 1,
      totalCount: 1,
      page_txt: "加载更多",
      isHaveLoadMore: true,
      isRootPopver:false,
      //面包屑
      breadcrumbtitList: [],
      //表格
      isloadlist: true,
      loadlistTxt:'',
      isShowtable: true,
      tableData: [],
      multipleSelection: [],
      table_loading: true,
      //在该组下的管理员、成员数据
      empAccList: [],
      empAccList_admin: [], //管理员
      isUserCurr: null,
      isrelAuthor: false,
      //新增组成员弹框
      isUserAdddialog: false,
      user_loading: false,
      user_keywords: "",
      corpName: "", //权限公司
      user_allBlist: [], //不在该组下的管理员、成员数据
      user_relList: [], //展示前台选中的成员
      user_relListJson: [], //传后台选中的成员
      //文件（夹）上传
      is_upload_wj: 1, //1文件类型 0 文件夹
      isUpfileWjdialog: false,
      upload_loading: false,
      percentage_num: 0,
      upload_speed:0, //上传文件网速 kb/s
      files_all: [],
      files_all_length:0,
      filesize_all:0,//文件（多个/单个）总大小
      chunksize_all:0,//文件（多个/单个）分块总大小
      upload_fileTarIds: [],
      upload_description: "",
      currUplaodli: null,
      //删除列表中文件（夹）
      d_fileTarId: [],
      //文件（夹）下载
      download_fileTarIds:[], //传后台数据
      download_fileTarId:'',
      download_progress_all:[], //总进度
      download_filetype:'', //文件类型
      download_filesuffix:'', //文件后缀名
      download_filesize:0, // 文件大小 MB
      download_filesizeFormat:0, //文件大小 KB
      download_filename:'', //下载文件名
      is_d_progress:false, //进度条展示控制
      download_progress_list:[], //下载列表
      download_p_list:[], //下载列表
      is_p_suox:false, //控制下载弹框是否缩小显示，
      //菜单资源权限
      isRbac_add: false, //新增文件组组员
      isRbac_delete: false, //踢出
      isRbac_admin: false, //设置为管理员\取消
      isRbac_upload: false, //上传
      isRbac_down: false, //下载
      isRbac_del: false, //删除
      //图片预览
      viewer_imgs:[],
      //视频预览
      playerOptions:[],
      viewVideo:false,
      coverHidden:false,
      //Safari等部分浏览器无上传文件夹
      isuploadWjj:true,
      isuploadmsg:false,//上传文件msg
      srcView:'',
      uploadXhr :[],
      timer:''
    };
  },
  mounted() {
    let userData = localStorage.getItem("user");
    let token = getCookie("token"); 
    if (token) {
      let userDataJson = eval("(" + userData + ")");
      //   console.log(userDataJson.corpAccId)
      //   console.log(userDataJson.empAccId)
      this.corpAccId = userDataJson.corpAccId;
      this.empAccId = userDataJson.empAccId;
      this.getrbacData();
    } else {
      this.$router.push("/login");
    }
     if(myBrowser()=='Safari'){
         this.isuploadWjj = false
      }else{
         this.isuploadWjj = true 
      }
      // console.log(myBrowser())
  },
  methods: {
    //菜单资源权限
    //菜单\功能\子功能操作权限
    getrbacData() {
      let that = this;
      getData("open/api/res/findResByEmpAcc", {
        empAccId: this.empAccId
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
                  if (val.routePath == "/file_group") {
                    //功能操作
                    if (val.children && val.children.length > 0) {
                      // console.log(JSON.stringify(val.children, null, "\t"))
                      val.children.map((value, index) => {
                        if (value.resType == "FUNC") {
                          switch (value.accessPath) {
                            case "/web/file/preUpload":
                              that.isRbac_upload = true;
                              break;
                            case "/web/fileGroup/view/fileDelete":
                              that.isRbac_del = true;
                              break;
                            case "/web/fileGroup/empAccInsert":
                              that.isRbac_add = true;
                              break;
                            case "/web/fileGroup/empAccAuthority":
                              that.isRbac_admin = true;
                              break;
                          }
                        }
                      });
                    }
                  }
                });
              }
            });
          }
          if (that.$route.params.id) {
            that.fileGroupTarId = that.$route.params.id;
            that.fileGroupName = that.$route.params.name;
            that.initEmpAccList();
            that.initExceptEmpAccList();
            that.inittable();
          }
        }
      })
    },
    //返回文件组
    openFileGroupath() {
      this.$router.push({ path: "/file_group" });
    },
    //加载在该组下的管理员、成员数据
    initEmpAccList() {
      let that = this;
      this.empAccList_admin = [];
      getData("web/fileGroup/view/empAccList", {
        'corpAccId': this.corpAccId,
        'fileGroupTarId': Number(this.fileGroupTarId)
      }).then(res => {
        if (res.code == 200) {
          // that.empAccList = res.data || []
          if (res.data.length > 0) {
            that.empAccList = res.data.map(function(v, i) {
              that.$set(v, "isSelet", false);
              if (v.authority == 1) {
                that.isrelAuthor = true;
                that.empAccList_admin.push(v);
              }
              if (v.empAccId == that.empAccId && v.authority == 1) {
                that.isRbac = true;
              }
              return v;
            });
          } else {
            that.empAccList = [];
            that.empAccList_admin = [];
          }
        }
      });
    },
    //加载不在该组下的管理员、成员数据
    initExceptEmpAccList() {
      let that = this;
      getData("web/fileGroup/view/exceptEmpAccList", {
        'corpAccId': this.corpAccId,
        'fileGroupTarId': Number(this.fileGroupTarId),
        'chNameOrUsername': this.user_keywords
      }).then(res => {
        if (res.code == 200) {
          that.corpName = res.data.corpName || "";
          if (res.data.empAccList.length > 0) {
            that.user_allBlist = res.data.empAccList.map(function(v, i) {
              that.$set(v, "isChecked", false);
              if(that.is_searchUser == 1){
                  //搜索成员信息处理
                  if(that.user_relList.length > 0){
                      that.user_relList.forEach((val,index)=>{
                          if(val.empAccId == v.empAccId){
                            that.$set(v, 'isChecked', true)
                          }
                      })
                  }
              }
              return v;
            });
          } else {
            that.user_allBlist = [];
          }
        }
      });
    },
    //设置管理员、成员操作
    //鼠标移入
    spikEnterlist(index) {
      this.isUserCurr = index;
    },
    //鼠标移出
    spikLeavelist(index) {
      this.isUserCurr = null;
      this.empAccList = this.empAccList.map(function(v, i) {
        v.isSelet = false;
        return v;
      });
    },
    //下拉设置管理员（取消/设置/踢出）
    spikUserSelet(item, index) {
      // console.log(this.empAccList_admin.length)
      this.empAccList = this.empAccList.map(function(v, i) {
        v.isSelet = false;
        return v;
      });
      if(this.empAccList_admin.length >= 2){
        this.empAccList[index].isSelet = !this.empAccList[index].isSelet;
      }else{
        //管理员只剩下一个时，禁止退出、取消管理员
        if(item.empAccId == this.empAccList_admin[0].empAccId){
          this.empAccList[index].isSelet = false
        }else{
          this.empAccList[index].isSelet = !this.empAccList[index].isSelet;
        }
      }
      
    },
    //设置管理员
    spikSetAdmin(list, item, authority) {
      let that = this,
        param = {
          'fileGroupTarId': Number(this.fileGroupTarId),
          'yourEmpAccId': this.empAccId,
          'empAccId': item.empAccId,
          'authority': authority
        };
      if (item.empAccId == this.empAccId && authority == 0) {
        this.isRbac = false;
      }
      this.ajaxEmpAccAuthority(param);
    },
    ajaxEmpAccAuthority(param) {
      let that = this;
      getData("web/fileGroup/empAccAuthority", param).then(res => {
        if (res.code == 200) {
          if (param.authority == 1) {
            Dialog.message('设置成功!','success',1500)
          } else if (param.authority == 0) {
            Dialog.message('取消设置成功!','success',1500)
          }
          that.initEmpAccList();
        } else {
          Dialog.message(res.message,'error',1500)
        }
      });
    },
    //取消设置管理员
    spikAdminCancel(item, index) {
      this.empAccList[index].authority = !this.empAccList[index].authority;
      let param = {
        'fileGroupTarId': Number(this.fileGroupTarId),
        'yourEmpAccId': this.empAccId,
        'empAccId': item.empAccId,
        'authority': 0
      };
      if (item.empAccId == this.empAccId) {
        this.isRbac = false;
      }
      this.ajaxEmpAccAuthority(param);
    },
    //删除(踢出)组员
    spikEmpAccDelete(item) {
      let that = this;
      getData("web/fileGroup/empAccDelete", {
        'fileGroupTarId': Number(this.fileGroupTarId),
        'yourEmpAccId': this.empAccId,
        'empAccId': item.empAccId
      }).then(res => {
        if (res.code == 200) {
          Dialog.message('踢出组员成功!','success',1500)
          that.initEmpAccList();
        } else {
          Dialog.message(res.message,'error',1500)
        }
      });
    },
    //新增成员组
    //打开
    splikAddGroup() {
      this.initExceptEmpAccList();
      this.user_relList=[]
      this.user_relListJson=[]
      this.is_searchUser=0;
      this.user_keywords='';
      this.isUserAdddialog = true;
    },
    //关闭
    handleUserAddClose() {
      this.isUserAdddialog = false;
      this.$refs.multipleTable.clearSelection()
    },
    //搜索成员
    enterSearchUser() {
      this.is_searchUser = 1;
      this.initExceptEmpAccList();
    },
    spikSearchUser() {
      this.is_searchUser = 1;
      this.initExceptEmpAccList();
    },
    //选择组成员
    handleCheckUserItem(item, index) {
      let that = this,
        ids = [];
      this.user_allBlist[index].isChecked = !this.user_allBlist[index].isChecked;
      if (this.user_allBlist[index].isChecked) {
        this.user_relList.push(item);
      } else {
        this.user_relList.map(function(v, i) {
          if (v.empAccId == item.empAccId) {
            if (i > -1) {
              that.user_relList.splice(i, 1);
            }
          }
        });
      }
      this.user_relList.map(item => {
        ids.push(item.empAccId);
      });
      this.user_relListJson = ids;
      // console.log(JSON.stringify(this.user_relList,null,'\t'))
      // console.log(JSON.stringify(this.user_relListJson,null,'\t'))
    },
    //删除选中的组成员
    handleDeleteRelist(item, index) {
      this.user_relList.splice(index, 1);
      this.user_relListJson.splice(index, 1);
      this.user_allBlist.forEach(function(v, i) {
        if(item.empAccId == v.empAccId){
          v.isChecked = false
        }
        return v;
      });
    },
    //保存提交组成员
    handleSaveUserComfrim() {
      let that = this;
      if (this.user_relListJson.length > 0) {
        let param = {
          'empAccIds': this.user_relListJson,
          'fileGroupTarId': Number(this.fileGroupTarId),
          'yourEmpAccId': this.empAccId
        };
        this.user_loading = true;
        getData("web/fileGroup/empAccInsert", param).then(res => {
          if (res.code == 200) {
            Dialog.message('新增组成员成功!','success',1500)
            that.initEmpAccList();
          } else {
            Dialog.message(res.message,'error',1500)
          }
          that.isUserAdddialog = false;
          setTimeout(() => {
            that.user_loading = false;
          }, 3000);
        });
      } else {
        Dialog.message('请选择组成员!','error',1500)
      }
    },
    //表格
    //加载表格数据
    inittable(isLoadMore) {
      isLoadMore =
        typeof isLoadMore === "undefined" || isLoadMore == false ? false : true;
      let that = this;
      this.isloadlist = true;
      getData("web/fileGroup/view/fileList", {
        'corpAccId': this.corpAccId,
        'empAccId': this.empAccId,
        'fileGroupTarId': Number(this.fileGroupTarId),
        'fileTarId': this.fileTarId,
        'fileName':this.keywords,
        'page': this.now_page,
        'size': this.page_size
      }).then(res => {
        that.isloadlist = false;
        that.table_loading = false;
        if (res.code == 200) {
          let data = res.data.map(function(v, i) {
            that.$set(v, "isChecked", false);
            return v;
          });
          if (!isLoadMore) {
            that.tableData = data || [];
          } else {
            that.tableData = that.tableData.concat(data);
          }
          that.total_page = res.pages < 1 ? 1 : res.pages;
          that.now_page = res.currentPage < 1 ? 1 : res.currentPage;
          that.totalCount = res.totalCount;
          if (that.now_page >= that.total_page) {
            that.table_loading = false;
            that.page_txt = "";
          } else {
            that.table_loading = false;
            that.page_txt = "加载更多";
          }
          that.parentFileId = res.parentFileId;
          that.parentFileName = res.parentFileName;
        } else {
          Dialog.message(res.message,'error',1500)
        }
      });
    },
    //分页
    handleCurrentPageChange(val) {
      this.now_page = val;
      this.inittable();
    },
    //表格初始化
    //搜索
    //触发搜索
    spikSearchkey(){
      this.now_page=1;
      this.inittable()
    },
    //多选
    handleCheckChange(evArr) {
      const ids = [];
      evArr.map(item => {
        ids.push(item.fileTarId);
      });
      this.download_fileTarIds = ids;
      this.d_fileTarId=ids;
    },
    sizeFormatFormatter(row, column) {
      return row.sizeFormat ? row.sizeFormat : "-";
    },
    descriptionFormatter(row, column) {
      return row.description ? row.description : "-";
    },
    modifierFormatter(row, column) {
      return row.modifier ? row.modifier : "-";
    },
    //单击文件(夹)
    dblclickFileRow(row) {
      // console.log(row)
      if (row.type == 0) {
        this.breadcrumbtitList.push(row)
        this.breadcrumbtitList = unique(this.breadcrumbtitList)
        this.fileTarId = row.fileTarId;
        this.now_page = 1;
        this.fileType = row.type;
        this.inittable();
      }
      if(row.type == 2){
        this.viewer_imgs = [axios.defaults.baseURL+'upload'+encodeURI(row.localUrl)]
        this.$viewerFuj.show();
      }
      //文档
      if(row.type == 1){
        this.isloadlist=true
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
                this.isloadlist=false
                this.loadlistTxt=''
            }, 2000);
        });
    },
    //某个单元格被点击
    cellClickFile(row) {
    },
    //面包屑
    handleAllFilebreadb() {
      this.breadcrumbtitList = [];
      this.now_page = 1;
      this.fileTarId = null;
      this.keywords='';
      this.inittable();
    },
    handleItemFilebreadb(fileTarId, index) {
      let that = this,
        num = index + 1;
      this.breadcrumbtitList.splice(num, this.breadcrumbtitList.length - num);
      // console.log(JSON.stringify(this.breadcrumbtitList,null,'\t'))
      this.fileTarId = fileTarId;
      this.now_page = 1;
      this.keywords='';
      this.inittable();
    },
    //文件（夹）下载
    //批量下载
    handledownloadWjHead(){
        if(this.download_fileTarIds.length > 0){
            // this.is_d_progress=true
            // this.is_p_suox=false
            this.preDownloadWj()
        }else{
            Dialog.message('请选择下载的文件/文件夹!','error',1500)
        }
    },

    //单个下载
    handledownloadWj(row){
        let that = this;
        this.download_fileTarIds = [];
        this.download_fileTarIds.push( row.fileTarId)
        this.download_fileTarId = row.fileTarId;
        // this.is_d_progress=true;
        // this.is_p_suox=false
        this.preDownloadWj()
    },
    //预下载
    preDownloadWj(){
        let that = this
        getData("/open/api/file/preDownload", {
            'empAccId':this.empAccId,
            'fileTarIds':this.download_fileTarIds
        }).then(res => {
            if (res.code == 200) {
                that.download_filetype =res.data.type
                that.download_filesuffix =res.data.suffix
                that.download_filesizeFormat = res.data.sizeFormat
                that.download_filesize = Number(res.data.size)
                that.download_filename = res.data.fileName
                let row = res.data
                that.is_d_progress=true
                that.is_p_suox=false
                
                if(that.download_progress_list.length > 0){
                    var ret2 = that.download_progress_list.findIndex((v) => {
                        return v.name == row.fileName;
                    })
                    if(ret2 <= -1){
                        // 当返回-1时，则说明objArr中没有
                        that.ajaxDownloadWj(row)
                    }else{
                        let f_name = encodeURI(row.fileName)
                        let ajaxUrl = axios.defaults.baseURL+'web/file/download?empAccId='+that.empAccId+'&fileTarIds='+that.download_fileTarIds+'&fileName='+f_name;
                        //window open下载
                        window.location.href=ajaxUrl;
                    }
                }else{
                    that.ajaxDownloadWj(row)
                }
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
        let ajaxUrl = axios.defaults.baseURL+'web/file/download?empAccId='+this.empAccId+'&fileTarIds='+this.download_fileTarIds+'&fileName='+f_name;
        let startTime, endTime, fileSize, d_currt=0; // 下载文件网速
        var xhr = new XMLHttpRequest();
        
        //window open下载
        window.location.href=ajaxUrl;

        xhr.open('GET', ajaxUrl);
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
                if(row.fileName == v.name){
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


                //判断下载文件浏览器已经操作下载，但进度条未到100%，执行处理
                let p_list = that.download_p_list.map((item,index)=>{
                  if(item.progress < 100){
                    item.progress = 100
                  }
                  return item
                })
                let store_msg={
                  'download_p_list':p_list
                }
                downloadStore.setMessageAction(store_msg)
            }
        }
        xhr.send();
    },
    //文件（夹）上传
    //关闭
    handleUploadWjClose() {
         if(this.files_all_length>0){
            this.$confirm('您确认要取消正在上传的文件么?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
                for(let i =0;i< this.uploadXhr.length;i++){
                    this.uploadXhr[i].abort()
                }
                //  console.log( this.uploadXhr)
                  this.uploadXhr=[];
                this.timer = null;
                abortFunc(1)
                this.isUpfileWjdialog = false;
                this.percentage_num = 0
                this.files_all=[]
                this.$refs.multipleTable.clearSelection()
                let that = this;
                this.files_all_length = 0
                let folderMd5=downloadStore.state.message.folderMd5;
                if(this.upload_fileTarIds.length>0){
                  getData("/web/file/uploadCancel", {
                      'fileTarIds':this.upload_fileTarIds,
                      'folderMd5':folderMd5
                  }).then(res => {
                      if (res.code == 200) {
                          that.upload_fileTarIds=[]
                      }
                  })
                }
              }).catch(() => {
                  
          });
         }else{
              abortFunc(1)
              this.isUpfileWjdialog = false;
              this.percentage_num = 0
              this.files_all=[]
              this.$refs.multipleTable.clearSelection()
              let that = this;
                this.files_all_length = 0
              let folderMd5=downloadStore.state.message.folderMd5;
              if(this.upload_fileTarIds.length>0){
                getData("/web/file/uploadCancel", {
                    'fileTarIds':this.upload_fileTarIds,
                    'folderMd5':folderMd5
                }).then(res => {
                    if (res.code == 200) {
                        that.upload_fileTarIds=[]
                    }
                })
              }
         }

    },
    //文件上传
    handleUploadWj() {
      this.is_upload_wj = 1;
      this.isUpfileWjdialog = true;
      this.percentage_num = 0
      this.files_all = [];
      abortFunc(0)
      progressArrFunc([])
      this.upload_fileTarIds = [];
      this.upload_description = "";
      this.isuploadmsg=false;
    },
    //文件夹上传
    handleUploadWjjia() {
      this.is_upload_wj = 0;
      this.isUpfileWjdialog = true;
      this.percentage_num = 0
      this.files_all = [];
      abortFunc(0)
      progressArrFunc([])
      this.upload_fileTarIds = [];
      this.upload_description = "";
      this.isuploadmsg=false;
    },
    // 导出进度条随机数
    sum: function(m, n) {
      let num = Math.floor(Math.random() * (m - n) + n);
      return num;
    },
    //触发上传选择文件（夹）
    fileClick() {
      // 模拟点击file input触发选择文件，注意：不能在任何方式的回调里面执行此语句
      this.$refs.upload.click();
      this.upload_speed=0
      this.percentage_num=0
      this.files_all_length=this.files_all.length
    },
    selectFile(event) {
      // console.log(event.target.files);
      // name: "database-cas1.jar"
      // size: 138822705
      // type: ""
      // webkitRelativePath: "大文件/database-cas1.jar"
      let that = this; // 1G;
      //文件夹上传验证重名接口
      if(this.is_upload_wj == 0){
          this.percentage_num = 1
          getData("/web/file/folderValidate", {
              "empAccId": this.empAccId,
              "corpAccId": this.corpAccId,
              "folderId": this.parentFileId,
              "fileGroupTarId":this.fileGroupTarId,
              "path": event.target.files[0].webkitRelativePath,
          }).then(res => {
              if (res.code == 200) {
                that.isUploadFunc(event)
              }else{
                 that.isuploadmsg=false;
                Dialog.message(res.message,'error',2000)
                that.percentage_num = 0
                event.target.value = ''
              }
          })
      }else{
          this.isUploadFunc(event)
      }
      // 重置file input控件的值
      // event.target.value = "";
    },
    //文件（夹）上传前期准备
    isUploadFunc(event){
        let that = this,totalSize = 0, g_size = 5368709120, z_size=1073741824 // 1G;
        let reg = new RegExp("\\w*\\.(avi|mpeg|mpg|rmvb|mp4|3gp|mov|flc|flv|asf|vob|ogg|swf|mkv|wmv)$")
        that.isuploadmsg=true;
        let breakDomain = false;
        let typeList =[];
        let domain = new RegExp(api.domain);
        for (let i = 0; i < event.target.files.length; i++) {
            let name = event.target.files[i].name;
              if(domain.test(name)){
                  Dialog.message('上传的文件名'+name+'不符合规范!','error',2000);
                  breakDomain = true;
                 break;
             }
            if(!typeList.some((item)=>{
                 return item ==true
             })){
                 typeList.push(reg.test(name))
             }
            totalSize=totalSize+event.target.files[i].size;
        }
        if(breakDomain){
            that.isuploadmsg = false;
            that.percentage_num = 0;
             event.target.value = ''
            return;
        }
        // console.log(totalSize)
        // console.log(g_size+'---g_size----')
        let isVideo =typeList.some((item)=>{
                 return item ==true
          }) 
        if(totalSize < z_size){
         if(isVideo){
             that.$confirm('视频文件建议MP4格式。如其他格式则将自动进行转码可能会存在画面失真情况。', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
                type: 'warning'
                     }).then(() => {
                    that.ajaxUpload(event)
                 }).catch(() => {
                    //取消
                    that.isuploadmsg = false;
                    that.percentage_num = 0;
                    event.target.value = ''
                });
         }else{
            this.ajaxUpload(event)
         }

        }else{
          Dialog.message('请选择小于1G的文件进行上传!','error',2000);
           event.target.value = ''
        }
    },
    ajaxUpload(event){
        var that = this;
       this.files_all_length = event.target.files.length+this.files_all.length
       if(this.files_all_length <= 100){
         this.percentage_num = 1;
        this.filesize_all=0
        for (let i = 0; i < event.target.files.length; i++) {
          that.filesize_all = that.filesize_all+event.target.files[i].size
          // 调用上传方法，传入选择的文件对象
          uploadFile(event.target.files[i],this.empAccId,this.corpAccId,this.parentFileId,this.fileGroupTarId,(files,progress,isLast,response) => {
              // upload-success
              let responseJson = eval('(' + response + ')');
              if (responseJson.code == 200) {
                this.upload_fileTarIds=this.upload_fileTarIds.concat(responseJson.data.fileTarIds)
              } else {
                --that.files_all_length
                if (responseJson.code == 2000) {
                  if (document.getElementsByClassName('el-message').length === 0) {
                    Dialog.message('您上传的文件名已被使用（含公司其他账号），请重新命名上传!','error',1500)
                  }
                } else {
                  Dialog.message(responseJson.message,'error',1500)
                }
                // if(isLast == 1){
                //     that.percentage_num=0;
                // }
                 event.target.value = ''
              }
            },(p_arr,isLast,response)=>{
                let responseJson = eval('(' + response + ')');
                if(responseJson.code == 200){
                  that.chunksize_all = 0
                  // console.log(JSON.stringify(p_arr, null, '\t'))
                  // 文件进度条
                  p_arr.forEach((item,index)=>{
                      // that.filesize_all=Number(that.filesize_all)+Number(item.filesize) <= 0 ? 1:Number(that.filesize_all)+Number(item.filesize)
                      that.chunksize_all=Number(that.chunksize_all)+Number(item.chunksize) <= 0 ? 1:Number(that.chunksize_all)+Number(item.chunksize)
                    })

                  // let progress = parseInt(that.files_all.length / p_arr.length * 100)
                  let progress = parseInt(that.chunksize_all / that.filesize_all * 100) > 1 ? parseInt(that.chunksize_all / that.filesize_all * 100) : 1
                  setTimeout(() => {
                      that.percentage_num = progress >= 100 ? 99 : progress
                      if(isLast == 1 && responseJson.data.process == 100 && responseJson.data.fileTarIds && responseJson.data.fileTarIds.length > 0){
                        that.files_all = p_arr
                        that.files_all = that.files_all.filter(item=>item.progress == 100)
                        if(that.files_all.length > 0 && that.files_all.length == that.files_all_length){
                          if(that.percentage_num < 100){
                            that.percentage_num= 100
                          }
                        }
                        if(that.percentage_num == 100){
                          setTimeout(() => {
                              that.percentage_num= 101
                          }, 1000);
                        }
                      }
                      // console.log(that.percentage_num)
                  }, 400)
                }
              },(status,isLast)=>{
                //预请求报错处理
                if(status == 0){
                    that.percentage_num=0
                     that.isuploadmsg=false;
                    --that.files_all_length
                }
            },(speed,timer)=>{
              // console.log(speed + " KB/s");
              that.upload_speed = speed
               that.isuploadmsg=false;
               this.timer = timer;
            },(xhr)=>{
                    that.uploadXhr.push(xhr);
    
                })
        }
       }else{
        this.percentage_num=0
        this.files_all_length=0
        that.isuploadmsg=false;
        event.target.value = ''
        Dialog.message('文件个数已超过100，请分批次进行上传!','error',2000)
       }
        // 重置file input控件的值
        event.target.value = ''
    },
    //文件（夹）保存
    handleSaveUploadComfrim() {
      let that = this;
      let folderMd5=downloadStore.state.message.folderMd5;
      let param = {
        'empAccId': this.empAccId,
        'fileTarIds': this.upload_fileTarIds,
        'description': this.upload_description,
        'folderMd5':folderMd5
      };
      // console.log(JSON.stringify(param,null,'\t'))
      if (this.files_all.length > 0) {
        // if(this.files_all.length == this.files_all_length){
          this.upload_loading = true;
          getData("/web/file/editDesc", param).then(res => {
            if (res.code == 200) {
              Dialog.message('保存成功!','success',1500)
              that.now_page = 1;
              that.inittable();
              that.isUpfileWjdialog = false;
                that.files_all_length = 0;
            } else {
              Dialog.message(res.message,'error',1500)
            }
            setTimeout(() => {
              that.upload_loading = false;
            }, 3000);
          })
        // }else{
        //   Dialog.message('还有文件未上传完!','error',1500)
        // }
      } else {
        Dialog.message('请上传文件!','error',1500)
      }
    },
    //上传中的文件删除
    //鼠标移入效果
    spikEnterUploadli(index) {
      this.currUplaodli = index;
    },
    //鼠标移出效果
    spikLeaveUploadli() {
      this.currUplaodli = null;
    },
    //上传文件删除
    spikUploadDel(item, index) {
      let that = this;
      getData("web/file/uploadDelete", {
        'md5': item.filemd5
      }).then(res => {
        if (res.code == 200) {
          that.percentage_num=0
          that.files_all.splice(index, 1);
          --that.files_all_length
          if (that.upload_fileTarIds.length > 0) {
            that.upload_fileTarIds.map((v, i) => {
              if (v == res.data) {
                that.upload_fileTarIds.splice(i, 1);
              }
            })
          }
          progressArrFunc(item.filemd5)
        }
      });
    },
    //删除列表的文件/文件夹
    ///删除单个
    handleDeleteWj(fileTarId) {
      const ids = [];
      ids.push(fileTarId);
      this.d_fileTarId = ids;
      let that = this;
      let param = {
        'corpAccId': this.corpAccId,
        'empAccId': this.empAccId,
        'fileTarIds': this.d_fileTarId
      };
      this.ajaxWjDelete(param);
    },
    ajaxWjDelete(data) {
      let that = this;
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        getData("web/fileGroup/view/fileDelete", data).then(res => {
          if (res.code == 200) {
            Dialog.message('删除成功!','success',1500)
            that.inittable();
          } else {
            Dialog.message(res.message,'error',1500)
          }
        });
      });
    },
    //删除批量
    handleDeleteWjHead(){
      if(this.d_fileTarId.length > 0){
          let param={
              'corpAccId':this.corpAccId,
              'empAccId':this.empAccId,
              'fileTarIds':this.d_fileTarId
          }
          this.ajaxWjDelete(param)
      }else{
          Dialog.message('请选择要删除的文件/文件夹!','error',1500)
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.file_group_container {
  position: relative;
}
.breadcrumb {
  padding-left: 15px;
}
.fileg_d_body {
  position: relative;
}
/* 管理员样式 */
.fileg_d_body .fileg_user_box {
  padding-left: 15px;
  padding-right: 15px;
}
.fileg_d_body .fileg_user_div0_left {
  line-height: 14px;
  color: #333;
  font-weight: bold;
  font-size: 14px;
  padding-top: 10px;
}
.fileg_d_body .fileg_user_item {
  border: 1px dashed #a5a5a5;
  padding: 5px 6px;
  display: inline-block;
  color: #000;
  font-size: 14px;
  position: relative;
  cursor: pointer;
}
.fileg_d_body .fileg_user_div0_right .fileg_user_item img {
  vertical-align: middle;
  width: 24px;
  height: 24px;
  margin-right: 4px;
}
.fileg_d_body .fileg_del_box {
  background: url("../../assets/icon-wjz_del.png") no-repeat center center;
  background-size: 12px;
  width: 20px;
  height: 20px;
  position: absolute;
  top: -8px;
  right: -10px;
  z-index: 1;
  cursor: pointer;
}
.fileg_d_body .fileg_user_div1 {
  border: 1px solid #dcdfe6;
  padding: 12px 12px 10px 2px;
  background: #f5f7fa;
  margin-top: 8px;
}
.fileg_user_div1 .fileg_user_item {
  border: 1px solid #fff;
  background: #fff;
  padding: 8px 6px;
  margin-left: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}
.fileg_user_div1 .fileg_user_item img {
  vertical-align: middle;
  width: 18px;
  height: 18px;
  margin-right: 4px;
}
.fileg_user_div1 .fileg_user_item:hover {
  border: 1px solid #bdc1cb;
  background: #fff;
}
.fileg_user_div1 .fileg_user_add {
  border: 1px dashed #bdc1cb;
  background: transparent;
  color: #18b270;
  padding: 10px 6px
}
.fileg_user_div1 .fileg_user_add:hover{
  border: 1px dashed #bdc1cb;
  background: #fff;
}
.fileg_user_div1 .fileg_user_add img {
  width: 10px;
  height: 10px;
  display: inline-block;
  vertical-align: initial;
}
.fileg_d_body .fileg_user_select_icon {
  background: url("../../assets/icon_arrow.png") no-repeat center center;
  background-size: 8px;
  width: 8px;
  height: 5px;
  margin-left: 18px;
  display: inline-block;
}
.fileg_d_body .display {
  display: inline-block !important;
}
.fileg_d_body .user_active {
  border: 1px solid #bdc1cb;
}
.fileg_d_body .fileg_user_div1 .user_select_box {
  width: 101%;
  position: absolute;
  left: -1px;
  top: 38px;
  z-index: 1;
  padding-top: 1px;
}
.fileg_d_body .fileg_user_div1 .user_select {
  border: 1px solid #bdc1cb;
  padding-bottom: 10px;
  background: #fff;
}
.fileg_d_body .fileg_user_div1 .user_select .p_item {
  height: 32px;
  font-size: 14px;
  color: #333;
  line-height: 32px;
  text-align: left;
  padding-left: 6px;
  cursor: pointer;
}
.fileg_d_body .fileg_user_div1 .user_select .p_item:hover {
  background: #ebf2fe;
  color: #4489ed;
}
.fileg_d_body .fileg_user_div1 .user_select .p_item.p_item_curr {
  background: #ebf2fe;
  color: #4489ed;
}
/* 表格样式 */
/* 表格标题、按钮样式 */
.fileg_table_box {
}
.fileg_table_box .table_head_box {
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 18px;
  margin-bottom: -2px;
}
.table_head_box .table_tit {
  line-height: 16px;
  color: #000;
  font-size: 16px;
  font-weight: bold;
}
.table_head_box .table_btn_box {
}
.table_head_box .file_h_item {
  display: block;
  float: left;
  margin-right: 8px;
  margin-top: 15px;
}
.table_btn_box .el-button--mini {
  padding: 7px 12px;
  font-size: 14px;
  border-radius: 4px;
}
.table_btn_box .el-button--mini img {
  vertical-align: bottom;
  margin-right: 2px;
  width: 16px;
  height: 16px;
}
/* 表格列表样式 */
.filename_icon {
  width: 20px;
  height: 20px;
  display: block;
}
.wj_path_div {
  font-size: 12px;
  color: #4489ed;
  cursor: pointer;
  width: 86vw;
  position: absolute;
  z-index: 1;
}
.el-table {
  color: #222;
}
.table_filename {
  margin-left: 10px;
  color: #222;
  font-size: 14px;
  cursor: pointer;
}
.table_filename:hover {
  color: #18b270;
}
.fileg_table_box .el-table__body-wrapper {
  overflow-y: auto;
  max-height: 62vh;
  /* max-height: 200px; */
}
.fileg_table_box .el-table th {
  padding: 8px 0;
}

.fileg_table_box .el-table td {
  padding: 8px 0;
  padding-bottom: 20px;
}
.fileg_table_box .table_cz_icon {
  width: auto;
  height: auto;
  display: block;
  float: left;
  cursor: pointer;
  margin-right: 16px;
}
.fileg_table_box .table_cz_icon img {
  vertical-align: middle;
}
/* 文件组所有文件面包屑 */
.file-h-p0 {
  width: 100%;
  display: block;
  color: #222;
  font-size: 14px;
  margin-top: 10px;
  line-height: 22px;
}

.file-h-p1 {
  width: 100%;
  display: block;
  font-size: 12px;
  color: #999999;
  line-height: 22px;
}

/*  */
.root_h_r {
    width: 34px;
    height: 35px;
    cursor: pointer;
    // position: relative;
}
.root_h_r img {
    width: 17px;
    height: 17px;
    display: block;
    margin: auto;
    margin-top: 7px;
}
.root_popover{
    top: 56px;
    right: 14px;
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