# umi project

## Getting Started

Install dependencies,

```bash
$ yarn
```

Start the dev server,

```bash
$ yarn start
```
├── README.md 
├── config                         ## 文件配置
│   └── config.router.js           ## 路由配置
├── mock                           
├── package.json 
├── src                            ## 主文件
│   ├── App.js                     ## 项目入口
│   ├── components                 ## 公共组件
│   │   ├── header
│   │   │   ├── index.js
│   │   │   └── index.less
│   │   └── nav
│   │       ├── index.js
│   │       └── index.less
│   ├── global.less                ## 全局样式
│   ├── layouts                    ## 页面布局
│   │   ├── index.js
│   │   └── index.less
│   └── pages                      ## 业务页面
│       ├── Calendar               ## 招聘日历
│       │   ├── components         ## 招聘日历组件
│       │   │   └── test.js
│       │   ├── index.js          
│       │   ├── models             ## models
│       │   │   ├── index.js
│       │   │   └── server.js
│       │   └── style              ## css样式
│       │       └── test.less
│       ├── Candidate              ## 候选人
│       │   ├── components
│       │   │   └── test.js
│       │   ├── index.js
│       │   ├── models
│       │   │   ├── index.js
│       │   │   └── server.js
│       │   └── style
│       │       └── test.less
│       ├── Increment              ## 增值服务
│       │   ├── components
│       │   │   └── test.js
│       │   ├── index.js
│       │   ├── models
│       │   │   ├── index.js
│       │   │   └── server.js
│       │   └── style
│       │       └── test.less
│       ├── Journaling            ## 统计报表
│       │   ├── components
│       │   │   └── test.js
│       │   ├── index.js
│       │   ├── models
│       │   │   ├── index.js
│       │   │   └── server.js
│       │   └── style
│       │       └── test.less
│       ├── Recruitment          ## 招聘岗位
│       │   ├── components
│       │   │   └── test.js
│       │   ├── index.js
│       │   ├── models
│       │   │   ├── index.js
│       │   │   └── server.js
│       │   └── style
│       │       └── test.less
│       ├── Talenter             ##人才库
│       │   ├── components
│       │   │   └── test.js
│       │   ├── index.js
│       │   ├── models
│       │   │   ├── index.js
│       │   │   └── server.js
│       │   └── style
│       │       └── test.less
│       └── WorkPlatform           ##工作台
│           ├── components
│           │   └── index.js
│           ├── index.js
│           ├── models
│           │   ├── index.js
│           │   └── server.js
│           └── style
│               └── test.less
├── tsconfig.json
├── typings.d.ts
└── yarn.lock
