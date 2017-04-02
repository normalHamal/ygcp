# 阳光长跑爬虫项目

虽然阳光长跑官网上可以查询到数据，但是觉得在移动端展示效果不是很好， 刚好最近学习了vue.js
于是利用vux(一个UI框架用来展示) + nodejs(用来爬取数据并返回) 做了个小demo

## Demo

app下载链接 [阳光长跑](http://omsiv11v3.bkt.clouddn.com/ygcp.apk)
(密码为学号，如果你没去官网改过的话)

## 更新

### 2017.4.1

* 增加查看长跑详细信息功能

## 运行在自己的本地服务器

*首先确保你安装了node(最好版本是6.x以上, 因为我的代码依赖一些es6的特性，版本低可能会导致一些错误)

1. Clone or download
```
git clone https://github.com/normalHamal/ygcp
```
2. 安装依赖
```
//要是直接npm安装会出现下面的警告 (警告可以忽略, 不是error就行)
//fsevents 只支持 Darwin, Darwin 是MacOSX操作环境的操作系统成份 在windows上可以无视
//node-zopfli是一个用来压缩的模块 直接用npm安装会失败 最好加上淘宝的registry
npm i --registry=https://registry.npm.taobao.org
```
![Markdown](http://omsiv11v3.bkt.clouddn.com/error.PNG)

3. 打包生产环境 (调试环境可以直接跳过)
```
npm run build
```
3. 运行起来
```
npm run start or (node ./server/app)
```
4. 浏览器查看运行结果
```
open localhost:3000(生产环境)

//先运行
npm run dev
open localhost:8080(调试环境)
```
## 效果图展示

![Markdown](http://omsiv11v3.bkt.clouddn.com/O9%60KTIFNGI%5B%5DJW4PWR4%28%60FS.png)

搜索他人(只能搜到那些没改初始密码的人) <br>
![Markdown](http://omsiv11v3.bkt.clouddn.com/G4ZG$LU2M9F4DO6J%5B%60EPGDE.png)

![Markdown](http://omsiv11v3.bkt.clouddn.com/Z6%7D62~0@J%29L%28%5BIT%600C2%5DLQN.png)

长跑成绩(分上午和下午查看) <br>
![Markdown](http://omsiv11v3.bkt.clouddn.com/ygcp.PNG)