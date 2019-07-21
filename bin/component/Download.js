const location = require("./location");
const download = require("download-git-repo");
const ora = require("ora");
const chalk = require("chalk");
const analysis = require("./analysis");
module.exports = (templateName, projectName) => {
  console.log(templateName, projectName);
  const { downloadUrl } = location[templateName];
  const spinner = ora(chalk.blue("正在下载模板...")).start();
  download(downloadUrl, projectName, { clone: true }, err => {
    if (err) {
      spinner.fail(chalk.red("模板下载失败"));
      return;
    }
    analysis(projectName);
    spinner.succeed(chalk.green("模板下载成功"));
  });
};
