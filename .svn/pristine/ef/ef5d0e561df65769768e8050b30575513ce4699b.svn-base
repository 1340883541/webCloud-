
<template>
<!-- 回收站 -->
  <section>
    <el-row v-if="tableData.length>0">
      <div class="pages">
        <div class="pad_info">
          <div class="header_info">
            <span class="curr_title">当前位置：</span>
            <span class="title">首页</span>
            <i>/</i>
            <span class="title_i">回收站</span>
          </div>
          <div class="file_h_item" v-if="isRbac_recycleBin">
            <el-button class="color-green" size="small" @click="handReduction">
              <img src="../assets/icon_hy.png" />批量还原
            </el-button>
          </div>
          <div class="file_h_item" v-if="isRbac_delete">
            <el-button class="color-green" size="small" @click="handleDelete">
              <img src="../assets/icon_plsc.png" />彻底删除
            </el-button>
          </div>
        </div>
      </div>
      <div class="page-container">
        <!-- 表格 -->
        <div class="table_info">
          <el-table
            :data="tableData"
            v-loading="listLoading"
            tooltip-effect="dark"
            style="width: 100%"
            ref="multipleTable"
            :header-cell-style="{background:'#fff',fontSize:'14px',color:'#666',fontWeight:'400',padding:' 8px 0'}"
            @selection-change="handleCheckChange"
          >
           <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
            <el-table-column type="selection" width="55" label="全选"></el-table-column>
            <el-table-column label="名称" min-width="200">
              <template slot-scope="scope">
                <div  class="flex-wrap flex-con">
                  <!-- 文件类型type 0文件夹/文档1/图片2/音乐3/视频4/5其他 -->
                  <!-- 文件夹 -->
                  <img v-if="scope.row.type == 0" src="../assets/type/wjj_small.png" >
                  <!-- 文档 -->
                  <img v-if="scope.row.suffix=='.doc'||scope.row.suffix=='.docx'||scope.row.suffix=='.docm'||
                      scope.row.suffix=='.dotm'||scope.row.suffix=='.dotx'||scope.row.suffix=='.wps'||scope.row.suffix=='.doc'||
                      scope.row.suffix=='.rtf'" src="../assets/type/doc-small.png">
                  <img v-if="scope.row.suffix=='.ppt'||scope.row.suffix=='.pptx'||scope.row.suffix=='.pptm'||
                      scope.row.suffix=='.ppsx'||scope.row.suffix=='.ppsm'||scope.row.suffix=='.potx'||scope.row.suffix=='.potm'||
                      scope.row.suffix=='.ppam'" src="../assets/type/ppt-small.png" >
                  <img v-if="scope.row.suffix=='.pdf'" src="../assets/type/PDF-small.png">
                  <img v-if="scope.row.suffix=='.txt'" src="../assets/type/txt-small.png">
                  <img v-if="scope.row.suffix=='.rar'||scope.row.suffix=='.gz'||scope.row.suffix=='.arj'||
                      scope.row.suffix=='.zip'" src="../assets/type/rar-small.png">
                  <img  v-if="scope.row.suffix=='.csv'||scope.row.suffix=='.xls'||scope.row.suffix=='.xlsx'||scope.row.suffix=='.xlsm'||scope.row.suffix=='.xltx'||
                      scope.row.suffix=='.xltm'||scope.row.suffix=='.xlsb'||scope.row.suffix=='.xlam'" src="../assets/type/xls-small.png">
                  <!-- 图片 -->
                  <img v-if="scope.row.type == 2" src="../assets/type/JPG-small.png">
                  <!-- 音乐视频 -->
                  <img v-if="scope.row.type == 3 || scope.row.type== 4" src="../assets/type/MP3-small.png" >
                  <!-- 其它 -->
                  <img v-if="scope.row.type == 5" src="../assets/type/other-small.png">
                  <span class="elipseone" :title="scope.row.fileName" style="cursor: pointer;margin-left:4px;">{{ scope.row.fileName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="删除人" min-width="100"></el-table-column>
            <el-table-column prop="recycleDate" label="删除时间" min-width="150"></el-table-column>
            <el-table-column prop="sizeFormat" label="文件大小" :formatter="fileSallm" min-width="100"></el-table-column>
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
        <p class="p1">回收站中的文件（夹）保存{{days}}天后自动删除</p>
        <img class="img" src="../assets/icon_hsz.png" />
    </div>
    </div> -->
  </section>
</template>

<script>
import axios from "axios";
import { getData } from "../api/api";
import {Dialog,getCookie} from "../api/util.js";
import { construct, destruct } from "@aximario/json-tree";

export default {
  components: {},
  data() {
    return {
      tableData: [],
      listLoading: true,
      page: 1, //列表分页
      page_size: 10, //一页10调
      pager_count: 9, //
      total: 1,
      corpAccId: null, //企业id
      getusers: "",
      fileTarIds: [],
      empAccId: null,
      isRbac_delete: false, //删除
      isRbac_recycleBin: false, //还原
      isRbac_fileList: false, //列表
      days:''
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
                  if (val.routePath == "/recycle") {
                    //功能操作
                    if (val.children && val.children.length > 0) {
                      // console.log(JSON.stringify(val.children, null, "\t"));
                      val.children.map((value, index) => {
                        if (value.resType == "FUNC") {
                          switch (value.accessPath) {
                            case "/web/recycleBin/forceDelete":
                              that.isRbac_delete = true;
                              break;
                            case "/web/recycleBin/re/**":
                              that.isRbac_recycleBin = true;
                              break;
                            case "/web/recycleBin/fileList":
                              that.isRbac_fileList = true;
                              break;
                          }
                        }else if(!that.isRbac_fileList){
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
        'size': _this.page_size
      };
      this.listLoading = true;
      getData("web/recycleBin/fileList", para).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          if(res.data==null||res.data==''){
            _this.$router.push('/recycle404')
          }else{
           _this.tableData = res.data;
           _this.page_size = res.currentSize;
           _this.total = res.totalCount;
          }
      } else if (res.code == 1001) {
            Dialog.message(res.message,'error',1500)
            _this.$router.push({ path: "/403" });
        }
            
      }),
        err => {
          console.log(err);
        };
    },
 
    //多选
    handleCheckChange(evArr) {
      const ids = [];
      evArr.map(item => {
        ids.push(item.fileTarId);
      });
      // console.log(ids);
      this.fileTarIds = ids;
    },
    //批量还原
    handReduction: function() {
    if (this.fileTarIds.length > 0) {
      this.$confirm("确认还原该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
          getData("web/recycleBin/re/batchRestore", {
            'fileTarIds': this.fileTarIds
          }).then(res => {
            this.listLoading = false;
            if (res.code == 200) {
              if (res.data.conflictFileTarIds && res.data.conflictFileTarIds.length>0) {
                this.$confirm("文件名已重复是否确定还原?", "提示", {
                  type: "warning"
                }).then(() => {
                  this.listLoading = true;
                  return (
                    getData("web/recycleBin/re/batchRestoreConflict", {
                      conflictFileTarIds:res.data.conflictFileTarIds
                    }).then(res => {
                      this.listLoading = false;
                      if (res.code == 200) {
                        Dialog.message('还原成功!','success',1500)
                        this.page = 1;
                        this.init();
                      } else {
                        this.listLoading = false;
                        Dialog.message(res.message,'error',1500)
                      }
                    }),
                    err => {
                      console.log(err);
                    }
                  );
                });
              } else {
                Dialog.message('还原成功!','success',1500)
              }
              this.page = 1;
              this.init();
            } else {
              this.listLoading = false;
              Dialog.message(res.message,'error',1500)
            }
          }),
            err => {
              console.log(err);
            };
         });
       } else {
          this.listLoading = false;
          Dialog.message('选择还原的文件!','error',1500)
        }
    },
    //彻底删除
    handleDelete: function() {
     if (this.fileTarIds.length > 0) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
          getData("web/recycleBin/forceDelete", {
            'fileTarIds': this.fileTarIds
          }).then(res => {
            this.listLoading = false;
            if (res.code == 200) {
              Dialog.message('删除成功!','success',1500)
              this.page = 1;
              this.init();
            } else {
              this.listLoading = false;
              Dialog.message(res.message,'error',1500)
            }
          }),
            err => {
              console.log(err);
            };
         })
      }else {
        this.listLoading = false;
        Dialog.message('选择删除的文件!','error',1500)
      }
    },
    fileSallm: function(row, index) {
      return row.sizeFormat ? row.sizeFormat : "-";
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
    }
  }
};
</script>

<style scoped lang="scss">
.pages {
  width: 100%;
  // border-bottom: 1px solid #dcdfe6;
  .pad_info {
    padding: 13px 0 0 15px;
    overflow: hidden;
    .header_info {
      .curr_title {
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        color: rgba(0, 0, 0, 1);
      }
      .title {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        color: rgba(24, 178, 112, 1);
      }
      i {
        color: rgba(0, 0, 0, 1);
        padding: 0 2px;
      }
      .title_i {
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        color: rgba(153, 153, 153, 1);
      }
    }
    .add_title {
      height: 32px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(220, 223, 230, 1);
      border-radius: 4px;
      width: 72px;
      line-height: 32px;
      margin-top: 10px;
      text-align: center;
      cursor: pointer;
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(24, 178, 112, 1);
      }
    }
  }
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
.el-pagination {
  text-align: right;
  margin-top: 40px;
}
.file_h_item {
  display: block;
  float: left;
  margin-right: 8px;
  margin-top: 15px;
  margin-bottom: 16px;
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
.table_info img{
   vertical-align: middle;
   width: 20px;
    height: 20px
}
</style>
