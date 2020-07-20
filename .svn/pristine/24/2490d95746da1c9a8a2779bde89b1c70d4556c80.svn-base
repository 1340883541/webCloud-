
<template>
  <section>
    <el-row>
      <div class="pages">
        <div class="pad_info">
          <div class="header_info">
            <span class="curr_title">当前位置：</span>
            <span class="title">首页</span>
            <i>/</i>
            <span class="title_i">控制台权限</span>
          </div>
          <div class="add_title" @click="addClick" v-if="isRbac_instet">
            <img src="../assets/icon_add.png" />
            <span>新增</span>
          </div>
          <div class="manage_top clearfix">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="权限名:">
                <el-input v-model="formInline.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="账号:">
                <el-input v-model="formInline.account" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item class="search_btn">
                <el-button type="primary" @click="searchChange" class="button_search">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="page-container">
        <!-- 表格 -->
        <div class="table_info">
          <el-table :data="tableData" class="tablelist" v-loading="listLoading" style="width: 100%">
            <el-table-column prop="name" label="权限名" min-width="80"></el-table-column>
            <el-table-column
              prop="remarks"
              label="描述"
              :formatter="descriptionFormatter"
              min-width="80"
            ></el-table-column>
            <el-table-column prop="accountList" label="账号列表" :formatter="accountFormatter" min-width="80"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row,scope.$index)"
                  v-if="isRbac_edit"
                  type="text"
                  size="medium"
                >编辑</el-button>
                <el-button
                  @click="jurisdictionClick(scope.row,scope.$index)"
                  type="text"
                  size="medium"
                  v-if="isRbac_qx"
                >权限</el-button>
                <el-button
                  @click="accountClick(scope.row,scope.$index)"
                  type="text"
                  size="medium"
                  v-if="isRbac_account"
                >选择账号</el-button>
                <el-button
                  @click="delClick(scope.row,scope.$index)"
                  type="text"
                  size="medium"
                  v-if="isRbac_del"
                >删除</el-button>
              </template>
            </el-table-column>
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
      <!-- 新增 -->
      <el-dialog
        :title="modelTit"
        :visible.sync="centerDialogVisible"
        :close-on-click-modal="false"
        width="500px"
        class="addmenu_box"
        left
        :before-close="handleClose"
      >
        <el-form
          :inline="true"
          :model="ruleForm2"
          :rules="rules"
          ref="ruleForm2"
          class="demo-form-inline"
        >
          <div class="inp_info">
            <label>
              <span>*</span>权限名：
            </label>
            <el-form-item prop="name">
              <el-input rows="2" type="text" v-model.trim="ruleForm2.name" placeholder="请输入"></el-input>
            </el-form-item>
          </div>

          <div class="inp_info">
            <label>备注：</label>
            <el-form-item prop="remarks">
              <el-input
                type="textarea"
                v-model.trim="ruleForm2.remarks"
                style="width:320px;"
                placeholder="200字以内"
                maxlength="200"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="calelClick('ruleForm2')"  size="small">取 消</el-button>
          <el-button type="primary"  size="small" class="infoBox" @click="determine('ruleForm2')">保存</el-button>
          <el-button type="primary"  size="small" @click="determineJClick('ruleForm2')" v-show="isSHow">保存并设置权限</el-button>
        </span>
      </el-dialog>
      <!-- 账号 -->
      <el-dialog title="分配成员" class="wjload_dialogAcc pel_info_tab" :visible.sync="rootVisible" :close-on-click-modal="false" width="35%">
        <div class="selet_box">
          <div class="root_tree_info">
            <div class="el-dropdown-link root_tree_company" @click="isClickShow">
              <!-- <i class="el-icon-arrow-down el-icon-caret-bottom" style="font-size:16px;"></i> -->
               <img src="../assets/icon_arrow.png" class="in_im" v-show="isShowImg"/>
               <img src="../assets/icon_narrow.png" class="in_img" v-show="!isShowImg"/>
              {{corpName}}
            </div>
            <div class="root_tree" v-show="isText">
              <div
                class="root_tree_li flex-wrap"
                v-for="(i,index) in root_allBlist"
                :key="index"
                :class="{'root_tree_li_active':i.isChecked}"
              >
                <div
                  class="root_t_li_left flex-con flex-wrap flex-align-item"
                  @click.stop="handleCheckRootItem(i,index)"
                >
                  <i class="checkbox_model" :class="{'checkbox_model_active':i.isChecked}"></i>
                  {{i.nickname}}
                  <span v-if="i.username">({{i.username}})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rootVisible = false"  size="small">取 消</el-button>
          <el-button type="primary"  size="small" @click="getCheckedKeys" :loading="addLoading">保存</el-button>
        </span>
      </el-dialog>
    </el-row>
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
      formInline: {
        name: "",
        account: ""
      },
      tableData: [],
      listLoading: true,
      page: 1, //列表分页
      page_size: 10, //一页10调
      pager_count: 9, //
      total: 1,
      centerDialogVisible: false,
      modelTit: "新增",
      ruleForm2: {
        name: "",
        remarks: ""
      },
      rules: {
        name: [
          {
            required: true,
            min: 2,
            max: 50,
            message: "请输入权限名",
            trigger: "blur"
          }
        ],
        remarks: [
          {
            required: false,
            max: 200,
            min: 1,
            message: "200字以内",
            trigger: "blur"
          }
        ]
      },
      roleEditUrl: "", //接口定义
      corpAccId: null, //企业id
      getusers: "",
      rootVisible: false,
      addLoading: false,
      root_allBlist: [],
      corpName: "",
      root_relList: [],
      accLevelId: "",
      ids: [],
      empAccId: null,
      isRbac_edit: false, //编辑
      isRbac_del: false, //删除
      isRbac_instet: false, //新增
      isRbac_account: false, //账号
      isRbac_qx: false, //权限
      isRbac_list: false,//列表
      isSHow:false,
      isShowImg:true,
      isText:true,
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
      this.corpName = userDataJson.corpName;
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
    // console.log(_this.getusers.corpAccId);
    // console.log(_this.corpAccId);
    // _this.getrbacData();
    _this.keyCodeEvent();
  },
  computed: {},
  methods: {
    //监听回车事件
    keyCodeEvent: function() {
      var _this = this;
      document.onkeydown = keyDownLogin;
      function keyDownLogin(e) {
        // 兼容FF和IE和Opera
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
          _this.init(); //具体处理函数
          return false;
        }
        return true;
      }
    },
    // 清楚验证
    handleClose(){
      this.centerDialogVisible = false;
      this.$refs['ruleForm2'].clearValidate();
    },
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
                  if (val.routePath == "/styemSet") {
                    //功能操作
                    if (val.children && val.children.length > 0) {
                      // console.log(JSON.stringify(val.children, null, "\t"));
                      val.children.map((value, index) => {
                        if (value.resType == "FUNC") {
                          if(value.accessPath=='/web/basic/console/level/edit'){
                             that.isRbac_edit = true;
                          }
                          if(value.accessPath=='/web/basic/console/level/delete'){
                             that.isRbac_del = true;
                          }
                          if(value.accessPath=='/web/basic/console/level/insert'){
                             that.isRbac_instet = true;
                          }
                          if(value.accessPath=='/web/basic/console/acc/**'){
                             that.isRbac_account = true;
                          }
                          if(value.accessPath=='/web/basic/console/res/**'){
                             that.isRbac_qx = true;
                          }
                          if(value.accessPath=='/web/basic/console/level/list'){
                             that.isRbac_list = true;
                          }
                          // switch (value.accessPath) {
                          //   case "/web/basic/console/level/edit":
                          //     that.isRbac_edit = true;
                          //     break;
                          //   case "/web/basic/console/level/delete":
                          //     that.isRbac_del = true;
                          //     break;
                          //   case "/web/basic/console/level/insert":
                          //     that.isRbac_instet = true;
                          //     break;
                          //   case "/web/basic/console/acc/**":
                          //     that.isRbac_account = true;
                          //     break;
                          //   case "/web/basic/console/res/**":
                          //     that.isRbac_qx = true;
                          //     break;
                          //   case "/web/basic/console/level/list":
                          //     that.isRbac_list = true;
                          //     break;
                          // }
                        }
                      });
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
        'username': _this.formInline.account,
        'nameOrLevel': _this.formInline.name,
        'corpAccId': _this.corpAccId,
        'size': _this.page_size
      };
      
      getData("web/basic/console/level/list", para).then(res => {
        if (res.code == 200) {
          _this.tableData = res.data;
          _this.page_size = res.currentSize;
          _this.total = res.totalCount;
           this.listLoading = false;
        }else if (res.code == 1001) {
            Dialog.message(res.message,'error',1500)
            _this.$router.push({ path: "/403" });
        }
      }),
        err => {
          console.log(err);
        };
    },
    //搜索
    searchChange: function() {
      let _this = this;
      _this.page = 1;
      _this.init();
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
    // 新增
    addClick: function() {
      let _this = this;
      _this.centerDialogVisible = true;
      _this.modelTit = "新增";
      _this.isSHow = true,
      _this.ruleForm2 = {
        name: "",
        remarks: ""
      };
      //新增接口
      _this.roleEditUrl = "insert";
    },
    // 取消
    calelClick(formName){
        this.$refs[formName].resetFields();
        this.centerDialogVisible = false;
    },
    // 编辑
    handleClick: function(row, index) {
      let _this = this;
      _this.centerDialogVisible = true;
      _this.modelTit = "编辑";
      _this.isSHow = false,
      _this.ruleForm2 = {
        name: row.name,
        remarks: row.remarks,
        accLevelId: row.accLevelId
      };
      //新增接口
      _this.roleEditUrl = "edit";
    },
    // 提交
    determine: function(ruleForm2) {
      let _this = this;
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          var addParams = {
            'corpAccId': _this.corpAccId,
            'name': _this.ruleForm2.name,
            'remarks': _this.ruleForm2.remarks
          };
          if (_this.roleEditUrl == "edit") {
            addParams.accLevelId = _this.ruleForm2.accLevelId;
            addParams.corpAccId = _this.corpAccId;
          }
          // console.log(addParams);
          getData(
            "web/basic/console/level/" + _this.roleEditUrl,
            addParams
          ).then(res => {
            this.logining = false;
            if (res.code == 200) {
              _this.centerDialogVisible = false;
              if (_this.roleEditUrl == "edit") {
                Dialog.message('编辑成功!','success',1500)
              }
              if (_this.roleEditUrl == "insert") {
                Dialog.message('保存成功!','success',1500)
              }
              this.page = 1;
              this.ruleForm2 = {
                name: "",
                remarks: ""
              };
              this.formInline = {
                name: "",
                account: ""
              };
              this.init();
            } else {
              if (this.roleEditUrl == "edit") {
                Dialog.message(res.message,'error',1500)
              }
              if (this.roleEditUrl == "insert") {
                Dialog.message(res.message,'error',1500)
              }
            }
          });
        }
      });
    },
    accountFormatter:function (row, colum) {
       return row.accountList ? row.accountList : '-';
    },
    // 保存并跳权限
    determineJClick:function(ruleForm2){
      let _this = this;
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          var addParams = {
            'corpAccId': _this.corpAccId,
            'name': _this.ruleForm2.name,
            'remarks': _this.ruleForm2.remarks
          };
          if (_this.roleEditUrl == "edit") {
            addParams.accLevelId = _this.ruleForm2.accLevelId;
            addParams.corpAccId = _this.corpAccId;
          }
          console.log(addParams);
          getData(
            "web/basic/console/level/" + _this.roleEditUrl,
            addParams
          ).then(res => {
            this.logining = false;
            if (res.code == 200) {
              _this.centerDialogVisible = false;
              if (_this.roleEditUrl == "edit") {
                Dialog.message('编辑成功!','success',1500)
              }
              if (_this.roleEditUrl == "insert") {
                Dialog.message('保存成功!','success',1500)
              }
              this.$router.push({
                path: "/jurisdiction",
                query: {
                  id: res.data.accLevelId
                }
              });
              this.page = 1;
              this.ruleForm2 = {
                name: "",
                remarks: ""
              };
              this.formInline = {
                name: "",
                account: ""
              };
              this.init();
            } else {
              if (this.roleEditUrl == "edit") {
                Dialog.message(res.message,'error',1500)
              }
              if (this.roleEditUrl == "insert") {
                Dialog.message(res.message,'error',1500)
              }
            }
          });
        }
      });
    },
    isClickShow:function(){
       this.isShowImg = !this.isShowImg
       this.isText = !this.isText
    },
    // 权限
    jurisdictionClick: function(row, index) {
      this.$router.push({
        path: "/jurisdiction",
        query: {
          id: row.accLevelId
        }
      });
    },
    // 选择账号
    accountClick: function(row, index) {
      let _this = this;
      _this.accLevelId = row.accLevelId;
      _this.rootVisible = true;
      getData("web/basic/console/acc/findEmpAccBriefInfoByAccLevel", {
        'accLevelId': row.accLevelId,
        'corpAccId': _this.corpAccId
      }).then(res => {
        if (res.code == 200) {
          _this.root_allBlist = res.data.allEmpAcc.map(v => {
            v.isChecked = false;
            return v;
          });
          console.log(_this.root_allBlist);
          res.data.hasEmpAcc.map(i => {
            _this.root_allBlist.map(j => {
              if (i.empAccId == j.empAccId) {
                _this.$set(j, "isChecked", true);
              }
            });
          });
        }
      }),
        err => {
          console.log(err);
        };
    },
    handleCheckRootItem: function(item, index) {
      let _this = this;
      console.log(item);
      _this.root_allBlist[index].isChecked = !_this.root_allBlist[index]
        .isChecked;
      _this.$nextTick(function() {
        _this.ids = _this.root_allBlist
          .filter(v => {
            if (v.isChecked) return v.empAccId;
          })
          .map(v => v.empAccId);
        console.log(_this.ids);
      });
    },
    getCheckedKeys: function() {
      let _this = this;
      _this.ids = _this.root_allBlist
        .filter(v => {
          if (v.isChecked) return v.empAccId;
        })
        .map(v => v.empAccId);
      console.log(_this.ids);
      _this.addLoading = true;
      if (_this.ids) {
        getData("web/basic/console/acc/editBatchEmpAccLevel", {
          'accLevelId': _this.accLevelId,
          'corpAccId': _this.corpAccId,
          'empAccIds': _this.ids
        }).then(res => {
          if (res.code == 200) {
            console.log(res);
            _this.rootVisible = false;
            _this.addLoading = false;
            _this.ids = [];
            _this.init();
          }
        });
      } else {
        _this.addLoading = false;
        Dialog.message('请先选择!','error',1500)
      }
      err => {
        console.log(err);
      };
    },
    // 删除
    delClick: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        return (
          getData("web/basic/console/level/delete", {
            'accLevelId': row.accLevelId
          }).then(res => {
            this.listLoading = false;
            if (res.code == 200) {
              Dialog.message('删除成功!','success',1500)
              this.page = 1;
              this.formInline = {
                name: "",
                typeInfo: ""
              };
              this.init();
            } else {
              Dialog.message(res.message,'error',1500)
            }
          }),
          err => {
            console.log(err);
          }
        );
      });
    },
    descriptionFormatter(row, column) {
      return row.remarks ? row.remarks : "-";
    }
  }
};
</script>

<style scoped lang="scss">
.el-row{
  overflow: hidden;
}
.infoBox{
    background: #E9FAF2;
    border: 1px solid #89cdb0;
    color: #18B270;
    opacity: 1;
}
.infoBox:hover{
   opacity: 0.6;
}
.table_info .el-table{
  border:1px solid #DCDFE6;
  border-bottom:none;
}
.pages {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  .pad_info {
    padding: 13px 0 0 15px;
    width: 100%;
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
    .manage_top {
      margin-top: 20px;
      .el-form-item {
        margin-bottom: 17px;
        margin-right: 32px;
      }

      .el-input {
        width: 250px;
        height: 32px;
        line-height: 32px;
      }
      .el-select {
        width: 250px;
      }
      .el-button--primary {
        padding: 8px 24px;
      }
    }
  }
}
.page-container {
  padding: 0 15px;
  margin-top: 17px;
}
//搜索框
.inp_info {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
  label {
    width: 130px;
    text-align: right;
  }
  span {
    color: red;
  }
  .el-form--inline .el-form-item__content {
    width: 100% !important;
  }

  .el-form-item {
    margin-bottom: 0;
    width: 100%;
    .el-input {
      width: 320px;
    }
    .el-select {
      width: 320px;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
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
/* rootroot_popover */
.root_tree_info {
  margin-top: 8px;
}
.root_tree_info .el-icon-caret-bottom {
  color: #909399;
}
.root_tree_info .root_tree_company {
  color: #222;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}
.root_tree_info .root_tree_li {
  padding-left: 22px;
  cursor: pointer;
  height: 26px;
  line-height: 26px;
}
.root_tree_info .root_t_li_right {
  width: auto;
}
.root_tree {
  margin-top: 6px;
}
.root_tree_info .checkbox_model {
  width: 12px;
  height: 12px;
  border: 1px solid #707070;
  border-radius: 2px;
  display: block;
  margin-right: 3px;
}
.root_tree_info .checkbox_model_active {
  background: url("../assets/icon_checkbox.png") no-repeat center center;
  background-size: 112%;
  border: 1px solid #18b270;
}
.root_tree_info .root_tree_li_active {
  background: #f5f7fa;
  font-weight: bold;
}
.color222 {
  color: #222 !important;
}
.root_popover {
  width: 320px;
  height: 177px;
  background: #fffaf3;
  border: 1px solid #eed1a9;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.06);
  position: absolute;
  top: 35px;
  right: 3px;
  z-index: 1;
  border-radius: 4px;
  color: #333;
  font-size: 14px;
  line-height: 18px;
  padding: 8px 14px;
}
.root_popover::after {
  box-sizing: content-box;
  width: 0px;
  height: 0px;
  position: absolute;
  right: 7px;
  top: -16px;
  padding: 0;
  border-right: 8px solid transparent;
  border-top: 8px solid transparent;
  border-bottom: 8px solid #eed1a9;
  border-left: 8px solid transparent;
  display: block;
  content: "";
  z-index: 10;
}
.root_popover:before {
  box-sizing: content-box;
  width: 0px;
  height: 0px;
  position: absolute;
  right: 8px;
  top: -14px;
  padding: 0;
  border-right: 7px solid transparent;
  border-top: 7px solid transparent;
  border-bottom: 7px solid #fffaf3;
  border-left: 7px solid transparent;
  display: block;
  content: "";
  z-index: 12;
}
.in_im{
  width:9px;
}
.in_img{
 width:5px;
}

</style>
