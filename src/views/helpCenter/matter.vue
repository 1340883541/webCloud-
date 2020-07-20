<template>
<!-- 帮助中心 -->
 <section>
    <div class="center_info_i flex-wrap">
       <div class="lf_info">
          <template v-for="(item,i) in items">
           <div @click="handleClick(item,i)" :class="{'activeInfo':item.isChecked}" :key="i"><span>{{item.faqType}}</span></div>
          </template>
       </div>
       <div class="rl_info">
         <div class="title">{{faqType}}</div>
         <template v-for="(all,i) in list">
           <div :key="i">
            <!-- <div class="title">{{all.faqType}}</div> -->
             <div class="box_isShow" :class="{'isActive':all.isChecked}">
                <div class="subject_title" @click="openClick(all,i,all.helpFaqId)">
                  <img src="../../assets/icon_arrow.png" v-show="all.isChecked"> 
                  <img src="../../assets/icon_narrow.png" v-show="!all.isChecked"> 
                  <span :class="{'isActiveText':all.isChecked}">{{i+1}}.</span><span :class="{'isActiveText':all.isChecked}" v-html="all.subject"></span>
                </div>
                <div class="content_title" v-loading="all.listLoading"  v-show="all.isChecked" v-html="all.content"></div>
              </div>
           </div>
         </template>
       </div>
    </div>
  </section>
</template>
<script>
import axios from "axios";
import { getData } from "../../api/api";
import {Dialog} from "../../api/util.js";
export default {
  data() {     6
    return {
      items:[],
      helpFaqTypeId:'',
      page: 1, //列表分页
      page_size: 100, //一页10调
      pager_count: 9, //
      total: 1,
      list:[],
      faqType:'',
    };
  },
  mounted() {
    this.init()
  },
  computed: {
    getData,
  },
  methods: {
    //左侧边栏列表
    //获取左侧边栏列表数据
    init:function(){
     axios.get("open/api/help/allHelpFaqType").then(res => {
        let _this = this;
        if(res.data.code==200){
        _this.items = res.data.data.map(v=>{
           v.isChecked = false
           return v;
        })
        _this.$nextTick(function() {
          _this.collapseInit();
        });
        }
      });
    },
    //点击左侧边栏
    openClick:function(all,i,id){
     let _this = this;
     all.listLoading = true;
    //  console.log(all)
      _this.list[i].isChecked = !_this.list[i].isChecked;
      if(!all.content){
          var params = {
          helpFaqId: id,
        };
        getData("open/api/help/getHelpFaqContent", params).then(res => {
          if (res.code == 200) {
              all.content = res.data.content;
              all.listLoading = false;
              _this.$forceUpdate();
          } else {
            Dialog.message(res.message,'error',1500)
          }
        })
      }
   },
   //默认显示左侧边栏第一个数据列表
    collapseInit:function(){
     let _this = this;
     if( _this.items&& _this.items.length>0){
      _this.items.map((v,i)=>{
        if(i===0){
         _this.items[i].isChecked = true;
          this.faqType = v.faqType
          let para = {
          'page': _this.page,
          'helpFaqTypeId': v.helpFaqTypeId,
          // 'openly':0,
          'size': _this.page_size
        };
        getData("/opera/basic/helpFaq/list", para).then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            _this.list = res.data.map(v=>{
              v.isChecked = false
              return v;
           });
            _this.page_size = res.currentSize;
            _this.total = res.totalCount;
          }
        }),
          err => {
            console.log(err);
          }; 
        }
      })
     }
   },
    handleClick:function(item,index){
      // console.log(item)
      let _this = this;
      _this.faqType = item.faqType
      _this.items.map((v, i) => {
        v.isChecked = false;
      });
        _this.items[index].isChecked = !_this.items[index].isChecked;
        let para = {
        'page': _this.page,
        'helpFaqTypeId': item.helpFaqTypeId,
        // 'openly':0,
        'size': _this.page_size
      };
      this.listLoading = true;
      getData("/opera/basic/helpFaq/list", para).then(res => {
        this.listLoading = false;
        if (res.code == 200) {
          _this.list = res.data.map(v=>{
          v.isChecked = false
          return v;
        });
          _this.page_size = res.currentSize;
          _this.total = res.totalCount;
        }
      }),
        err => {
          console.log(err);
        };

    },
  }
};
</script>
<style  lang="scss">
.centerPages {
  height: calc(100vh - 46px);
}
.text_info{
  margin-top:14px;
}
.center_info_i{
  width:100%;
  height:calc(100vh - 46px);
  background: #EEF1F6;
}
.lf_info{
  width: 120px;
  margin:0px 12px 17px 0px;
  background: #fff;
  text-align: center;
  border-right:1px solid #DCDFE6;
}
.rl_info{
  width: calc(100% - 146px) !important;
  margin:14px 0 17px 0px;
  background: #fff;
  overflow: hidden;
  overflow-y: auto
}
.rl_info .title{
    line-height: 32px;
    border-bottom: 1px solid #DCDFE6;
    padding-left: 12px;

}
.lf_info div{
  line-height: 32px;
  color: #333;
  cursor: pointer;
  word-wrap: break-word;
  padding: 0 10px;
  // margin-top:16px;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.lf_info .activeInfo{
 color:rgba(24,178,112,1);
 border-right:1px solid rgba(24,178,112,1)

}

.isActiveText{
  font-size:14px;
  font-weight:bold;
  line-height:19px;
  color:rgba(34,34,34,1);
}
.subject_title{
    // margin-left: 12px;
    // margin-top: 9px;
    cursor: pointer;
}
.content_title{
    // margin-left: 16px;
    margin-top: 12px;
    margin-right: 11px;
    padding-left:10px;
}
.content_title img{
     max-width: 100%;
}

.box_isShow{
    margin-left: 12px;
    margin-top: 9px;
    padding: 8px 0;
    border: 1px solid #DCDFE6;
    margin-right: 11px;
    padding-left: 10px;
    background: #f5f7fa;
    margin-bottom: 6px;
}
.isActive{
  background: #fff;
}

 

</style>
