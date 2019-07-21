### cli 脚手架工具

- 什么是脚手架工具

* 脚手架工具是帮我们快速构建项目的一种方式，可以将我们构建项目时常用的一些项目模板放在 github 上，再通过脚手架工具下载，方便多人协作不需要将一些基础的项目模板传来传去，减少重复性工作，不需要复制其他项目删除无关代码，或者从零创建一个项目和文件。

### 构建 cli 脚手架工具

1. 初始化 package.json 文件

```javascript
    npm init -y
```

2. 在 package.json 文件中声明命令

```json
"bin": {
    "itcast": "./bin/index.js"
  },
```

3. 将命令映射到全局中

```javascript
    //将命令映射到全局中
    npm link
    //将命令解绑，每次重复映射命令前需要将命令解绑一次
    npm unlink
```

### 命令处理

```javascript
//使用commander第三方包处理
#!/usr/bin/env node
//处理命令指令 init -v --help list
const program = require("commander");
//处理下载模块
const Download = require("./component/Download");
//保存模板地址模块
const location = require("./component/location");
//视觉字体颜色美化包
const chalk = require("chalk");
//-V --version命令处理
program.version("1.0.0").description("脚手架版本号");
//init命令  <必填>
program
  .command("init <templateName> <projectName>")//命令规则
  .description("初始化项目模板")//命令描述
  .action((templateName, projectName) => {//命令回调
    //调用下载模块处理模板下载
    Download(templateName, projectName);
  });
  //list命令
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    //将location中所有模板打印出来
    for (let key in location) {
      console.log(
        `可用模板：${chalk.blue(key)}      模板简介：${chalk.blue(
          location[key].description
        )}`
      );
    }
  });
//在控制台上输出
program.parse(process.argv);

```

### 通过命令下载对应模板

```javascript
//引入保存模板地址的location对象
const location = require("./location");
//第三方包处理git下载
const download = require("download-git-repo");
//第三方包gif视觉美化
const ora = require("ora");
//第三方包字体美化
const chalk = require("chalk");
//采集信息模块
const analysis = require("./analysis");
module.exports = (templateName, projectName) => {
  const { downloadUrl } = location[templateName];
  //启动gif
  const spinner = ora(chalk.blue("正在下载模板...")).start();
  /*
    第一个参数：下载地址
    第二个参数：项目新建名称
    第三个参数：是否完全克隆
    第四个参数：成功或失败回调，err有值则失败
  */
  download(downloadUrl, projectName, { clone: true }, err => {
    if (err) {
      //下载成功提示
      spinner.fail(chalk.red("模板下载失败"));
      return;
    }
    analysis(projectName);
    //下载失败提示
    spinner.succeed(chalk.green("模板下载成功"));
  });
};

//location对象
module.exports = {
  webpack: {
    url: "https://github.com/zouzenghu/ES6-template",
    downloadUrl: "https://github.com:zouzenghu/ES6-template#master",
    description: "webpack——ES6配置"
  }
};
```

### 采集 package.json 数据

```javascript
//第三方包采集信息prompt
const inquirer = require("inquirer");
//第三方字体视觉优化包
const chalk = require("chalk");
//文件处理包
const fs = require("fs");
//第三方包解析package.json文件包
const handlebars = require("handlebars");
module.exports = projectName => {
  //采集package.json文价所需的值
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: chalk.yellow("请输入项目名称")
      },
      {
        type: "input",
        name: "description",
        message: chalk.yellow("请输入项目简介")
      },
      {
        type: "input",
        name: "version",
        message: chalk.yellow("请输入版本号")
      },
      {
        type: "input",
        name: "author",
        message: chalk.yellow("请输入项目作者")
      }
    ])
    .then(answers => {
      const packagePath = `${projectName}/package.json`;
      //处理package.json文件
      const pakageContent = fs.readFileSync(packagePath, "utf-8");
      //使用模板引擎将用户数据解析到package.json文件中
      //重新写入package.json文件中
      const packageResult = handlebars.compile(pakageContent);
    });
};
```

### 打包上传到 package.json 市场

```javascript
npm install cli --global//使用
```
