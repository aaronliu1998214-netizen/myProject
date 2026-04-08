const getLastRangeHandle = (range: Range) => {
  range.collapse(true);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  return range;
};

/**
 * 创建文本节点
 * @param text 节点内容
 * @returns
 */
const createTextNodeHandle = (text: string) => document.createTextNode(text);

/**
 * 创建换行
 * @returns
 */
const makeBreakElement = () => document.createElement('br');

const makeEditorElement = ({ text,code }: { text: string,code:any }) => {
  const editorElement = document.createElement('span');
  editorElement.innerText = text;
  editorElement.style.display = 'inline-block';
  editorElement.contentEditable = 'false';
  editorElement.style.backgroundColor = '#e6f4ff';
  editorElement.style.color = '#1677ff';
  editorElement.style.border = '1px solid #91caff';
  editorElement.style.padding = '2px 8px';
  editorElement.setAttribute('data-editor-id', code);
  return editorElement;
};

/**
 * 生成表达式
 * @param textArr 文本内容数组
 * @param range
 */
const createExpressionHandle = (textArr: string[] | string, range: Range) => {
  if (textArr && Array.isArray(textArr)) {
    textArr.forEach((text, index) => {
      const textNode = createTextNodeHandle(text);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      if (index < textArr.length - 1) {
        const brElement = makeBreakElement();
        range.insertNode(brElement);
        range.setStartAfter(brElement);
      }
    });
  } else {
    const textNode = createTextNodeHandle(textArr);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
  }

  return range;
};

/**
 * 设置公式内容方法
 * @param content 公式文本
 * @returns
 */
const setEditorContent = (content: string) => {
  const editBox = document.getElementById('smart-home-edit-box') as HTMLDivElement;
  const exampleBox = document.getElementById('smart-home-example-box') as HTMLDivElement;
  if (!editBox) return;
  editBox.innerHTML = content;
  exampleBox.innerHTML = '';
};

/**
 * 设置样例内容
 * @param content 样例文本
 * @returns
 */
const setExampleContent = (content: string) => {
  const exampleBox = document.getElementById('smart-home-example-box') as HTMLDivElement;
  if (!exampleBox) return;
  exampleBox.innerHTML = content;
};

export {
  getLastRangeHandle,
  createTextNodeHandle,
  makeBreakElement,
  makeEditorElement,
  createExpressionHandle,
  setEditorContent,
  setExampleContent,
};
