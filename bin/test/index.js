#!/usr/bin/env node
//处理cmd命令
const program = require("commander");
//处理模板下载
const download = require("download-git-repo");
//处理package.json文件，模板引擎
const handlebars = require("handlebars");
//处理package.json采集信息
const inquirer = require("inquirer");
//读取文件
const fs = require("fs");
//定义仓库地址
const templates = {
  ES6: {
    //仓库地址
    url: "https://github.com/zouzenghu/ES6-template#master",
    //下载地址
    downloadUrl: "https://github.com:zouzenghu/ES6-template#master",
    //文件描述
    description: "ES6模板"
  }
};
//视觉优化包gif
const ora = require("ora");
//视觉美化字体
const chalk = require("chalk");
//视觉美化图标
const logSymbols = require("log-symbols");
//1.获取用户输入命令 process.argv 返回一个数组
//使用commander处理输出参数
//定义 --version|-V命令
program.version("1.0.0"); // -v或者--version的时候输出该版本号

//定义init命令
program
  .command("init <templateName> <projectName>")
  .description("初始化项目模板")
  .action((templateName, projectName) => {
    //根据模板名下载对应的模板到本地，并更改名称为用户指定名称
    //console.log(templateName, projectName);
    //download(仓库地址，name，{clone：true}，err=>{})
    //第一个参数：仓库地址
    //第二个参数：下载路径
    const { downloadUrl } = templates[templateName];
    //图标视觉优化处理
    const spinner = ora("正在下载模板...").start();
    //字体视觉优化处理

    download(downloadUrl, projectName, { clone: true }, err => {
      //下载之前做loading提示
      if (err) {
        //下载失败地提示
        spinner.fail("模板下载失败");
        console.log(logSymbols.error, chalk.red("项目初始化失败"));
      } else {
        //下载成功提示
        //处理package.json文件
        //采集package.json问价所需的值
        //使用模板引擎将用户数据解析到package.json文件中
        //重新写入package.json文件中
        inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "请输入项目名称"
            },
            {
              type: "input",
              name: "description",
              message: "请输入项目简介"
            },
            {
              type: "input",
              name: "version",
              message: "请输入版本号"
            },
            {
              type: "input",
              name: "author",
              message: "请输入作者名称"
            }
          ])
          .then(answers => {
            //将采集到的用户输入的数据answers 解析替换到package.json 文件中
            const packagePath = `${projectName}/package.json`;
            const packageContent = fs.readFileSync(
              //读取package.json文件
              packagePath,
              "utf-8"
            );
            //解析package.json文件
            const packageResult = handlebars.compile(packageContent)(answers);
            //重写package.json文件
            fs.writeFileSync(packagePath, packageResult);
          });
        spinner.succeed("模板下载成功");
        console.log(chalk.green(logSymbols.success, "项目初始化成功"));
      }
    });
  });
//定义list命令
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    for (let key in templates) {
      console.log(`${key}            ${templates[key].description}`);
    }
  });
program.parse(process.argv);
