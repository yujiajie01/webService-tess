
"use strict";
const soap = require('soap');
const fs = require('fs');
// 引入工具模块
var ProgressBar = require('./untils/progress_bar');
var async = require('async');
let url ='http://fy.webxml.com.cn/webservices/EnglishChinese.asmx?wsdl';
let data

function readFile(cb) {
    console.log("读取写入的数据！");
    fs.readFile(__dirname + '../io/Translate.txt', function (err, data) {
        if (err) {
            //console.error(err);
            cb(true,err)
            return 
        }
        console.log("异步读取文件数据: " + data.toString());
        cb(false,data.toString())
        return
    });
}

function Translate(){
    readFile(function(err,msg){
        if(err){
            console.error("err",err)
            console.error("msg",msg)
        }
        data=msg



        
    })
}

// module.exports= {Translate : Translate,}
module.exports=Translate