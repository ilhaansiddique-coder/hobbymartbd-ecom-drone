"use client";

import { useRef, useState, useCallback } from "react";
import { Bold, Italic, Heading, List, Link, ListOrdered } from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichEditor({ value, onChange, placeholder = "Write your content...", minHeight = 300 }: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  // The link button asks for a URL only when clicked — never during render.
  const handleButtonClick = useCallback(
    (command: string, value?: string) => {
      if (command === "createLink") {
        const url = window.prompt("Enter URL:");
        if (!url) return; // user cancelled or left it blank
        exec("createLink", url);
        return;
      }
      exec(command, value);
    },
    [exec]
  );

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Heading, command: "formatBlock", value: "h3", title: "Heading" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: Link, command: "createLink", title: "Link" },
  ];

  return (
    <div className={`rounded-xl border ${isFocused ? "ring-1 ring-blue-500 border-blue-500" : "border-gray-300"}`}>
      <div className="flex items-center gap-1 border-b bg-gray-50 px-2 py-1.5 rounded-t-xl">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.command}
            type="button"
            onClick={() => handleButtonClick(btn.command, btn.value)}
            title={btn.title}
            className="rounded-md p-1.5 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onInput={handleInput}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose prose-sm max-w-none p-4 text-gray-900 focus:outline-none min-h-[200px]"
        style={{ minHeight }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
