import { set } from "shelljs"

var downloadStore = {
  debug: true,
  state: {
    message: {
        'progress_all': 0, //总进度展示百分比
        'download_p_list': [], //下载列表
        'upload_p_list':[],//上传列表
        'is_d_progress': false, //进度条展示控制
        'is_p_suox': false, //控制下载弹框是否缩小显示
        'folderMd5':'',//下载保存id+date
        // 'total_speed':0,  //总下载网速
        'is_tab_progress':0,
        'is_progress':false,
    },
  'viewSrc':'',
  },
  //下载列表数据
  setMessageAction(newValue) {
    // if (newValue.progress_all){
    //   this.state.message.progress_all = newValue.progress_all
    // }
    if (newValue.download_p_list) {
      // console.log(JSON.stringify(newValue.download_p_list, null, '\t'))
      // console.log(JSON.stringify(this.state.message.download_p_list, null, '\t'))
      //下载列表
      this.state.message.download_p_list = this.state.message.download_p_list.concat(newValue.download_p_list)
      this.state.message.download_p_list = this.unique(this.state.message.download_p_list)
      //总进度
      let download_progress_all = this.state.message.download_p_list.filter(item => item.progress == 100)
      let progress_all = parseInt((download_progress_all.length / this.state.message.download_p_list.length) * 100)
      this.state.message.progress_all = progress_all;
      //下载总网速（文件下载100%个数 / ((结束时间 - 开始) / 1000) / 1024）
      // let startTime = newValue.startTime,
      //     endTime = Date.now();
      // let time = endTime - startTime
      // // console.log(time+'--------time')
      // // console.log(download_progress_all.length+'-----length')
      // if (time > 0) {
      //   this.state.message.total_speed = download_progress_all.length / (time / 1000) / 1024;
      // }
   
    }
  },
  setUploadList(val){
    if(val){
      this.state.message.upload_p_list = this.state.message.upload_p_list.concat(val)
    }
  },
  //下载列表数组去重
  unique(arr) {
    return Array.from(new Set(arr))
  },
  clearMessageAction() {
    this.state.message.download_p_list = []
    this.state.message.progress_all = 0
    this.state.message.is_d_progress = false
    this.state.message.is_p_suox = false
  },
  //控制下载列表的展示
  setMessageItem(obj){
    if (this.state.message.download_p_list.length > 0 ){
      this.state.message.is_p_suox = obj.is_p_suox
    }else{
      this.state.message.is_p_suox = false
    }
    this.state.message.is_d_progress = obj.is_d_progress
  },
  getMessage(){
    return this.state.message
  },
  setviewSrc(val){
     this.state.viewSrc = val
  },
  getViewSrc(){
    console.log(this)
    return this.state.viewSrc
  },
  //上传时的id+date md5
  setfolderMd5(val){
    this.state.message.folderMd5 = val
  }
}
export {
  downloadStore
}