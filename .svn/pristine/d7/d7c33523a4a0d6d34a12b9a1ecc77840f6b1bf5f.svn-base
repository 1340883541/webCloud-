
<template>
  <!--  权限 -->
  <section>
    <el-row v-loading="isloadlist">
      <div class="pages">
        <div class="pad_info">
          <div class="header_info">
            <span class="curr_title">当前位置：</span>
            <span class="title" @click="back">控制台权限</span>
            <i>/</i>
            <span class="title_i">权限</span>
          </div>
        </div>
      </div>
      <form action>
        <div class="page-container">
          <div class="trxt">分配权限</div>
          <!-- 表格 -->
          <div class="table_info" style="border:1px solid #DCDFE6;margin-bottom:30px;">
            <div class="flex-wrap">
              <div class="flex-wrap" style="width:100%">
                <div class="text_1 text_bg border_bottom">
                  <span>模块</span>
                </div>
                <div class="con_info border_left">
                  <div class="flex-wrap border_bottom">
                    <div class="text_2 text_bg">
                      <span>列表</span>
                    </div>
                    <div class="flex-con flex-hh bg_col border_left">
                      <div class="text_3 text_bg">
                        <span>方法</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 内容 -->

            <!--  type1  未选中 type2 选中 type3 半选 -->
            <template v-for="(item,index) in tableData">
              <div class="flex-wrap border_bottom_flex" :key="index">
                <div class="flex-wrap flex-align-item" style="width:100%">
                  <div class="text_1" :key="index" @click.stop="checkBoxF(index)">
                    <i
                      class="checkbox_model"
                      :class="item.isChecked==1?'type1':item.isChecked==2?'type2':'type3'"
                    ></i>
                    <!-- <input
                      type="checkbox"
                      :name="item.resTarId"
                      v-model="item.isChecked"
                      :checked="item.isChecked==true?false:''"
                    />-->
                    <span>{{item.resName}}</span>
                  </div>

                  <div class="con_info border_left">
                    <template v-for="(list,i) in item.child">
                      <div class="flex-wrap con_info_item flex-align-item border_bottom" :key="i">
                        <div class="text_2" :key="i" @click.stop="checkBoxS(index,i)">
                          <i
                            class="checkbox_model"
                            :class="list.isChecked==1?'type1':list.isChecked==2?'type2':'type3'"
                          ></i>
                          <!-- <input
                            type="checkbox"
                            :name="list.resTarId"
                            v-model="list.isChecked"
                            :checked="list.isChecked==true?false:''"
                          />-->
                          <span>{{list.resName}}</span>
                        </div>
                        <div class="flex-con flex-hh border_left flex-align-item">
                          <template v-for="(childl,j) in list.child">
                            <div class="text_3" :key="j" @click.stop="checkBoxT(index,i,j)">
                              <i
                                class="checkbox_model"
                                :class="childl.isChecked==1?'type1':childl.isChecked==2?'type2':'type3'"
                              ></i>

                              <!-- <input
                                type="checkbox"
                                :name="childl.resTarId"
                                v-model="childl.isChecked"
                                :checked="childl.isChecked==true?false:''"
                              />-->
                              <span>{{childl.resName}}</span>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div class="footer_b">
          <div class="calen" @click="back">取消</div>
          <div class="config" @click="comfigBtn">保存</div>
        </div>
      </form>
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
      isloadlist:true,
      tableData: [],
      roleEditUrl: null, //接口定义
      corpAccId: null, //企业id
      getusers: "",
      accLevelId: this.$route.query.id,
      checked: true,
      arr: [],
      empAccId: null,
      idss: []
    };
  },
  mounted() {
    let _this = this;
    let userData = localStorage.getItem("user");
    let token = getCookie("token");
    if (token) {
      let userDataJson = eval("(" + userData + ")");
      //   console.log(userDataJson.corpAccId)
      //   console.log(userDataJson.empAccId)
      this.corpAccId = userDataJson.corpAccId;
      this.empAccId = userDataJson.empAccId;
      this.init();
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
    // _this.init();
  },
  computed: {},
  methods: {
    // 获取列表
    init: function() {
      let _this = this;
      let para = {
        'corpAccId': _this.corpAccId,
        'accLevelId': _this.accLevelId
      };
      this.isloadlist = true;
      getData("web/basic/console/res/findResBriefInfoByAccLevel", para).then(res => {
          _this.isloadlist = false
          if (res.code == 200) {
            let data = res.data.allResList;
            let oldData = res.data.hasResList;

            // console.log(JSON.stringify(data, null, "\t"));
            // 循环放着

            data.forEach((item, i) => {
              oldData.forEach((ite, j) => {
                if (
                  item.resTarId == ite.resTarId &&
                  item.resParentId == ite.resParentId
                ) {
                  item.isChecked = true;
                }
              });
            });
            // console.log(data);
            const result = construct(data, {
              id: "resTarId",
              pid: "resParentId",
              children: "child"
            });
            // console.log(result[1]);
            result.forEach((item, i) => {
              if (item.isChecked) {
                item.isChecked = 2;
              } else {
                item.isChecked = 1;
              }
              if (item.child && item.child.length > 0) {
                let isF2 = true; // 第二层是否全不选
                let isT2 = true; // 第二层是否全选

                item.child.forEach((ite, j) => {
                  if (ite.isChecked) {
                    ite.isChecked = 2;
                    isF2 = false;
                  } else {
                    ite.isChecked = 1;
                    isT2 = false;
                  }
                  if (!isT2 && !isF2) {
                    item.isChecked = 3;
                  }
                  if (ite.child && ite.child.length > 0) {
                    let isF3 = true; // 第三层是否全不选
                    let isT3 = true; // 第三层是否全选
                    ite.child.forEach((m, k) => {
                      if (m.isChecked) {
                        m.isChecked = 2;
                        isF3 = false;
                      } else {
                        m.isChecked = 1;
                        isT3 = false;
                      }
                    });
                    if (!isF3 && !isT3) {
                      ite.isChecked = 3;
                      item.isChecked = 3;
                    }
                  }
                });
              }
            });
            _this.tableData = result;
            _this.$forceUpdate();
          }else if (res.code == 1001) {
              Dialog.message(res.message,'error',1500)
              _this.$router.push({ path: "/403" });
          }
        }
      ),
        err => {
          console.log(err);
        };
    },
    checkBoxF(i) {
      // 最顶级；
      //  this.tableData[i].isChecked = !this.tableData[i].isChecked;
      if (this.tableData[i].isChecked == 1) {
        this.tableData[i].isChecked = 2;
      } else {
        this.tableData[i].isChecked = 1;
      }
      let flag = this.tableData[i].isChecked;
      if (this.tableData[i].child) {
        this.tableData[i].child.forEach((item, o) => {
          item.isChecked = flag;
          if (item.child && item.child.length > 0)
            item.child.forEach((ite, p) => {
              ite.isChecked = flag;
            });
        });
        this.$forceUpdate();
      }
    },
    checkBoxS(i, j) {
      // 第二级
      // this.tableData[i].child[j].isChecked = !this.tableData[i].child[j].isChecked;
      if (this.tableData[i].child[j].isChecked == 1) {
        this.tableData[i].child[j].isChecked = 2;
      } else {
        this.tableData[i].child[j].isChecked = 1;
      } // if ( //   !this.tableData[i].child[j].isChecked && this.tableData[i].isChecked==1 // ) { //   this.tableData[i].isChecked = false; // }

      let flag = this.tableData[i].child[j].isChecked;
      let flagF = true; //第二层全部全选
      let flagS = true; //第二层全部不选择
      this.tableData[i].child.forEach((item, k) => {
        if (item.isChecked == 1 || item.isChecked == 3) {
          // 第二层有一个未选择或者半选
          flagF = false; // 第二层不是全选
        }
        if (item.isChecked == 2 || item.isChecked == 3) {
          // 第二层有选中
          flagS = false;
        }
      });
      if (flagF) {
        // 第二层全部全选
        this.tableData[i].isChecked = 2;
      }
      if (flagS) {
        //第二层全部不选择
        this.tableData[i].isChecked = 1;
      }
      if (!flagF && !flagS) {
        // 部分选中
        this.tableData[i].isChecked = 3;
      }
      if (this.tableData[i].child[j].child) {
        this.tableData[i].child[j].child.forEach((item, o) => {
          item.isChecked = flag;
        });
      }
      this.$forceUpdate();
    },
    checkBoxT(i, j, m) {
      // 第三级
      //this.tableData[i].child[j].child[m].isChecked = !this.tableData[i].child[j].child[m].isChecked;
      if (this.tableData[i].child[j].child[m].isChecked == 1) {
        // 未选中
        this.tableData[i].child[j].child[m].isChecked = 2;
      } else {
        this.tableData[i].child[j].child[m].isChecked = 1;
      } // let treeArr = this.tableData[i].child[j].child; //第三层所有数据
      let flagF3 = true; //第三层全部全选
      let flagS3 = true; //第三层全部不选择
      let flagF2 = true; //第二层全部全选
      let flagS2 = true; //第二层全部不选择
      this.tableData[i].child[j].child.forEach((item, k) => {
        if (item.isChecked == 1 || item.isChecked == 3) {
          //第三层有一个未选择或者半选
          flagF3 = false; // 第三层不是全选
        }
        if (item.isChecked == 2) {
          // 第三层有选中
          flagS3 = false;
        }
      });
      if (flagF3) {
        // 第三层全部全选
        this.tableData[i].child[j].isChecked = 2;
      }
      if (flagS3) {
        //第三层全部不选择
        this.tableData[i].child[j].isChecked = 1;
      }
      if (!flagF3 && !flagS3) {
        // 部分选中
        this.tableData[i].child[j].isChecked = 3;
        this.tableData[i].isChecked = 3;
      } // let Farr = this.tableData[i].child ; // 第二层所有数据
      this.tableData[i].child.forEach((item, k) => {
        if (item.isChecked == 1 || item.isChecked == 3) {
          //第二层有一个未选择或者半选
          flagF2 = false; // 第二层不是全选
        }
        if (item.isChecked == 2 || item.isChecked == 3) {
          // 第二层有选中
          flagS2 = false;
        }
      });

      // 第二层全部不选择
      if (flagF2) {
        // 第2层全部全选
        this.tableData[i].isChecked = 2;
      }
      if (flagS2) {
        //第2层全部不选择
        this.tableData[i].isChecked = 1;
      }
      if (!flagF2 && !flagS2) {
        // 部分选中
        this.tableData[i].isChecked = 3;
      }

      this.$forceUpdate();
    },
    comfigBtn: function() {
      var _this = this;
      let arr = [];
      for (var i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].isChecked == 2) {
          arr.push(this.tableData[i].resTarId);
          if (this.tableData[i].child && this.tableData[i].child.length > 0) {
            this.tableData[i].child.forEach((item, o) => {
              arr.push(item.resTarId);
              if (item.child && item.child.length > 0)
                item.child.forEach((ite, p) => {
                  arr.push(ite.resTarId);
                });
            });
          }
        } else {
          if (this.tableData[i].child && this.tableData[i].child.length > 0) {
            let isFP = false;
            for (var j = 0; j < this.tableData[i].child.length; j++) {
              if (this.tableData[i].child[j].isChecked == 2) {
                arr.push(this.tableData[i].child[j].resTarId);
                isFP = true;
                // arr.push(this.tableData[i].resTarId);
                if (
                  this.tableData[i].child[j].child &&
                  this.tableData[i].child[j].child.length > 0
                ) {
                  this.tableData[i].child[j].child.forEach((item, o) => {
                    arr.push(item.resTarId);
                  });
                }
              } else {
                if (this.tableData[i].child[j].child) {
                  let isP = false;
                  for (
                    var m = 0;
                    m < this.tableData[i].child[j].child.length;
                    m++
                  ) {
                    if (
                      this.tableData[i].child[j].child &&
                      this.tableData[i].child[j].child.length > 0
                    ) {
                      if (this.tableData[i].child[j].child[m].isChecked == 2) {
                        arr.push(this.tableData[i].child[j].child[m].resTarId);
                        isP = true;
                      }
                    }
                  }
                  if (isP) {
                    arr.push(this.tableData[i].child[j].resTarId);
                    arr.push(this.tableData[i].resTarId);
                  }
                }
              }
              if (isFP) {
                arr.push(this.tableData[i].resTarId);
              }
            }
          }
        }
      }
      //console.log(arr);
      arr = this.unique(arr);
      // console.log(arr);
      let para = {
        'resTarIds': arr,
        'accLevelId': _this.accLevelId
      };
      getData("web/basic/console/res/editBatchLevelResRel", para).then(res => {
        if (res.code == 200) {
          Dialog.message('保存成功!','success',1500)
          this.$router.go(-1); //返回上一层
        } else {
          Dialog.message(res.message,'error',1500)
        }
      })
    },
    back: function() {
      this.$router.go(-1); //返回上一层
    },
    unique: function(arr) {
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        if (newArr.indexOf(arr[i]) === -1) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },
    back:function(){
       this.$router.go(-1)
    },
  }
};
</script>

<style scoped lang="scss">
.pages {
  width: 100%;
  border-bottom: 1px solid #dcdfe6;
  overflow: hidden;
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
        cursor: pointer;
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
  }
}
.page-container {
  padding: 10px 11px;
  margin-bottom: 60px;

  .trxt {
    font-size: 14px;
    font-weight: bold;
    line-height: 22px;
    color: rgba(34, 34, 34, 1);
  }
  table {
    width: 100%;
    border: 1px solid #ccc;
    border-collapse: collapse;
    .child__info {
      width: 100%;
      // min-height: 50px;
      line-height: 30px;
      padding: 10px 0;
      overflow: hidden;
      border-top: 1px solid #dcdfe6;
    }
    .child__info:nth-child(1) {
      border-top: none;
    }
    .child_info {
      width: 100%;
      line-height: 30px;
      padding: 10px 0;
      overflow: hidden;
      border-top: 1px solid #dcdfe6;
    }
    .child_info:nth-child(1) {
      border-top: none;
    }
  }
  thead th {
    text-align: left;
    background-color: #f5f7fa;
  }
  th {
    border: 1px solid #dcdfe6;
    padding: 10px 0 10px 16px;
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    cursor: pointer;
  }
  td {
    border: 1px solid #dcdfe6;
    // padding: 10px 0 10px 16px;
    font-size: 14px;
    color: rgba(34, 34, 34, 1);
    cursor: pointer;
    label {
      float: left;
      margin-right: 26px;
    }
  }
}
input {
  width: 12px;
  height: 12px;
  border: 1px solid #707070;
  border-radius: 2px;
  display: block;
  margin-right: 3px;
  float: left;
}
input[type="checkbox"] {
  float: left;
  // margin-top: 10px;
  border: none;
  background-color: rgba(0, 0, 0, 0);
  display: block;
  cursor: pointer;
  margin-left: 14px;
  margin-top: 3px;
}
input[type="checkbox"]:before {
  -webkit-appearance: none;
  margin-top: -13px;
  content: "";
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 6px;
  vertical-align: middle;
  border: 1px solid #c9c9c9;
  background: #fff;
}
input[type="checkbox"]:checked::before {
  background: url("../assets/icon_checkbox.png") no-repeat center center;
  /*背景图的写法是生效的*/
  border: none;
  width: 14px;
  height: 14px;
  background-size: cover;
}
// input[type="checkbox"]:checked::before {
//   background: url("../assets/icon_bx.png") no-repeat center center;
//   /*背景图的写法是生效的*/
//   border: none;
//   width: 14px;
//   height: 14px;
//   background-size: cover;
// }
.checkbox_model {
  width: 12px;
  height: 12px;
  border: 1px solid #707070;
  border-radius: 2px;
  display: block;
  margin-right: 3px;
  float: left;
}
// 全选
.type3 {
  background: url("../assets/icon_bx.png") no-repeat center center;
  background-size: 112%;
  border: 1px solid #18b270;
}
// 半选
.type2 {
  background: url("../assets/icon_checkbox.png") no-repeat center center;
  background-size: 112%;
  border: 1px solid #18b270;
}
// 未选
.type1 {
  width: 12px;
  height: 12px;
  border: 1px solid #707070;
}
.checkbox_model_active {
  background: url("../assets/icon_checkbox.png") no-repeat center center;
  background-size: 112%;
  border: 1px solid #18b270;
}
.footer_b {
  position: fixed;
  bottom: 0;
  height: 50px;
  line-height: 50px;
  display: flex;
  border-top: 1px solid #DCDFE6;
  width: calc(100% - 190px);
  align-items: center;
  justify-content: center;
  background: #fff;
  .calen {
    width: 80px;
    height: 32px;
    background: rgba(228, 228, 228, 1);
    opacity: 1;
    border-radius: 4px;
    font-size: 14px;
    color: rgba(51, 51, 51, 1);
    line-height: 32px;
    margin-right: 20px;
    text-align: center;
    cursor: pointer;
  }
  .config {
    width: 80px;
    height: 32px;
    background: rgba(68, 137, 237, 1);
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    border-radius: 4px;

  }
}
.text_3 {
  padding: 10px 16px;
  display: inline-block;
}

.text_2 {
  width: 140px;
  padding: 10px 16px;
}
.text_1 {
  width: 140px;
  padding: 10px 16px;
}
.border_bottom_flex {
  border-bottom: 1px solid #dcdfe6;
}
.border_bottom_flex:last-child {
  border-bottom: none;
}
.con_info .con_info_item:last-child {
  border-bottom: none;
}
.con_info {
  width: 100%;
}
.border_left {
  border-left: 1px solid #dcdfe6;
}
.border_bottom {
  border-bottom: 1px solid #dcdfe6;
}
.text_bg {
  background: #f5f7fa;
  height: 22px;
  line-height: 22px;
}
.bg_col {
  background: #f5f7fa;
}
</style>
