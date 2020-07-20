<template>
<!-- 我的分享 -->
  <section>
    <el-row>
      <div class="pages">
        <div class="breadcrumb">
          <div class="header_info">
            <span class="curr_title">当前位置：</span>
            <span class="title">首页</span>
            <i>/</i>
            <span class="title_i">我的分享</span>
          </div>
           <div class="file_h_item" v-if="isRbac_share">
            <el-button class="color-green" size="small" @click="handShare">
              取消分享
            </el-button> 
          </div>
        </div>
      </div>
      <div class="page-container">
        <!-- 表格 -->
        <div class="table_info col_tab">
          <el-table
            :data="tableData"
            ref="multipleTable"
            class="table_share"
            :header-cell-style="{background:'#fff',fontSize:'14px',color:'#666',fontWeight:'400',padding:' 8px 0'}"
            :default-expand-all="isExpand"
            style="width: 100%"
            v-loading="listLoading"
            @selection-change="handleCheckChange"
          >
            <el-table-column type="selection" width="55" label="全选"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="链接:">
                    <span>{{ props.row.shareUrl}}</span>
                    <span
                      v-if="props.row.valid==1"
                      class="color-green col_blue"
                      style="margin-left:10px;"
                      size="small"
                      @click="copy(props.row.shareUrl,props.row.fileTarId)"
                    >复制</span>
                    <span
                      v-if="props.row.valid==0"
                      class="color-green cloInvalid"
                      style="margin-left:10px;"
                      size="small"
                    >已失效</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <!-- <el-table-column label="分享文件" prop="fileName" class="b_m elipseone" :title="fileName"></el-table-column> -->
            <el-table-column label="分享文件">
                <template slot-scope="scope">
                  <span class="b_m elipseone" style="cursor: pointer;" :title="scope.row.fileName">{{ scope.row.fileName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="浏览次数" prop="viewTimes" class="b_m"></el-table-column>
            <el-table-column label="分享时间" prop="shareDate" class="b_m"></el-table-column>
            <el-table-column label="失效时间" prop="expireDate" class="b_m"></el-table-column>
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
    <!-- <div class="page-container" v-else>
      <div class="info_box">
          <p class="p1">您还未进行文件分享，赶紧去试一下吧</p>
          <img class="img" src="../assets/icon_nofx.png" />
      </div>
    </div> -->
  </section>
</template>
<script>
import { getData } from "../api/api";
import { construct, destruct } from "@aximario/json-tree";
import {Dialog,getCookie} from "../api/util.js";
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
      isExpand: true,
      tableData: [],
      fileShareTarIds: [],
      url: "",
      isRbac_list: false, //列表
      isRbac_share:false,//取消分享
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
                  if (val.routePath == "/fileshare") {
                    //功能操作
                    if (val.children && val.children.length > 0) {
                      // console.log(JSON.stringify(val.children, null, "\t"));
                      val.children.map((value, index) => {
                        if (value.resType == "FUNC") {
                          if(value.accessPath=='/web/myShare/list'){
                             that.isRbac_list = true;
                          }
                          if(value.accessPath=='/web/myShare/sharesCancel'){
                             that.isRbac_share = true;
                          }
                        }
                      })
                      if(!that.isRbac_list){
                         that.$router.push({ path: "/403" });
                      }
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
      this.listLoading = true;
      let para = {
        'page': _this.page,
        'empAccId': _this.empAccId,
        'size': _this.page_size
      };
      getData("web/myShare/list", para).then(res => {
        if (res.code == 200) {
          _this.listLoading = false;
             if(res.data!=null||res.data!=''){
              _this.tableData = res.data;
              _this.page_size = res.currentSize;
              _this.total = res.totalCount;
           }else{
              _this.$router.push('/file404')
           }
        }else if(res.code==1001){
          Dialog.message(res.message,'error',1500)
          _this.$router.push({ path: "/403" });
        }
      }),
        err => {
          console.log(err);
        };
    },
    // 复制
    copy: function(url, id) {
      // console.log(url);
      let _this = this;
      var query = url.split(/\?(?!.*\?)/)[1];
      let location = window.location.href;
      let arrUrl = location.split("/#/");
      // _this.shareUrl = arrUrl[0] + "/#/link_share?" + query;
      _this.shareUrl = url;
      _this.$copyText(_this.shareUrl).then(function(e) {
        Dialog.message('复制成功,粘贴分享吧!','success',1500)
      });
    },
    // 全选
    handleCheckChange(evArr) {
      const ids = [];
      evArr.map(item => {
        ids.push(item.fileTarShareId);
      });
      // console.log(ids);
      this.fileShareTarIds = ids;
    },
    handShare:function(){
      let _this = this;
     if(this.fileShareTarIds&&this.fileShareTarIds.length>0){
      let para = {
        'fileShareTarIds': this.fileShareTarIds,
        'empAccId': _this.empAccId,
      };
      getData("web/myShare/sharesCancel", para).then(res => {
        if (res.code == 200) {
          Dialog.message('取消分享成功!','success',1500)
          _this.page=1;
          this.init();
        }else if(res.code==1001){
          Dialog.message(res.message,'error',1500)
          _this.$router.push({ path: "/403" });
        }
      }),
        err => {
          console.log(err);
        };
     }else{
        Dialog.message('选择取消分享的文件!','error',1500)
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
    }
  }
};
</script>


<style scoped lang="scss">
.pages {
  width: 100%;
  // border-bottom: 1px solid #dcdfe6;
}
.demo-table-expand {
  font-size: 0;
  margin-left: 22px;

  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 40px;
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
// .el-table__expanded-cell{
//    background: #F5F7FA;
// }
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
  margin-bottom: 40px;
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
.demo-table-expand .el-form-item {
  width: 100% !important;
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
</style>
