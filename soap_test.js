"use strict";
const soap = require('soap');
const fs = require('fs');
// 引入工具模块
var ProgressBar = require('./untils/progress_bar');
var async = require('async');

// 初始化一个进度条长度为 50 的 ProgressBar 实例
var pb = new ProgressBar('写入中', 50);
// 这里只是一个 pb 的使用示例，不包含任何功能
var num = 0,
    total = 34;

let pTimes = 0;
let Temp
let flag = false;
let Province
// var url = 'http://ws.webxml.com.cn/WebServices/WeatherWS.asmx?wsdl';
var url = 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?wsdl';






function testHttp(cb) {

    let Provinces = ['北京', '天津', '上海', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南',
        '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '广西', '西藏', '宁夏', '新疆', '香港', '澳门'
    ]

    Province = Provinces[pTimes]
    //console.log("Province: ", Province)
    // var url = 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?wsdl';


    var args = {
        byProvinceName: Province
    };

    pTimes++;
    //console.log("pTimes", pTimes)
    if (pTimes == 1) {
        deleteFile()
    }
    switchFunction("getSupportCity", args, function (flag) {
        if (flag) cb(flag)
    });

    // soap.createClient(url, function (err, client) {
    //     if (err) {
    //         console.log('createClient-err', err)
    //     }
    //     client.getSupportCity(args, function (err, result) {
    //         if (err) {
    //             console.log('getSupportCity-err', err);

    //         } else {
    //             //console.log("getSupportCity-result", result);
    //             Temp = result.getSupportCityResult.string
    //             //console.log("Temp", Temp)
    //             writeFilex(Temp);
    //             if (pTimes == 34) {
    //                 flag = true;
    //                 Temp = []
    //             }
    //             cb(flag)
    //         }

    //     });

    // });

}


function writeFilex(Temp) {

    //console.log("准备写入文件");
    if (flag) {
        cb(flag)
        return
    }
    //let options={encoding:'utf8', mode:'0666', flag}

    //fs.appendFile  writeFile
    fs.appendFile(__dirname + '/io/Provinces.txt', '\n' + Province + '\n' + Temp.toString() + '\n', function (err) {
        if (err) {
            return console.error(err);
        }
        //console.log("数据写入成功！");
        //console.log("--------我是分割线-------------")


    });
}

function writeFile(Temp) {

    //console.log("准备写入文件");

    //let options={encoding:'utf8', mode:'0666', flag}

    //fs.appendFile  writeFile
    fs.appendFile(__dirname + '/io/Weather.txt', '\n' + Temp.toString() + '\n', function (err) {
        if (err) {
            return console.error(err);
        }
        //console.log("数据写入成功！");
        //console.log("--------我是分割线-------------")


    });
}

function readFilex() {
    console.log("读取写入的数据！");
    fs.readFile(__dirname + '/io/Provinces.txt', function (err, data) {
        if (err) {
            return console.error(err);
        }
        console.log("异步读取文件数据: " + data.toString());
    });
}

function deleteFile() {
    //console.log("准备删除文件！");
    fs.unlink(__dirname + '/io/Provinces.txt', function (err) {
        if (err) {
            return console.error(err);
        }
        //console.log("文件删除成功！");
        // test()
        downloading();
    });
}

function deleteFileWeather() {
    //console.log("准备删除文件！");
    fs.unlink(__dirname + '/io/Weather.txt', function (err) {
        if (err) {
            return console.error(err);
        }
        //console.log("文件删除成功！");
    });
}

/**    ------------------------------------             switch function                 ---------------------------------------------------         */
function switchFunction(functionName, params, cb) {
    let tag = Math.random.toString()
    //console.log("ready run " + tag + "function")
    soap.createClient(url, function (err, client) {
        if (err) {
            console.log('createClient-err', err)
        }
        
        switch (functionName) {
            case ("getSupportCity"):
                client.getSupportCity(params, function (err, result) {
                    if (err) {
                        console.log('getSupportCity-err', err);
                    } else {
                        //console.log("getSupportCity-result", result);
                        Temp = result.getSupportCityResult.string
                        let x = []
                        for (let i = 0; i < Temp.length; ++i) {
                            x.push(Temp[i])
                            //console.log("x", x)                            
                        }
                        writeFilex(x);
                        if (pTimes == 34) {
                            flag = true;
                            Temp = []
                            x = []
                        }
                        cb(flag)
                    }
                });
                break;
            case ("getWeather"):
                deleteFileWeather()
                client.getWeatherbyCityName(functionName, function (err, result) {
                    if (err) {
                        console.log('getWeatherbyCityName-err', err);
                    } else {
                        //console.log("getSupportCity-result", result);
                        Temp = result.getWeatherbyCityNameResult.string
                        let x
                        for (let i = 0; i < Temp.length; ++i) {
                            x = Temp[i]
                            //console.log("x", x)
                            writeFile(x);
                        }
                        Temp = null
                        cb(false)


                    }
                });
                break;
            default:
                console.error("Not support this fucking WebSerice function!");
                cb(true, "Not support this fucking WebSerice function")
                break

        }



    });
}

/**    ------------------------------------             do function                 ---------------------------------------------------         */
/**    ------------------------------------             getWeatherby city                 ---------------------------------------------------         */
function getWeatherbyCity(city) {
    switchFunction("getWeather", city, function (err, msg) {
        if (err) {
            console.log("err" + err)
            console.log(msg)
            return
        }
        //console.log("getWeather good")
        return

    });


}
/**    ------------------------------------             getWeatherby city                 ---------------------------------------------------         */



/**    ------------------------------------             Test                 ---------------------------------------------------         */
//测试webservice
// const testHttp = require("./modules/vessel/soap_test");
let timera
let timerb
console.log('main engine start')
function b() {
    let cb = function (flag, record1) {
        //console.log("b-flag", flag)
        if (flag) {
            readFilex()
            //console.log("======================停止===========================\n....\n...\n..\n.")
            clearInterval(timera)
        }
    }
    testHttp(cb);
    // getWeatherbyCity("深圳");
}

function c() {
    let cb = function (flag, record1) {

        //console.log("======================停止===========================\n....\n...\n..\n.")

    }

    //testHttp(cb);
    getWeatherbyCity("深圳", cb);
}







const pollOcr = function () {
    b();
};
const pollOcrx = function () {
    c();
};
timera = setInterval(pollOcr, 500); ///time>500




async function test() {
    console.log('main engine start')
    await sleep(3000)
    console.log('3s之后')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}




function downloading() {
    if (num <= total) {
        // 更新进度条
        pb.render({
            completed: num,
            total: total
        });

        num++;
        setTimeout(function () {
            downloading();
        }, 455)
    }
}


timerb = setTimeout(pollOcrx, 1); ///time>500

/**    ------------------------------------             Test                 ---------------------------------------------------         */
module.exports = {
    testHttp: testHttp,
    readFilex: readFilex
};