<template>
    <div class="page-container">
        <div class="info_box">
            <p class="p1">分享的文件已取消分享或已过期</p>
            <img class="img" src="../assets/icon_fx.png" />
        </div>
    </div> 
</template>

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