
<template>
  <!-- 基础设置 -->
  <section>
    <el-row>
      <div class="pages">
        <div class="pad_info">
          <div class="header_info">
            <span class="curr_title">当前位置：</span>
            <span class="title">首页</span>
            <i>/</i>
            <span class="title_i">管理成员</span>
          </div>
          <div class="add_title" @click="addClick" v-if="isRbac_instet">
            <img src="../assets/icon_add.png" />
            <span>新增</span>
          </div>
          <div class="manage_top clearfix">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="姓名/账号:">
                <el-input v-model="formInline.name" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="状态:">
                <el-select
                  v-model="formInline.typeInfo"
                  @change="getSelectval(formInline.typeInfo)"
                  placeholder="请选择"
                >
                  <el-option label="请选择" value></el-option>
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="作废" value="0"></el-option>
                </el-select>
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
            <el-table-column prop="nickname" label="姓名" min-width="80"></el-table-column>
            <el-table-column prop="username" label="账号" min-width="80"></el-table-column>
            <el-table-column
              prop="levelName"
              label="权限"
              :formatter="modifierLevelName"
              min-width="80"
            ></el-table-column>
            <el-table-column prop="email" label="邮箱" :formatter="modifierEmail" min-width="80"></el-table-column>
            <el-table-column prop="enabled" label="状态" :formatter="formatRole" min-width="80"></el-table-column>
            <el-table-column prop="creator" label="创建人" :formatter="modifiercreator" min-width="80"></el-table-column>
            <el-table-column
              prop="createdDate"
              label="创建时间"
              :formatter="modifiertimes"
              min-width="80"
            ></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row,scope.$index)"
                  type="text"
                  size="medium"
                  v-if="isRbac_edit"
                >编辑</el-button>
                <el-button
                  @click="delClick(scope.row,scope.$index)"
                  type="text"
                  size="medium"
                  v-if="isRbac_del"
                >作废</el-button>
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
        class="addmenu_box diolog_box"
        left
        :before-close="handleClose"
      >
        <el-form
          :inline="true"
          :model="ruleForm2"
          :rules="rules"
          ref="ruleForm2"
          label-width="130px"
          class="demo-form-inline demo-ruleForm"
        >
          <!-- <el-form-item label="文件名" prop="renameFile">
            <el-input placeholder="请输入文件名" v-model="ruleForm2.name"></el-input>
          </el-form-item>-->
          <div class="inp_info">
            <label>
              <span>*</span>所属组织：
            </label>
            <el-form-item prop="corpNameSub">
              <el-input
                type="text"
                v-model="ruleForm2.corpNameSub"
                auto-complete="off"
                placeholder="请输入公司名"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info">
            <label>
              <span>*</span>中文姓名：
            </label>
            <el-form-item prop="name">
              <el-input
                type="text"
                v-model="ruleForm2.name"
                auto-complete="off"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info">
            <label>英文名：</label>
            <el-form-item prop>
              <el-input
                type="text"
                v-model="ruleForm2.Engname"
                auto-complete="off"
                placeholder="请输入英文名"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info">
            <label>
              <span>*</span>账号：
            </label>
            <el-form-item prop="account">
              <el-input
                type="text"
                v-model="ruleForm2.account"
                auto-complete="off"
                placeholder="请输入账号"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info" v-show="ispsdS">
            <label>
              <span>*</span>密码：
            </label>
            <el-form-item>
              <el-input
                type="password"
                v-model="ruleForm2.password"
                auto-complete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info" v-show="ispsdH">
            <label>密码：</label>
            <el-form-item>
              <el-input
                type="password"
                v-model="ruleForm2.editpassword"
                auto-complete="off"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info">
            <label>
              <span>*</span>权限：
            </label>
            <el-form-item prop="jurisdiction">
              <el-select
                v-model="ruleForm2.jurisdiction"
                @change="getJurisdictionval(ruleForm2.jurisdiction)"
                placeholder="请选择"
              >
                <el-option label="请选择" value></el-option>
                <el-option
                  :label="item.name"
                  :value="item.accLevelId"
                  v-for="(item,i) in listJu"
                  :key="i"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="inp_info">
            <label>邮箱：</label>
            <el-form-item>
              <el-input
                type="text"
                v-model="ruleForm2.emile"
                auto-complete="off"
                placeholder="请输入邮箱"
              ></el-input>
            </el-form-item>
          </div>
          <div class="inp_info">
            <label>备注：</label>
            <el-form-item prop="remarks">
              <el-input
                rows="2"
                type="textarea"
                v-model="ruleForm2.remarks"
                style="width:320px;"
                placeholder="200字以内"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="calelClick('ruleForm2')" size="small">取 消</el-button>
          <el-button type="primary" @click="determine('ruleForm2')" size="small">保存</el-button>
        </span>
      </el-dialog>
    </el-row>
  </section>
</template>

<script>
import { getData } from "../api/api";
import {Dialog,getCookie} from "../api/util.js";
import { base64encode, utf16to8, utf8to16, base64decode } from "../api/base64";
import { construct, destruct } from "@aximario/json-tree";

export default {
  components: {},
  data() {
    return {
      formInline: {
        name: "",
        typeInfo: ""
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
        corpNameSub: "",
        name: "",
        Engname: "",
        account: "",
        password: "",
        editpassword: "",
        jurisdiction: "",
        remarks: "",
        emile: ""
      },
      ispsdS: true,
      ispsdH: false,
      rules: {
        name: [
          {
            required: true,
            min: 2,
            max: 50,
            message: "请输入至少2位中文姓名",
            trigger: "blur"
          }
        ],
        account: [
          {
            required: true,
            min: 2,
            max: 50,
            message: "请输入至少2个字符的账号",
            trigger: "blur"
          }
        ],
        corpNameSub: [
          {
            required: true,
            message: "请输入组织",
            trigger: "blur"
          }
        ],
        jurisdiction: [
          {
            required: true,
            message: "请选择权限",
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
      listJu: [],
      empAccId: null,
      isRbac_list: false, //列表
      isRbac_del: false, //删除
      isRbac_instet: false, //新增
      isRbac_edit: false //编辑
    };
  },
  mounted() {
    let _this = this;
    this.getusers = localStorage.getItem("user");
    let token = getCookie("token");
    if (token) {
      //字符串转对象
      this.getusers = eval("(" + this.getusers + ")");
    }
    _this.corpAccId = _this.getusers.corpAccId;
    _this.empAccId = _this.getusers.empAccId;
    _this.ruleForm2.corpNameSub = _this.getusers.corpName;
    // console.log(_this.getusers.corpAccId);
    // console.log(_this.getusers);
    _this.getrbacData();
    _this.keyCodeEvent();
    _this.jurisdictionlist();
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
                  if (val.routePath == "/foundation_set") {
                    //功能操作
                    if (val.children && val.children.length > 0) {
                      // console.log(JSON.stringify(val.children, null, "\t"));
                      val.children.map((value, index) => {
                        if (value.resType == "FUNC") {
                          // if(value.accessPath=='web/basic/empManager/empList'){
                          //    that.isRbac_list = true;
                          // }
                          // if(value.accessPath=='web/basic/empManager/edit'){
                          //     that.isRbac_edit = true;
                          // }
                          // if(value.accessPath=='web/basic/empManager/disable'){
                          //      that.isRbac_del = true;
                          // }
                          // if(value.accessPath=='web/basic/empManager/insert'){
                          //    that.isRbac_instet = true;
                          // }
                          switch (value.accessPath) {
                            case "/web/basic/empManager/empList":
                              that.isRbac_list = true;
                              break;
                            case "/web/basic/empManager/edit":
                              that.isRbac_edit = true;
                              break;
                            case "/web/basic/empManager/disable":
                              that.isRbac_del = true;
                              break;
                            case "/web/basic/empManager/insert":
                              that.isRbac_instet = true;
                              break;
                          }
                        }else if(!this.isRbac_list){
                           this.$router.push({ path: "/403" });
                        }
                      })
                      // if(!this.isRbac_list){
                      //      this.$router.push({ path: "/403" });
                      // }
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
    // 清楚验证
    handleClose(){
      this.centerDialogVisible = false;
      this.$refs['ruleForm2'].clearValidate();
    },
    // 取消
    calelClick(formName){
        this.$refs[formName].resetFields();
        this.centerDialogVisible = false;
    },
    
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
    // 获取列表
    init: function() {
      let _this = this;
      let para = {
        'page': _this.page,
        'usernameOrNickname': _this.formInline.name,
        'enabled': _this.formInline.typeInfo,
        'corpAccId': _this.getusers.corpAccId,
        'size': _this.page_size
      };
      this.listLoading = true;
      getData("web/basic/empManager/empList", para).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          _this.tableData = res.data;
          _this.page_size = res.currentSize;
          _this.total = res.totalCount;
        }else if (res.code == 1001) {
            Dialog.message(res.message,'error',1500)
            _this.$router.push({ path: "/403" });
        }
      }),
        err => {
          console.log(err);
        };
    },
    getSelectval: function(val) {
      this.formInline.typeInfo = val;
    },
    // 权限列表
    jurisdictionlist: function() {
      let _this = this;
      let para = {
        'corpAccId': _this.getusers.corpAccId
      };
      getData("web/basic/empManager/getCorpAuth", para).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          _this.listJu = res.data;
        }
      }),
        err => {
          console.log(err);
        };
    },
    // 权限
    getJurisdictionval: function(val) {
      this.ruleForm2.jurisdiction = val;
    },
    // 搜索
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
      _this.ispsdS = true;
      _this.ispsdH = false;
      _this.ruleForm2 = {
        corpNameSub: _this.getusers.corpName,
        name: "",
        Engname: "",
        account: "",
        password: "",
        editpassword: "",
        jurisdiction: "",
        remarks: "",
        emile: ""
      };
      //新增接口
      _this.roleEditUrl = "insert";
    },
    // 编辑
    handleClick: function(row, index) {
      let _this = this;
      _this.centerDialogVisible = true;
      _this.modelTit = "编辑";
      _this.ispsdS = false;
      _this.ispsdH = true;
      _this.ruleForm2 = {
        corpNameSub: _this.getusers.corpName,
        name: row.nickname,
        Engname: row.enName,
        account: row.username,
        password: "",
        editpassword: '',
        jurisdiction: row.accLevelId,
        remarks: row.remarks,
        emile: row.email,
        empAccId: row.empAccId
      };
      //新增接口
      _this.roleEditUrl = "edit";
    },
    // 提交
    determine: function(ruleForm2) {
      let _this = this;
      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          var reg = /^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i;
          if (_this.ispsdS == true) {
            if (_this.ruleForm2.password == "") {
              Dialog.message('请输入密码!','error',1500)
              return;
            }
            if (!reg.test(_this.ruleForm2.password)) {
              Dialog.message('密码只能输入6-20位的数字或字母!','error',1500)
              return;
            }
          }
          if (_this.ispsdH == true) {
            if (_this.ruleForm2.editpassword != "") {
              if (!reg.test(_this.ruleForm2.editpassword)) {
                Dialog.message('密码只能输入6-20位的数字或字母!','error',1500)
                return;
              }
            }
          }
          // var regemail = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if (_this.ruleForm2.emile != "") {
            if (!regEmail.test(_this.ruleForm2.emile)) {
              Dialog.message('请输入正确的邮箱!','error',1500)
              return;
            }
          }
          var addParams = {
            'corpAccId': _this.corpAccId,
            'chName': _this.ruleForm2.name,
            'enName': _this.ruleForm2.Engname,
            'username': _this.ruleForm2.account,
            'email': _this.ruleForm2.emile,
            'remarks': _this.ruleForm2.remarks,
            'accLevelId': _this.ruleForm2.jurisdiction
          };
          if (_this.roleEditUrl == "insert") {
            addParams.password = base64encode(
              utf16to8(_this.ruleForm2.password)
            );
          }
          if (_this.roleEditUrl == "edit") {
            addParams.empAccId = _this.ruleForm2.empAccId;
            addParams.password = base64encode(
              utf16to8(_this.ruleForm2.editpassword)
            );
          }
          // console.log(addParams);
          getData("web/basic/empManager/" + this.roleEditUrl, addParams).then(
            res => {
              this.logining = false;
              if (res.code == 200) {
                _this.centerDialogVisible = false;
                if (this.roleEditUrl == "edit") {
                  Dialog.message('编辑成功!','success',1500)
                }
                if (this.roleEditUrl == "insert") {
                  Dialog.message('添加成功!','success',1500)
                }
                this.page = 1;
                this.ruleForm2 = {
                  corpNameSub: "",
                  name: "",
                  Engname: "",
                  account: "",
                  password: "",
                  editpassword: "",
                  jurisdiction: "",
                  remarks: "",
                  emile: ""
                };
                this.formInline = {
                  name: "",
                  typeInfo: ""
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
            }
          );
        }
      });
    },
    // 删除
    delClick: function(row, index) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.listLoading = true;
        return (
          getData("web/basic/empManager/disable", {
            'empAccId': row.empAccId
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
    formatRole: function(row, column) {
      return row.enabled == "1" ? "启用" : row.enabled == "0" ? "作废" : "";
    },
    modifierEmail(row, column) {
      return row.email ? row.email : "-";
    },
    modifierLevelName(row, column) {
      return row.levelName ? row.levelName : "-";
    },
    modifiercreator(row, column) {
      return row.creator ? row.creator : "-";
    },
    modifiertimes(row, column) {
      return row.createdDate ? row.createdDate : "-";
    }
  }
};
</script>

<style scoped lang="scss">
.el-row{
  overflow: hidden;
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
</style>
