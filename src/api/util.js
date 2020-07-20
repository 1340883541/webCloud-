
import {Message} from 'element-ui';
import domain from '../api/domain.js';
import axios from "axios";
var Dialog ={
  message: function (message, type, duration) {
    if (document.getElementsByClassName('el-message').length === 0) {
      if (type == 'error') {
        Message.error({
          message: message,
          type: type,
          duration: duration ? duration : 3000
        })
      }
      if (type == 'success') {
        Message.success({
          message: message,
          type: type,
          duration: duration ? duration : 3000
        })
      }
      if (type == 'warning') {
        Message.warning({
          message: message,
          type: type,
          duration: duration ? duration : 3000
        })
      }
    }
  }
}
//数组去重set
function unique(arr) {
  return Array.from(new Set(arr))
}
//设置cookie
function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString()); 
}
//获取cookie
function getCookie(c_name){
if (document.cookie.length>0)//首先查询cookie是否是空的
  {
   var c_start=document.cookie.indexOf(c_name + "=")//检测这个cookie是否存在
  if (c_start!=-1)//如果cookie存在
    { 
    c_start=c_start + c_name.length+1 //获取到cookie的值的开始位置
    var  c_end=document.cookie.indexOf(";",c_start)//从c_start开始查找";"的存在
    if (c_end==-1) c_end=document.cookie.length//如果没找到，说明是最后一项
    return unescape(document.cookie.substring(c_start,c_end))//把cookie的值拆分出来并且对这个值进行解码，unescape()与escape()相对，对被escape()编码的字符串进行解码
    } 
  }
return ""//不存在就返回空
}

function myBrowser(){
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
      return "Opera"
  }; //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
      return "FF";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1){
return "Chrome";
}
  if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
  } //判断是否Safari浏览器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
      return "IE";
  }; //判断是否IE浏览器
}
var api = {
   g_size:5368709120*2,
   domain:domain
} ; 

export {
  Dialog,
  unique,
  myBrowser,
  api,
  setCookie,
  getCookie
}