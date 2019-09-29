"use strict";
const soap = require('soap');
const fs = require('fs');
let pTimes = 0;
let Temp = [];
let flag = false;
let Province

function testHttp(cb) {

    let Provinces = ['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
        '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
    ]

    Province = Provinces[pTimes]
    console.log("Province: ", Province)

    var url = 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?wsdl';
    var args = {
        byProvinceName: Province
    };

    pTimes++;
    //console.log("pTimes", pTimes)
    if (pTimes == 1) {
        deleteFile()
    }
    soap.createClient(url, function (err, client) {
        if (err) {
            console.log('createClient-err', err)
        }
        client.getSupportCity(args, function (err, result) {
            if (err) {
                console.log('getSupportCity-err', err);

            } else {
                //console.log("getSupportCity-result", result);
                Temp = result.getSupportCityResult.string
                //console.log("Temp", Temp)
                writeFilex(Temp);
                if (pTimes == 34) {
                    flag = true;
                    Temp = []
                }
                cb(flag)
            }

        });

    });

}


function writeFilex(Temp) {

    console.log("准备写入文件");
    if (flag) {
        cb(flag)
        return
    }
    //let options={encoding:'utf8', mode:'0666', flag}

    //fs.appendFile  writeFile
    fs.appendFile('Provinces.txt', '\n' + Province + '\n' + Temp.toString() + '\n', function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("数据写入成功！");
        //console.log("--------我是分割线-------------")


    });
}

function readFilex() {
    console.log("读取写入的数据！");
    fs.readFile('Provinces.txt', function (err, data) {
        if (err) {
            return console.error(err);
        }
        console.log("异步读取文件数据: " + data.toString());
    });
}

function deleteFile() {
    console.log("准备删除文件！");
    fs.unlink('Provinces.txt', function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("文件删除成功！");
    });
}
/**    ------------------------------------             Test                 ---------------------------------------------------         */
//测试webservice
// const testHttp = require("./modules/vessel/soap_test");
let timer

function b() {
    let cb = function (flag, record1) {
        //console.log("b-flag", flag)
        if (flag) {
            testHttp.readFilex()
            console.log("======================停止===========================\n....\n...\n..\n.")
            clearInterval(timer)
        }
    }
    testHttp(cb);
}
const pollOcr = function () {
    b();
};
timer = setInterval(pollOcr, 500);  ///time>500

/**    ------------------------------------             Test                 ---------------------------------------------------         */
module.exports = {
    testHttp: testHttp,
    readFilex: readFilex
};