main.js 是一个入口 我们的spa应用就是这一个入口

异步引用了page1和page2 

当page2中有和main.js相同的模块 时 放到了main.js中

当page2和page1 两个异步的js 中有相同的模块 就分别打到各自的文件中 这就浪费了
虽然installedModule 保证了 同一个模块 不会重复加载 但是文件体积是浪费了


说明当异步的模块引用的过大就会提取 小模块不提取
当我在page1和page2中 引入vue时 自动生成了vendors~page1~page2.js模块
在引入page1的时候记录了vendors~page1~page2.js这个依赖  这个依赖加载了才会引入

官方的说明也是默认只提取异步chunk
```
var page = 'main'
const page1 = Promise.all(/*! import() | page1 */[__webpack_require__.e("vendors~page1~page2"), __webpack_require__.e("page1")]).then(__webpack_require__.t.bind(null, /*! ./page1.js */ "./page1.js", 7))
const page2 = Promise.all(/*! import() | page2 */[__webpack_require__.e("vendors~page1~page2"), __webpack_require__.e("page2")]).then(__webpack_require__.t.bind(null, /*! ./page2.js */ "./page2.js", 7))
const cookies = __webpack_require__(/*! js-cookie */ "../node_modules/js-cookie/src/js.cookie.js")
const com1 = __webpack_require__(/*! ./com1 */ "./com1.js")



1 添加
```
  runtimeChunk: {
      name: "manifest"
  }
```
是为了 把manifest 异步加载的文件的名称分离 让主入口缓存
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + ({"vendors~page1~page2":"vendors~page1~page2","page1":"page1","page2":"page2"}[chunkId]||chunkId) + ".js"
/******/ 	}
```
分离前main.js中执行入口

/******/ 	return __webpack_require__(__webpack_require__.s = "./main.js");

分离后需要 等待需要的chunk加载完成
```
 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
```
main.js中第三个参数
```
[["./main.js","manifest","vendor"]]
```
第一个代表入口。后两个代表必须要加载的chunk


2  splitChunks node_modules中的依赖 不怎么改动 应该是 异步和同步的都打包到vendor中
加了 node_modules的vendor之后 发现如果同步的入口中没有node_modules的依赖时 这个vendor就是异步加载的，如果同步的入口main中也依赖了  则vendor是同步的。

 引用异步chunk的时候也有记录是要依赖这个vendor的chunk
```
splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          name: "vendor",
          priority: 10,
        },
```
所以抽离的公共的chunk是异步还是同步 取决于依赖它chunk是同步还是异步，
如果异步chunk和同步chunk共用则放到同步chunk。


common 最后还是只提取了异步chunk中的公用部分 没有提取同步入口中的

