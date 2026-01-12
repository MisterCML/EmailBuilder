import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import type { EmailElement } from '../../../types/email.types';
import { convertToEmailCompatibleHTML } from '../../../utils/emailCompatibility';
import './TextElement.css';

interface TextElementProps {
  element: EmailElement;
  isSelected: boolean;
  onUpdate: (updates: Partial<EmailElement>) => void;
}

export const TextElement: React.FC<TextElementProps> = ({ 
  element, 
  isSelected, 
  onUpdate
}) => {
  const content = element.content as { html: string };
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const toolbarId = isSelected ? `rich-text-toolbar-${element.id}` : undefined;
  const editorId = `text-editor-${element.id}`;

  // 初始化 Quill 编辑器
  useEffect(() => {
    if (editorRef.current && isSelected && !quillRef.current) {
      // 如果使用外部工具栏，等待工具栏元素存在
      const initQuill = () => {
        if (toolbarId) {
          const toolbarElement = document.getElementById(toolbarId);
          if (!toolbarElement) {
            // 工具栏还未渲染，延迟重试
            setTimeout(initQuill, 50);
            return;
          }
        }

        const modules: any = {
          toolbar: toolbarId ? `#${toolbarId}` : false,
        };

        quillRef.current = new Quill(editorRef.current!, {
          modules,
          theme: 'snow',
        });

        // 设置初始内容
        quillRef.current.root.innerHTML = content.html;

        // 监听内容变化
        quillRef.current.on('text-change', () => {
          if (quillRef.current) {
            const html = quillRef.current.root.innerHTML;
            const emailCompatibleHTML = convertToEmailCompatibleHTML(html);
            onUpdate({
              content: { ...content, html: emailCompatibleHTML },
            });
          }
        });

        // 初始化完成后自动聚焦
        setTimeout(() => {
          if (quillRef.current) {
            quillRef.current.focus();
          }
        }, 0);
      };

      initQuill();
    }

    // 更新只读状态
    if (quillRef.current) {
      quillRef.current.enable(isSelected);
    }

    return () => {
      // 清理 Quill 实例
      if (quillRef.current && !isSelected) {
        quillRef.current = null;
      }
    };
  }, [isSelected, element.id, toolbarId, content, onUpdate]);

  // 当元素被选中且 Quill 已初始化时，确保编辑器获得焦点
  useEffect(() => {
    if (isSelected && quillRef.current) {
      // 延迟聚焦，确保 DOM 已更新
      const timeoutId = setTimeout(() => {
        if (quillRef.current) {
          quillRef.current.focus();
        }
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isSelected, element.id]);

  // 更新内容
  useEffect(() => {
    if (quillRef.current && quillRef.current.root.innerHTML !== content.html) {
      quillRef.current.root.innerHTML = content.html;
    }
  }, [content.html]);

  if (!isSelected) {
    // 未选中时，显示为只读的 div
    return (
      <div
        className="text-element text-element-readonly"
        style={element.styles}
        dangerouslySetInnerHTML={{ __html: content.html }}
      />
    );
  }

  // 选中时，使用 Quill 编辑器
  return (
    <div className="text-element text-element-editable" style={element.styles}>
      <div id={editorId} ref={editorRef}></div>
    </div>
  );
};
