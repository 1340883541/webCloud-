import {Message} from 'element-ui';

import axios from "axios";
import {getData} from "./api.js";
import {Dialog, unique} from "./util.js";
import SparkMD5 from 'spark-md5'
// import md5 from './md5.js'

//全局的websocket变量
var ws;
var paragraph = 2097152;
// var paragraph = 512000;
//var paragraph = 1024;
var fileList=[];
var startSize, endSize = 0;
var i = 0,j = 0,progress = 0


var isabort = 0 //是否阻止xhr请求 0否 1是
export function abortFunc(abort) {
  isabort = abort
  if (isabort == 1) {
    console.log('close-----')
    console.log("关闭连接");
    ws = null;
  }
};
export function uploadFile(file, backtopage, backprogress) {
    //文件每块分割2M 2097152，计算分割详情
    // fileList = filearr
    
    wsUpload()
    function wsUpload() {
        ws = new WebSocket('ws://106.13.51.148:8181/webSocketServer');
        ws.binaryType = 'arraybuffer'
        //连接成功建立后响应
        ws.onopen = function () {
          console.log("成功连接到" + 'ws://106.13.51.148:8181/webSocketServer');
        }
        
        //收到服务器消息后响应
        ws.onmessage = function (e ) {
          // console.log("i-----:" + i);
          console.log(e.data)
          // var data = eval('(' + e.data + ')');
          if (e.data) {
            sendWs()
            // console.log(fileList)
            // console.log(fileList.length)
            // //链接创建成功回调
            // console.log('回调')
            // startSize = endSize;
            // endSize += paragraph;
            // backtopage && backtopage(i, startSize, endSize)

            if (endSize < file.size) {
              console.log("file.size:" + file.size);
              startSize = endSize;
              endSize += paragraph;
              // if (file.webkitSlice) {
              //   console.log("webkitSlice--->");
              //   var blob = file.webkitSlice(startSize, endSize);
              // } else if (file.mozSlice) {
              //   console.log("mozSlice--->");
              //   var blob = file.mozSlice(startSize, endSize);
              // } else {
              //   console.log("Slice--->");
              //   var blob = file.slice(startSize, endSize);
              // }
              // var reader = new FileReader();
              // reader.readAsArrayBuffer(blob);
              // reader.onload = function loaded(evt) {
              //   var ArrayBuffer = evt.target.result;
              //   console.log("发送文件第" + (i++) + "部分");
              //   console.log(ArrayBuffer)
              //   ws.send(ArrayBuffer);
              // }
              loadNext(i, file);
            } else {
              // console.log("endSize >= file.size-->" + e.data + "<---");
              // console.log("endSize >= file.size-->endSize:" + endSize);
              // console.log("endSize >= file.size-->file.size:" + file.size);
              progress = 100
              startSize = endSize = 0;
              i = 0;
              console.log("发送" + file.name + "完毕");
              console.log("发送文件完毕");
              // ws = null
            }
            
            //进度条开始
            // document.getElementById('progress').innerHTML = Math.round(startSize / file.size * 10000) / 100.00 + "%";
            progress = progress == 100 ? 100 : Math.round(startSize / file.size * 10000) / 100 + "%";
            backprogress && backprogress(progress)
            //进度条结束
          }
          //连接关闭后响应
          ws.onclose = function () {
            console.log("关闭连接");
            ws = null;
          }
          //
          // console.log(ws)
          ws.onerror = function (e){
            console.log('报错')
            console.log(e)
          }
          
          // return false;
        }
        //处理单片文件的上传
        function loadNext(chunkSeq, file) {
          // 计算切割文件的开始索引和结束索引
          var start = Number(chunkSeq) * Number(paragraph),
            end = Math.min(start + Number(paragraph), Number(file.size))
            console.log("start---" + start)
            console.log("end---" + end)
          // start + paragraph >= file.size ? file.size : start + paragraph
          // end = Math.min(start + Number(paragraph), Number(file.size))
          // 切割文件并触发fileReader.onload
          if (file.webkitSlice) {
            var blob = file.webkitSlice(start, end);
          } else if (file.mozSlice) {
            var blob = file.mozSlice(start, end);
          } else {
            var blob = file.slice(start, end);
          }
          var fileReader = new FileReader()
          fileReader.readAsArrayBuffer(blob)
          fileReader.onload = function loaded(evt) {
            var ArrayBuffer = evt.target.result;
            console.log("发送文件第" + (i++) + "部分");
            console.log(ArrayBuffer)
            // console.log(JSON.stringify(ArrayBuffer))
            // var uinitbuffer = new Uint8Array(ArrayBuffer)
            // console.log(uinitbuffer.buffer)
            ws.send(ArrayBuffer);
            // ws.send('啊啊啊啊啊啊啊啊');
          }
          //切割文件大小
          // var fileSlice = file.slice(start, end);
          // //后台 分割块的文件大小数组
          // h_size.push(fileSlice.size);
          // //是否是最后一个分片 0代表不是/1代表是 ,当为1的时候，即告知服务器进行分块合并
          // isLast = chunkSeq + 1 == chunks ? 1 : 0;
        }
    }


    function sendWs() {
      // console.log(file)
      var fileobj = {
        "fileName": file.name,
        "path": ""
      }
      ws.send(JSON.stringify(fileobj));
    }

}
