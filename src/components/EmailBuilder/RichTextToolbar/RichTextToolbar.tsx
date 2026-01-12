import React from 'react';
import './RichTextToolbar.css';

interface RichTextToolbarProps {
  toolbarId: string;
  editorId: string;
}

/**
 * 富文本工具栏组件
 * 使用 Quill 的分离工具栏模式，工具栏和编辑器通过 ID 连接
 * Quill 会在初始化编辑器时自动生成工具栏 HTML 结构
 * 这里提供一个容器，Quill 会根据 toolbarId 找到并填充它
 */
export const RichTextToolbar: React.FC<RichTextToolbarProps> = ({ toolbarId }) => {
  return (
    <div className="rich-text-toolbar-container">
      {/* Quill 会自动在这个容器中生成工具栏 HTML */}
      <div id={toolbarId} className="ql-toolbar ql-snow">
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="">Normal</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" type="button"></button>
          <button className="ql-italic" type="button"></button>
          <button className="ql-underline" type="button"></button>
          <button className="ql-strike" type="button"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-color" type="button"></button>
          <button className="ql-background" type="button"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" type="button"></button>
          <button className="ql-list" value="bullet" type="button"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-align" defaultValue="">
            <option value=""></option>
            <option value="center"></option>
            <option value="right"></option>
            <option value="justify"></option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-link" type="button"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean" type="button"></button>
        </span>
      </div>
    </div>
  );
};
