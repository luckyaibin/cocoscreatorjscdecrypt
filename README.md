# cocoscreatorjscdecrypt
cocoscreator官方在编译的时候只给了加密的方法，而生成jsc之后没有进行解密的，这里给出一个开箱即用的方法。
1. 安装nodejs
2. npm install xxtea-node
   npm install pako
3. 修改 cocoscreator加密时候的KEY，是否压缩UNZIP，jsc所在的目录（会递归所有子目录，jsc文件后缀进行解密）
4. 执行 node decrypt.js 即可获得
