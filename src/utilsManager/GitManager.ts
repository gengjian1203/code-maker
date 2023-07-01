import * as vscode from "vscode";
import { execSync } from "child_process";

interface IGitManagerAuthResultType {
  username: string | undefined;
  password: string | undefined;
}

interface IGitManagerCloneOptionsType {
  path: string;
  url: string;
}

interface IGitManagerCloneResultType {
  res: any;
  msg: string;
}

interface IGitManagerPullOptionsType {
  path: string;
}

interface IGitManagerPullResultType {
  res: any;
  msg: string;
}

/**
 * git操作管理器
 */
class GitManager {
  static instance: typeof GitManager.prototype | null = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new GitManager();
    }
    return this.instance;
  }
  /**
   * 弹出两个input弹窗，用来输入账号密码
   */
  async auth(): Promise<IGitManagerAuthResultType> {
    const optionsUsername = {
      placeHolder: "请输入用户名称: ",
    };
    const optionsPassword = {
      placeHolder: "请输入用户密码: ",
      password: true,
    };
    return new Promise((resolve, reject) => {
      const result: IGitManagerAuthResultType = {
        username: "",
        password: "",
      };
      vscode.window.showInputBox(optionsUsername).then((valueUsername) => {
        result.username = valueUsername;
        if (valueUsername) {
          vscode.window.showInputBox(optionsPassword).then((valuePassword) => {
            result.password = valuePassword;
            if (valuePassword) {
              resolve(result);
            } else {
              resolve(result);
            }
          });
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * 执行git clone操作，兼容如果没有权限则重新输入账号密码
   * @param options.path 本地要存放该仓库的绝对路径 E:\ProjectGit\code-maker\tpl
   * @param options.url 远程仓库的url https://gitee.com/gengjian1203/code-template.git
   */
  async clone(
    options: IGitManagerCloneOptionsType
  ): Promise<IGitManagerCloneResultType> {
    const { path, url } = options;
    return new Promise(async (resolve, reject) => {
      try {
        const cmdGitClone = `git clone ${url}`;
        const resGitClone = execSync(cmdGitClone, {
          stdio: "pipe", //
          encoding: "utf-8",
          cwd: path,
        });
        resolve({
          res: true,
          msg: `模板仓库克隆成功`,
        });
      } catch (errGitClone) {
        const strErrGitClone = JSON.stringify(errGitClone);
        if (strErrGitClone.includes("Username")) {
          // 授权报错，重新输入账号密码重新再用账号密码拉取一次
          // Cloning into 'e:\ProjectGit\code-maker/tpl'... bash: line 1: /dev/tty: No such device or address error: failed to execute prompt script (exit code 1) fatal: could not read Username for 'http://git.xxxxxx.com': No such file or directory
          const resAuth = await this.auth();
          const { username, password } = resAuth;
          const gitTemplateUrlAuth = url.replace(
            "://",
            `://${encodeURIComponent(String(username))}` +
              `:${encodeURIComponent(String(password))}@`
          );
          console.log("gitTemplateUrlAuth", gitTemplateUrlAuth);

          try {
            const cmdGitCloneAuth = `git clone ${gitTemplateUrlAuth}`;
            console.log("cmdGitCloneAuth", cmdGitCloneAuth, path);
            const resGitCloneAuth = execSync(cmdGitCloneAuth, {
              stdio: "pipe", //
              encoding: "utf-8",
              cwd: path,
            });
            console.log("cmdGitCloneAuth2", resGitCloneAuth);
            resolve({
              res: true,
              msg: `模板仓库授权克隆成功`,
            });
          } catch (errGitCloneAuth) {
            const strErrGitCloneAuth = JSON.stringify(errGitCloneAuth);
            resolve({
              res: null,
              msg: `模板仓库授权克隆失败${strErrGitCloneAuth}`,
            });
          }
        } else {
          resolve({
            res: null,
            msg: `模板仓库克隆失败${strErrGitClone}`,
          });
        }
      }
    });
  }

  /**
   * 执行git pull操作，兼容如果没有权限则重新输入账号密码
   * @param options.path 本地要存放该仓库的绝对路径 E:\ProjectGit\code-maker\tpl
   */
  async pull(
    options: IGitManagerPullOptionsType
  ): Promise<IGitManagerPullResultType> {
    const { path } = options;
    return new Promise(async (resolve, reject) => {
      try {
        const cmdGitPull = `git pull`;
        const resGitPull = execSync(cmdGitPull, {
          stdio: "pipe", //
          encoding: "utf-8",
          cwd: path,
        });
        resolve({
          res: true,
          msg: `模板仓库更新成功`,
        });
      } catch (errGitPull) {
        const strErrGitPull = JSON.stringify(errGitPull);
        if (strErrGitPull.includes("Abort")) {
          // 本地模板仓库代码有修改，将其强制更新
          const cmdGitPullForce = `git reset --hard origin/$(git rev-parse --abbrev-ref HEAD) && git pull origin $(git rev-parse --abbrev-ref HEAD) --force`;
          try {
            const resGitPullForce = execSync(cmdGitPullForce, {
              stdio: "pipe", //
              encoding: "utf-8",
              cwd: path,
            });
            resolve({
              res: true,
              msg: `模板仓库强制更新成功`,
            });
          } catch (errGitPullForce) {
            const strErrGitPullForce = JSON.stringify(errGitPullForce);
            resolve({
              res: null,
              msg: `模板仓库强制更新失败${strErrGitPullForce}`,
            });
          }
        } else {
          resolve({
            res: null,
            msg: `模板仓库更新失败${strErrGitPull}`,
          });
        }
      }
    });
  }
}

export default GitManager.getInstance();
