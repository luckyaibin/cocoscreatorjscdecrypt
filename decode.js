var fs = require("fs");
var path = require("path")
var pako = require("pako")
var xxtea = require("xxtea-node");

var FILEPATH = path.resolve('./../');
var KEY = "xxxxxxxx-xxxx-xx"  //cocoscreator 的 工程加密key
var UNZIP = true                //是否启用压缩

function xxteaDecode(filename){
    fs.readFile(filename,function(error,data){
        if(error){
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
            res = pako.inflate(res)
        }
        var newName = filename + ".js"

        fs.writeFile(newName,res,function(error){
            if(error!=null){
                console.log(newName,"写入出错")
                return
            }
            console.log("写入完毕:",newName)
        })
    })
}

//文件遍历方法
function fileDisplay(filePath){
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

							if (path.extname(filedir) == ".jsc"){
							    console.log(filedir);
								xxteaDecode(filedir)
								// 读取文件内容
								//var content = fs.readFileSync(filedir, 'utf-8');
								//console.log(content);
							}
　　　　　　　　　　　　　　
                        }
                        if(isDir){
							console.log("进入目录:",filedir)
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                        }
                    }
                })
            });
        }
    });
}



//调用文件遍历方法
fileDisplay(FILEPATH);
