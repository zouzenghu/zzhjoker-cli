#!/usr/bin/env node
const program = require("commander");
const Download = require("./component/Download");
const location = require("./component/location");
const chalk = require("chalk");
program.version("1.0.0").description("脚手架版本号");
program
  .command("init <templateName> <projectName>")
  .description("初始化项目模板")
  .action((templateName, projectName) => {
    Download(templateName, projectName);
  });
program
  .command("list")
  .description("查看所有可用模板")
  .action(() => {
    for (let key in location) {
      console.log(
        `可用模板：${chalk.blue(key)}      模板简介：${chalk.blue(
          location[key].description
        )}`
      );
    }
  });
program.parse(process.argv);
