/*
r.......Cocos Ga
me..............
af5a0ac6-6c9d-47
........jsb-adap
ter/jsb-builtin.
js......main.js.
*/

const md5File = require('md5-file')
 


var fs = require("fs");
var path = require("path")
var pako = require("pako")
var xxtea = require("xxtea-node");

var FILEPATH = path.resolve('./../cn.isir.jz2/');
var KEY = "18237418234-f3a3-4b"  //cocoscreator 的 工程加密key
var UNZIP = true              //是否启用压缩

//不带后缀的全路径名
function getFullFileNameNoSuffix(fullFileName){
	var fullFileNameNoSuffix = fullFileName.substring(0,fullFileName.lastIndexOf("."));
	return fullFileNameNoSuffix
}

function getFileMD5(filename){
	const hash = md5File.sync(filename)
	console.log(`The MD5 sum of ${filename} is: ${hash}`)
	return hash;
}
function xxteaDecode(filename){
		var data;
		try{
			data =  fs.readFileSync(filename)
		}catch(error){
			console.log("读取文件失败",filename);
            return
		}
        var res = xxtea.decrypt(data,xxtea.toBytes(KEY))
        if(res == null){
            console.log("解密失败")
            return
        }

        if(UNZIP) {
            console.log("开始解压", filename)
            res = pako.ungzip(res)
        }
        var newName = getFullFileNameNoSuffix(filename) + ".js"

		try{
			fs.writeFileSync(newName,res)
		}
		catch(error){
            console.log(newName,"写入出错")
            return
        }
		console.log("写入完毕:",newName)
    
}

function xxteaEncode(filename){
		var data;
		try{
			data =  fs.readFileSync(filename)
		}catch(error){
			console.log("读取文件失败",filename);
            return
		}
        var res;
        if(UNZIP) {
            console.log("开始压缩", filename)
            res = pako.gzip(data,{ level:6})//不同等级压缩前后大小都和之前的不一样
        }else{
			res = data
		}
        res = xxtea.encrypt(res,xxtea.toBytes(KEY))
        if(res == null){
            console.log("加密失败")
            return
        }
        var newName = getFullFileNameNoSuffix(filename) + ".jsc"
        try{
			fs.writeFileSync(newName,res)
		}
		catch(error){
            console.log(newName,"写入出错")
            return
        }
		console.log("写入完毕:",newName)
		//getFileMD5(newName){
}

//文件遍历方法
function fileDisplay(filePath,op){
    //根据文件路径读取文件，返回文件列表
    fs.readdir(filePath,function(err,files){
        if(err){
            console.warn(err)
        }else{
            //遍历读取到的文件列表
            files.forEach(function(filename){
                //获取当前文件的绝对路径
                var filedir = path.join(filePath, filename);
                //根据文件路径获取文件信息，返回一个fs.Stats对象
                fs.stat(filedir,function(eror, stats){
                    if(eror){
                        console.warn('获取文件stats失败');
                    }else{
                        var isFile = stats.isFile();//是文件
                        var isDir = stats.isDirectory();//是文件夹
                        if(isFile){
							var suffix = path.extname(filedir);
							if (suffix == ".jsc" || suffix == ".js" ){
								if (op=="d" && suffix == ".jsc" ){
									console.log(filedir,"解密");
									xxteaDecode(filedir)
									fs.unlinkSync(filedir)
								}
								else if(op=="e" && suffix == ".js"){
									console.log(filedir,"加密");
									xxteaEncode(filedir)
									fs.unlinkSync(filedir)
								}
								else{
									console.log("invalid",filedir)
								}
								
							}
　　　　　　　　　　　　　　
                        }
                        if(isDir){
							//console.log("进入目录:",filedir)
                            fileDisplay(filedir,op);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}

const [node, path0, ...argv] = process.argv;
var op = argv[0]
fileDisplay(FILEPATH,op);
