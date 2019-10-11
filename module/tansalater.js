"use strict";
const soap = require('soap');
const fs = require('fs');
// 引入工具模块
var ProgressBar = require('../untils/progress_bar');
var async = require('async');
let url = 'http://fy.webxml.com.cn/webservices/EnglishChinese.asmx?wsdl';
let data

function readFile(cb) {
    console.log("读取写入的数据！");
    fs.readFile('./io/Translate.txt', function (err, data) {
        if (err) {
            //console.error(err);
            cb(true, err)
            return
        }
        console.log("异步读取文件数据: " + data.toString());
        cb(false, data.toString())
        return
    });
}

function Translate(cb) {
    readFile(function (err, msg) {
        if (err) {
            console.error("err", err)
            console.error("msg", msg)
            return
        }
        data = {
            wordKey: msg.toString()
        }
        console.log("data", data)
        soap.createClient(url, function (err, client) {
            if (err) {
                console.log('createClient-err', err)
            }
            // client.Translator(data, function (err, result) {
            client.Translator(data, function (err, result) {
                if (err) {
                    console.log('Translator-err', err);
                } else {
                    console.log("Translator-schema", result.TranslatorResult)
                    Temp = result.TranslatorResult.string
                    let x
                    for (let i = 0; i < Temp.length; ++i) {
                        x = Temp[i]
                        //console.log("x", x)
                        //writeFile(x);
                    }
                    Temp = null
                    cb(false)


                }
            });
        });




    })
}

// module.exports= {Translate : Translate,}
module.exports = {
    Translate: Translate,
}