<template>
    <div class="container file_group_container">
        <div class="file_g_head breadcrumb">
            <div class="header_info">
                <span class="curr_title">当前位置：</span>
                <span class="title">二级菜单</span>
                <i>|</i>
                <span class="title_i">文件组</span>
                <div class="fr fileg_pagination">
                    <a class="prev" :class="{'nopage':total_page <= 1 || now_page <= 1}" @click.stop="spilPagePrev">上一页</a>
                    <span class="page_fenge"></span>
                    <a class="next" :class="{'nopage':total_page==now_page}" @click.stop="spilPageNext">下一页</a></div>
            </div>
        </div>
        <div class="file_g_body" v-loading="isloadlist">
            <ul class="file_g_ul clearfix">
                <el-row :gutter="22" style="position:relative;">
                    <!-- 新增文件组 -->
                    <el-col v-if="isRbac_add" :lg="{span:8}" :md="{span:12}" :sm="{span:24}">
                        <li class="file_g_li file_g_li_add flex-wrap flex-align-item flex-center" @click.stop="handleAddWjz">
                            <img src="../assets/icon_xz_add.png" alt="">&nbsp;新增文件组
                        </li>
                    </el-col>
                    <!-- 文件组item -->
                    <el-col v-for="(item,index) in filegrouplist" :key="index" :lg="{span:8}" :md="{span:12}" :sm="{span:24}">
                        <li class="file_g_li" @mouseenter="spikEnterlist(index)" @mouseleave="spikLeavelist" @click.stop="spikOpenDetail(item)">
                            <div class="file_item_top flex-wrap flex-align-item">
                                <div class="file_item_t_head"><img src="../assets/icon_rjz_head.png"></div>
                                <div class="file_item_t_info">
                                    <p class="p0 clearfix"><span class="w-elli fl">{{item.fileGroupName}}</span><i class="fl" v-if="isRbac_edit && item.authority == 1" @click.stop="spikEditName(item)"></i></p>
                                    <p class="p1 w-elli">{{item.remarks}}</p>
                                </div>
                            </div>
                            <div class="file_item_bottom">
                                <div class="file_item_b_usernum">
                                    <p class="fl">成员<span class="color_chengse">{{item.accCount}}</span>人</p>
                                    <p class="fr">共享文件<span class="color_chengse">{{item.fileCount}}</span>个</p>
                                </div>
                                <div class="file_item_b_users w-elli-3">
                                    {{item.empAccNames}}
                                </div>
                            </div>
                            <div v-if="isRbac_delete && item.authority == 1" class="file_g_del" :class="{'display':iscurrList==index}" @click.stop="handleWjzDel(item)"></div>
                        </li>
                    </el-col>
                </el-row>
            </ul>
        </div>
        <!-- 新增文件组 -->
        <el-dialog
            class="wjj_dialog"
            :title="wjzDialogTit"
            :visible.sync="isAddWjzdialog"
            width="30%"
            :close-on-click-modal="false"
            :before-close="handleaddWjzClose">
            <el-form :model="addWjzForm" :rules="addwjzrules" ref="addWjzForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="文件组名" prop="fileGroupName">
                    <el-input placeholder="请输入文件组名" v-model="addWjzForm.fileGroupName"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input placeholder="请输入备注(200字以内)" type="textarea" rows="5" cols="7" v-model="addWjzForm.remarks"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" @click="handleAddWjzCancel('addWjzForm')">取 消</el-button>
                    <el-button size="small" type="primary" @click="handleAddWjzsubmit('addWjzForm')" :loading="addWjzLoading">保 存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import axios from "axios";
import { getData } from "../api/api.js";
import { construct, destruct } from '@aximario/json-tree';
import {Dialog,getCookie} from "../api/util.js";
export default {
    data() {
        var validateWjz = (rule, value, callback) => {
            // var wjjReg = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9]+/).test(value);
            //中文、英文、数字但不包括下划线等符号
            var wjjReg = RegExp(/^[\u4E00-\u9FA5A-Za-z0-9]+$/).test(value);
            if (value === "") {
                callback(new Error("请输入文件组名"))
            }else if(value.length>50){
                callback(new Error("请输入50字以内"))
            } else if(!wjjReg){
                callback(new Error("文件组名非法,请重新定义"))
            }else{
                callback();
            }
        }
        return {
            //数据参数
            isloadlist:true,
            corpAccId:null,
            empAccId:null,
            filegrouplist:[],
            iscurrList:null,
            now_page:1,
            page_size:10,
            total_page:1,
            //新增文件组
            wjzDialogTit:'新增',
            isAddWjzdialog:false,
            addWjzLoading:false,
            add_fileTarId:'',
            addWjzForm:{
                fileGroupName: '',
                remarks: '',
                fileGroupTarId:null
            },
            addwjzrules:{
                fileGroupName: [
                    { required: true, validator: validateWjz, trigger: 'blur' },
                ],
                remarks: [
                    { required: false, message: '请输入备注(200字以内)!', trigger: 'blur' },
                    { min: 1, max: 200, message: '请输入200字以内!', trigger: 'blur' }
                ]
            },
            //菜单资源权限
            isRbac_add:false, //新增
            isRbac_list:false, //列表
            isRbac_edit:false, //编辑
            isRbac_delete:false, //删除
        }
    },
    mounted() {
        let userData = localStorage.getItem("user");
        let token = getCookie("token");
        if(token){
            let userDataJson = eval('(' + userData + ')')
            // console.log(userDataJson.corpAccId)
            // console.log(userDataJson.empAccId)
            this.corpAccId = userDataJson.corpAccId
            this.empAccId = userDataJson.empAccId
            this.getrbacData()
        }else{
            this.$router.push("/login")
        }
    },
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
                    if(that.menulistJson.length > 0){
                        that.menulistJson.map((v,i)=>{
                            if(v.children && Object.prototype.toString.call(v.children).toLowerCase() === '[object array]' && v.children.length > 0){
                                v.children.map((val,idx)=>{
                                    if(val.routePath == '/file_group'){
                                        //功能操作
                                        if(val.children && val.children.length>0){
                                            // console.log(JSON.stringify(val.children, null, "\t"))
                                            val.children.map((value,index)=>{
                                                if(value.resType == 'FUNC'){
                                                    switch (value.accessPath) {
                                                        case "/web/fileGroup/insert":
                                                        that.isRbac_add = true;
                                                        break;
                                                        case "/web/fileGroup/view/**":
                                                        that.isRbac_list = true;
                                                        break;
                                                        case "/web/fileGroup/edit":
                                                        that.isRbac_edit = true;
                                                        break;
                                                        case "/web/fileGroup/delete":
                                                        that.isRbac_delete = true;
                                                        break;
                                                    }
                                                }
                                            })
                                            if(!that.isRbac_list){
                                                that.$router.push({ path: "/403" });
                                            }
                                        }
                                    }
                                })
                            }
                        })
                    }
                    that.initData()
                }
            });
        },
        //文件组初始
        initData(){
            let that = this;
            getData("web/fileGroup/view/list", {
                'corpAccId':this.corpAccId,
                'empAccId':this.empAccId,
                'page':this.now_page,
                'size':this.page_size,
            }).then(res => {
                that.isloadlist=false
                if (res.code == 200) {
                    that.filegrouplist = res.data || []
                    that.total_page = res.pages > 0 ? res.pages : 1;
                } else {
                    if (res.code == 1001) {
                        Dialog.message(res.message,'error',1500)
                        that.$router.push({ path: "/403" });
                    }
                }
            });
        },
        //分页
        //上一页
        spilPagePrev(){
            --this.now_page
            this.isloadlist=true
            this.initData();
        },
        //下一页
        spilPageNext(){
            ++this.now_page
            this.isloadlist=true
            this.initData();
        },
        //文件组跳转详情
        spikOpenDetail(item){
            this.$router.push({ name: "filegroup_detail", params:{id: item.fileGroupTarId, name:item.fileGroupName}});
        },
        //删除文件组
        //鼠标移入
        spikEnterlist(index){
            this.iscurrList=index;
        },
        //鼠标移出
        spikLeavelist(){
            this.iscurrList=null;
        },
        handleWjzDel(item){
            let that = this;
            this.$confirm('是否确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                getData("web/fileGroup/delete", {
                    'empAccId':this.empAccId,
                    'fileGroupTarId':item.fileGroupTarId
                }).then(res => {
                    if (res.code == 200) {
                        that.initData()
                    }else{
                        Dialog.message(res.message,'error',1500)
                    }
                })
            })
        },
        //新增文件组
        //打开新增dialog
        handleAddWjz(){
            this.isAddWjzdialog=true
            this.wjzDialogTit='新增'
            this.addWjzForm={
                fileGroupName: '',
                remarks: '',
                fileGroupTarId:null
            }
        },
        //关闭新增dialog
        handleaddWjzClose(){
            this.clearVail();
            this.isAddWjzdialog=false;
        },
        //清除验证
        clearVail(){
            this.$refs['addWjzForm'].clearValidate();
        },
        handleAddWjzCancel(formName){
            this.$refs[formName].resetFields();
            this.isAddWjzdialog=false;
        },
        //保存新增\编辑文件组
        handleAddWjzsubmit(formName){
            let that = this,
                param={
                    'corpAccId':this.corpAccId,
                    'empAccId':this.empAccId,
                    'remarks':this.addWjzForm.remarks
                },
                ajaxUrl="insert";
            if(this.addWjzForm.fileGroupTarId!=null){
                //编辑
                param.fileGroupTarId = this.addWjzForm.fileGroupTarId
                param.renameFileGroup = this.addWjzForm.fileGroupName
                ajaxUrl="edit"
            }else{
                //新增
                param.fileGroupName=this.addWjzForm.fileGroupName
            }
            // console.log(JSON.stringify(param))
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    that.addWjzLoading=true;
                    getData("web/fileGroup/"+ajaxUrl, param).then(res => {
                        if (res.code == 200) {
                            that.isAddWjzdialog=false;
                            Dialog.message(that.wjzDialogTit+'文件组成功!','success',3000)
                            that.$refs[formName].resetFields();
                            that.initData()
                        } else {
                            if(res.code != 1003){
                                Dialog.message(res.message,'error',1500)
                            }
                        }
                        setTimeout(() => {
                            that.addWjzLoading=false;
                        }, 3000);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //编辑文件组名
        spikEditName(item){
            this.isAddWjzdialog=true
            this.wjzDialogTit='编辑'
            this.addWjzForm={
                fileGroupName: item.fileGroupName,
                remarks: item.remarks,
                fileGroupTarId:item.fileGroupTarId
            }
        },
    }
};
</script>
<style lang="scss" scoped>
.file_group_container{
    position: relative;
}
.breadcrumb{
    padding-left: 28px;
}
/* 列表内容 */
.file_g_body{
    position: relative;
}
.file_g_body .file_g_ul{
    padding-left: 25px;
    padding-right: 25px;
}
.file_g_body .file_g_ul .file_g_li{
  position: relative;
  height: 162px;
  border: 1px solid #DCDFE6;
  border-radius:2px;
  margin-bottom: 22px;
  padding: 10px;
  -webkit-transition: all 0.3s eaes;
  -moz-transition: all 0.3s eaes;
  -ms-transition: all 0.3s eaes;
  -o-transition: all 0.3s eaes;
  transition: all 0.3s eaes;
  cursor: pointer;
}
.file_g_body .file_g_ul .file_g_li:hover{
    box-shadow: 2px 2px 6px #DCDFE6
}
.file_g_body .file_g_ul .file_g_li_add{
    border: 1px dashed #A5A5A5;
    font-size: 16px;
    color: #18B270;
    cursor: pointer;
}
.file_g_li .file_item_top{
    padding-left: 2px;
    padding-top: 2px;
}
.file_g_li .file_item_top .file_item_t_head{
    width: 34px;
    height: 34px;
    margin-right: 8px;
}
.file_g_li .file_item_top .file_item_t_head img{
    display: block;
    width: 100%;
    height: 100%;
}
.file_g_li .file_item_top .file_item_t_info{
    font-size: 16px;
    color: #000;
    width: calc(100% - 42px);
}
.file_g_li .file_item_top .file_item_t_info p{
    line-height: 22px;
    height: 22px;
}
.file_g_li .file_item_top .file_item_t_info .p0{
    margin-bottom: 2px;
}
.file_g_li .file_item_top .file_item_t_info .p0 span{
    display: block;
    max-width: 90%;
}
.file_g_li .file_item_top .file_item_t_info .p0 i{
    background: url('../assets/icon_wjz_bj.png') no-repeat center center;
    background-size: 12px;
    width: 24px;
    height: 22px;
    display: inline-block;
    vertical-align: bottom;
}
.file_g_li .file_item_bottom{
    margin-top: 12px;
}
.file_g_li .file_item_bottom .file_item_b_usernum{
    font-size: 14px;
    color: #000;
    line-height: 22px;
    height: 22px;
    margin-bottom: 5px;
}
.color_chengse{
    color: #F19000 !important;
}
.file_g_li .file_item_bottom .file_item_b_users{
    height: 52px;
    background: #F5F7FA;
    font-size: 14px;
    color: #333;
    padding: 10px;
    line-height: 20px;
}
.file_g_li .file_g_del{
    background: url('../assets/icon-wjz_del.png') no-repeat center center;
    background-size: 18px;
    width: 24px;
    height: 24px;
    position: absolute;
    top: -6px;
    right: -10px;
    z-index: 1;
    display: none;
}
.display{
    display: block !important;
}
/* 分页 */
.fileg_pagination{
    padding-right: 10px;
}
.fileg_pagination a{
    cursor: pointer;
    font-size: 16px;
    line-height: 22px;
    color: #18B270
}
.fileg_pagination .prev{
    // color: #999
}
.fileg_pagination .next{
    color: #18B270
}
.fileg_pagination .page_fenge{
    width: 1px;
    background: #000;
    display: inline-block;
    height: 12px;
    vertical-align: middle;
}
.fileg_pagination .nopage{
    pointer-events: none;
    cursor: not-allowed;
    color: #999
}
</style>