import * as vscode from "vscode";
import { parseDocument } from "htmlparser2";
import { Element } from "domhandler";
import * as fs from "fs";

const hasEqualInAttribs = (element: Element): boolean => {
  // 检查当前元素的attribs对象
  if (element.attribs) {
    // 如果attribs中有任何属性值不是undefined，说明存在等号
    return Object.values(element.attribs).some((value) => value !== undefined);
  }
  return false;
};

const addDataTestId = (element: Element) => {
  if (element.tagName === "div") {
    element.attribs["data-testid"] = `div-${
      element.attribs["name"] || "default"
    }`;
  }

  if (element.children) {
    element.children.forEach((child: any) => {
      if (child instanceof Element) {
        addDataTestId(child);
      }
    });
  }
};

const render = (dom: any) => {
  // 递归处理每个节点
  const renderNode = (node: any): string => {
    // 如果是文本节点，直接返回文本内容
    if (node.type === "text") {
      return node.data;
    }

    // 如果是元素节点
    if (node.type === "tag") {
      // 处理属性
      let attrs = Object.entries(node.attribs || {})
        .map(([key, value]) => {
          console.log("2222", key, value, typeof value);

          // TODO: 如果为空字符，未必是只有key没有value，临时如此处理
          if (value === "") {
            return `${key}`;
          }
          // 保持原有的属性值,包括空字符串
          return `${key}="${value}"`;
        })
        .join(" ");

      attrs = !!attrs ? ` ${attrs}` : ``;

      // 如果是自闭合标签或只包含空白文本的标签
      if (
        !node.children ||
        // node.children.length === 0 || 如果是0反而不能是自闭合
        (node.children.length === 1 &&
          node.children[0].type === "text" &&
          /^\s*$/.test(node.children[0].data))
      ) {
        return `<${node.name}${attrs}/>`;
      }

      // 处理子节点
      const children = node.children
        .map((child: any) => renderNode(child))
        .join("");

      return `<${node.name}${attrs}>${children}</${node.name}>`;
    }

    return "";
  };

  // 渲染整个文档
  return dom.children.map((child: any) => renderNode(child)).join("");
};

export default (context: vscode.ExtensionContext) => {
  return vscode.commands.registerCommand(
    "code-maker.editor.InjectTestId",
    (res) => {
      // The code you place here will be executed every time your command is executed
      vscode.window.showInformationMessage("editorInjectTestId");
      console.log("editorInjectTestId", res);

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor found.");
        return;
      }

      const document = editor.document;
      if (document.languageId !== "html") {
        vscode.window.showErrorMessage("The active file is not an HTML file.");
        return;
      }

      const htmlContent = document.getText();
      // 添加配置选项以保留大小写
      const dom = parseDocument(htmlContent, {
        lowerCaseAttributeNames: false,
        lowerCaseTags: false,
        decodeEntities: false,
      });

      // 检查DOM中的元素是否包含等号属性
      dom.children.forEach((child: any) => {
        if (child instanceof Element) {
          addDataTestId(child);
        }
      });

      // 使用render()方法将DOM转换为HTML字符串
      const updatedHtml = render(dom);

      fs.writeFileSync(document.uri.fsPath, updatedHtml, "utf8");
      vscode.window.showInformationMessage(
        "Added data-testid to div elements."
      );
    }
  );
};
