import {Message} from 'element-ui';

import axios from "axios";
import {getData} from "../api/api.js";
import {Dialog, unique} from "../api/util.js";
import {downloadStore} from "../api/download_store.js";
import SparkMD5 from 'spark-md5'
// import md5 from './md5.js'

var progressArr = []; // 进度条arr
export function progressArrFunc(arr) {
  if(arr.length > 0){
    //删除某个文件
    progressArr.splice(progressArr.findIndex(item => item.filemd5 == arr), 1)
  }else{
    //初始化为空数组
    progressArr = arr
  }
};
var isabort = 0  //是否阻止xhr请求 0否 1是
export function abortFunc(abort) {
  isabort = abort
  // console.log(isabort);
  
};
var preCount = [];
export function uploadFile(file1,len, empAccId, corpAccId, folderId, fileGroupTarId, backtopage, backprogress, backrename, backSpeed,backxhr,backpre) {
    //文件每块分割2M 2097152，计算分割详情
    // console.log(file.size)
    var file = file1.files;
        file.md5 = file1.md5;
    if(file.size>1073741824){
      var chunkSize = 5242880; // 10M 10485760 50M 52428800;
    }else{
      var chunkSize = file.size > 52428800 ? 2097152 : 52428800; // 10M 10485760 50M 52428800;
    }
    var  chunks = Math.ceil(file.size / chunkSize) > 0 ? Math.ceil(file.size / chunkSize) : 1,
        currentChunk = file1.uploadslices,
        chunkMD5Seqs = [], // 每块文件md5数组
        isLast = chunks == 1 ? 1 : 0; //是否是最后一个分片 0代表不是/1代表是 ,当为1的时候，即告知服务器进行分块合并
  // var progressArr = [];
    // 得到md5码
    getFileMD5(file, md5 => {
      // 存储文件的md5码
      // console.log(JSON.stringify(chunkMD5Seqs, null, '\t'))
      // 拿文件md5码和每个分片md5码向后台发送预请求
      if (isabort == 0) {
        preUpload(file, chunks, chunkMD5Seqs)
      }
    })
    let date = +new Date();
    let spark = new SparkMD5();
    let md5_folderMd5 = empAccId+''+ date;
    spark.appendBinary(md5_folderMd5);
    let folderMd5=spark.end();
    downloadStore.setfolderMd5(folderMd5)
  //上传文件（夹）预请求
  function preUpload(file, chunks, chunkMD5Seqs) {
    let folderMd5=downloadStore.state.message.folderMd5;
    let param={
      "fileName": file.name,
      "empAccId": empAccId,
      "corpAccId": corpAccId,
      "folderId": folderId,
      "fileGroupTarId" : fileGroupTarId,
      "path": file.webkitRelativePath,
      "md5": file.md5,
      "totalSize": file.size,
      "chunks": chunks,
      "chunkMD5Seqs": chunkMD5Seqs,
      'folderMd5':folderMd5
    }
    // if (fileGroupTarId!=null){
      //param.fileGroupTarId = fileGroupTarId
    // }
    getData("web/file/preUpload", param).then(res => {
      if (res.code == 200) {
        progressArr.push({
          'filemd5': file.md5,
          'progress': 0,
          'chunksize': 0,
          'filesize': file.size,
          'name': file.name
        })
        if (isabort == 0) {
          chunkUpload(file, res.data,  file1.uploadslices);
          backpre && backpre(len,file1)
        }

      } else {
        if(res.code == 2000){
           Dialog.message('您上传的文件名(' + file.name + ')已被使用（含公司其他账号），请重新命名上传', 'error', 3000)
        }else{
          Dialog.message(res.message, 'error', 3000)
        }
        backrename && backrename(0, isLast,len)
      }
    });
  }

  // chunkSeq为上传文件块的索引
  function chunkUpload(file, chunkObj, chunkSeq) {
    var startTime, endTime, fileSize; // 上传文件网速

    var fileReader = new FileReader(),
        ajaxUrl = axios.defaults.baseURL,
        h_size = []; //后台 分割块的文件大小数组
    // 文件切割后的回调，this.result为切割的文件块
    fileReader.onload = function (e) {
      // console.log(e.target.result)
      // 用FormData传输文件对象
      let fd = new FormData()
      let folderMd5=downloadStore.state.message.folderMd5;
      // 设置文件上传接口的需要的参数
      fd.append('md5', file.md5)
      fd.append('chunkMd5', chunkMD5Seqs[chunkSeq].chunkMd5)
      // fd.append('chunkMd5', chunkObj.chunkMd5)
      fd.append('chunkSize', h_size[0])
      fd.append('isLast', isLast)
      fd.append('chunkSeq', chunkSeq+1)
      fd.append('folderMd5', folderMd5)
      // 设置上传的当前的文件块
      fd.append('file', new Blob([this.result]))
      var xhr = new XMLHttpRequest()
      backxhr&&backxhr(xhr,len)
      xhr.withCredentials = true;
      xhr.open('post', ajaxUrl + 'web/file/chunkUpload', true)
      startTime = endTime ? endTime : Date.now()
        // 文件上传进度条
      var oloaded = 0;
      var ot = new Date().getTime(); //设置上传开始时间
      var speed;
      var during = true;
      var  timer = setInterval(()=>{
        during = true;
      },2000)
      xhr.onreadystatechange = function () {
        // console.log(xhr.status)
    
        if (xhr.readyState == 4 && xhr.status == 200) {
          chunkSeq++
          let proNum = parseInt((100 / chunks))
          if (chunkSeq < chunks) {
            if (isabort == 0) {
              loadNext() // 继续切割下一块文件
            }
          } else {
            // 文件上传成功
            startTime = endTime ? endTime : Date.now();
          }
          backtopage && backtopage(file,len, 100, isLast, xhr.response,chunkSeq)
          // 文件上传进度条
          // 计算上传的进度
          let responseJson = eval('(' + xhr.response + ')');
          if (responseJson.data.process){
            const progress = parseInt(responseJson.data.process)
            // var p_arr = progressArr.map((v,i)=>{
            //   if(v.filemd5 == file.md5){
            //     v.progress = progress == 100 ? 100 : progress,
            //     v.chunksize = progress == 100 ? file.size : Number(v.chunksize) + Number(h_size[chunkSeq-1])
            //   }
            //   return v
            // })
            var uploadSize = progress == 100  ? file.size:chunkSize*chunkSeq;
            var sizeUtil = '';
            if(uploadSize>1073741824){
               uploadSize = uploadSize/1073741824;
               sizeUtil ='G'
            }else if(uploadSize<1048576){
              uploadSize = uploadSize/1024;
              sizeUtil ='Kb'
            }else{
              uploadSize = uploadSize/1048576;
              sizeUtil ='M'
            }
            var p_arr ={
                progress :progress == 100 ? 100 : progress,
                chunksize:uploadSize.toFixed(2)+sizeUtil
            }
            if (isabort == 0) {
              backprogress && backprogress(p_arr,len,isLast, xhr.response)
            }
          }
          
          // 文件上传进度条结束
          // 文件上传网速
       if(file.size > 52428800){
        endTime = Date.now();
        // fileSize = xhr.responseText.length;
        fileSize = Number(h_size[chunkSeq - 1]) > 0 ? Number(h_size[chunkSeq - 1]) : xhr.responseText.length;
        // console.log(JSON.stringify(h_size))
        // console.log(chunkSeq-1)
        // console.log(Number(h_size[chunkSeq - 1]))
        // console.log('filesize------'+fileSize,xhr.responseText.length)
        let time = endTime - startTime
        // console.log('kiashi---'+startTime)
        // console.log('结束-----'+endTime)
        // console.log(time)
        if (time > 0) {
           var  units = 'M/s';
          var speed = fileSize / (time*1024);
          speed = speed.toFixed(2)+units;
          backSpeed && backSpeed(speed,null,len)
        }
       }
          //文件上传网速结束

          xhr = null
          return
        }
        if (xhr.readyState == 4 && xhr.status == 500) {
          // 文件上传出错
        }
      }
      xhr.onerror = xhr.upload.onerror = function () {
        // 文件上传出错
      }
      xhr.upload.onloadstart = function () { //上传开始执行方法
         ot = new Date().getTime(); //设置上传开始时间
         oloaded = 0;
      };
      xhr.upload.onprogress = function (e) {
          // 计算上传的进度
          if(during &&  file.size <52428800){
              const progress = parseInt((e.loaded + chunkSeq * h_size[chunkSeq]) / file.size * 100)
              var nt = new Date().getTime();//获取当前时间
              var pertime = (nt-ot)/1000; //计算出上次调用该方法时到现在的时间差，单位为s
              ot = new Date().getTime(); //重新赋值时间，用于下次计算
              var perload = e.loaded - oloaded; 
              oloaded = e.loaded;
              preCount[chunkSeq] = perload;
              //   //上传速度计算
              //   for(var i=0;i<preCount.length;i++){
              //     perload+= preCount[i]
              //   }
              //   perload = perload/preCount.length
               
              // }
              // if(preCount.length>=4){
              //   preCount=[];
              // }
              // console.log(preCount,chunkSeq)
              speed =pertime===0?speed:perload/pertime;//单位b/s
              var units = '';//单位名称
                  speed = speed/(1024*1024);
                  units = 'M/s';
              if(isNaN(speed)|| speed==0){
                speed=0.01;
              }
              speed = speed.toFixed(2)+units;
        
              backSpeed && backSpeed(speed,timer,len)
              during = false
         
     
          }
         
          // console.log('progress------' + progress)
          // var p_arr = progressArr.map((v,i)=>{
          //   if(v.filemd5 == file.md5){
          //     v.progress = progress == 0 ? 100 : progress
          //   }
          //   return v
          // })
          // backprogress && backprogress(p_arr)
        }

      //开始发送
      if (isabort == 0){
        xhr.send(fd)
      }else{
        xhr.abort(fd)
      }
      fd = null
    }
    //处理单片文件的上传
    function loadNext() {
        // 计算切割文件的开始索引和结束索引
        var start = Number(chunkSeq) * Number(chunkSize),
          end = Math.min(start + Number(chunkSize), Number(file.size))
          // start + chunkSize >= file.size ? file.size : start + chunkSize
          // end = Math.min(start + Number(chunkSize), Number(file.size))
        // 切割文件并触发fileReader.onload
        fileReader.readAsArrayBuffer(file.slice(start, end))
        //切割文件大小
        var fileSlice = file.slice(start, end);
        //后台 分割块的文件大小数组
        h_size.push(fileSlice.size);
        //是否是最后一个分片 0代表不是/1代表是 ,当为1的时候，即告知服务器进行分块合并
        isLast = chunkSeq+1 == chunks ? 1 : 0;
    }
    // 触发文件第一块上传
    loadNext()
  }

  // 获得文件md5
  function getFileMD5(file, callback) {
    // console.log(file)
    //声明必要的变量
    var fileReader = new FileReader(),

      //创建md5对象（基于SparkMD5）
      spark = new SparkMD5(),
      hexMD5 = new SparkMD5(); 
      let date = +new Date();
    // console.log('chunks---' + chunks)
    //每块文件读取完毕之后的处理
    fileReader.onload = function (e) {
      // console.log(e.target.result)
      //每块交由sparkMD5进行计算
      let md5_wj = empAccId+folderId + fileGroupTarId + file.name + file.webkitRelativePath + e.target.result+date
      // console.log(empAccId,folderId,md5_wj)
      spark.appendBinary(md5_wj)
      
      currentChunk++
      //如果文件处理完成计算MD5，如果还有分片继续处理
      if (currentChunk < chunks) {
        loadNext()
      } else {
        callback(spark.end())
      }
    }

    //处理单片文件的上传
    function loadNext() {
      var start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize


      //将分割文件块依次读取 ， file.slice(startByte,endByte); 第一个参数startByte表示文件起始读取Byte字节,第二个参数则是结束读取字节
      //readAsArrayBuffer读取文件后，会在内存中创建一个ArrayBuffer对象（二进制缓冲区），将二进制数据存放在其中。通过此方式，可以直接在网络中传输二进制内容
      fileReader.readAsArrayBuffer(file.slice(start, end))
      //每个切割文件块的大小
      var fileSlice = file.slice(start, end);
      //拼后台上传数据
      let index = currentChunk + 1;
      let md5_d = empAccId+folderId + fileGroupTarId + file.name + file.size + index;
      //每个切割文件块的MD5
      let md5item = hexMD5.appendBinary(md5_d) 

      //拼后台数据
      let md5_i = {
        'chunkMd5': hexMD5.end(),
        'chunkSeq': index
      }
      chunkMD5Seqs.push(md5_i)
    }
    loadNext()
  }

}

