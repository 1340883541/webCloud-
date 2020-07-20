<template>
    <div class="page-container">
        <div class="info_box">
            <!-- <p class="p0">404</p> -->
            <p class="p1">回收站中的文件（夹）保存{{days}}天后自动删除</p>
            <img class="img" src="../assets/icon_hsz.png" />
        </div>
    </div>
    
</template>
<script>
import axios from "axios";
import { getData } from "../api/api";
export default {
   data() {
    return {
      days:''
    };
  },
   mounted() {
       this.daysInfo()
   },
    methods: {
    daysInfo:function(){
      axios.get("open/api/setting/getRecDate").then(res => {
          let _this = this;
          _this.days = res.data.data;
      });
    },
    }
}
</script>

<style lang="css" scoped>
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