# icm

> A Vue.js project

## 技术栈

vue2 + vuex + vue-router + webpack + axios + element-ui

有关联的使用cookie。

### 项目运行

##以下指令都要安装node，如果报错使用  npm i npm -g  升级node。
##以下指令都必须在项目根目录cmd运行指令

## 安装依赖
npm install

## 热加载，开发环境
npm run dev
跑起来会看到这一句（端口被占用另算）： Your application is running here: http://localhost:8080

## 打包
npm run [sit/prd]
生成的文件在dist-[sit/prd]目录下

## 打包&上线
#打包：npm run [sit/prd]

### 注意

#1.根据路由从数据库加载

#4.static文件夹下放静态资源，然后在index.html文件中引入即可使用（这里的引入是全局的）
比如引入自己写的公共方法，第三方插件


## 开发时
#1.修改baseURL.js，配置自己的后台路径
#2.运行 npm run dev

#3.在style标签中引入公共样式文件，在style标签中添加scoped属性，防止变成全局样式。
在style中引入文件只能从当前路径上一级级寻找，或者从@根路径开始查找

#4.在script标签中引入需要的组件、api。
使用import xx from '@/xx'  路径中@代表当前路径是src。等价于import xx from 'src/xx'

#5.template标签下第一个子节点只允许有且只有一个，两个会报错

## 部署发布时

#1.sit发布：项目根目录打开cmd，运行npm run sit
#2.prd发布：项目根目录打开cmd，运行npm run prd

# 项目布局

```
.
├─build										// webpack配置文件  忽略
├─config									// 项目打包配置项  忽略
├─src										// 源码目录
│  ├─base									// 请求的url及网关
│  ├─components								// 第三方组件
│  │  ├─directive							
│  │  ├─downloadUtil
│  │  ├─pager
│  │  ├─player
│  │  ├─public
│  │  └─theme
│  ├─router									// 路由配置
│  ├─store									// 应用状态管理
│  ├─styles									// 公共样式
│  ├─utils									// 工具包
│  └─views									// 前端界面组件
│      ├─admin								// admin模块组件
│      │  ├─api								// 接口API
│      │  └─vue								// 页面组件
│      ├─common								// 公共组件
│      ├─layout								// 主页的布局组件
│      ├─quality							// 质检模块组件
│      │  ├─business						// 质检业务模块
│      │  │  ├─api
│      │  │  └─vue
│      │  └─setting							// 质检设置模块
│      │      ├─api
│      │      └─vue
│      ├─schedule							// 定时调度模块
│      │  ├─api
│      │  └─vue
│      └─softPhone							// 软电话模块
└─static									// 静态资源
│   ├─css
│   ├─framework								// 软电话资源包
│   │  ├─dll
│   │  ├─frame
│   │  └─images
│   └─imgs
└─index.html 									// 入口html文件
.

```


