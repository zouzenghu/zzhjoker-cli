const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const handlebars = require("handlebars");
module.exports = projectName => {
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
      const pakageContent = fs.readFileSync(packagePath, "utf-8");
      const packageResult = handlebars.compile(pakageContent);
    });
};
