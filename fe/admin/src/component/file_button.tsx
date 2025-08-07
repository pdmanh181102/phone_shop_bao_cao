"use client";

import { Button, ButtonProps } from "antd";
import { useRef, forwardRef, useImperativeHandle } from "react";

interface FileButtonProps extends ButtonProps {
  onSelectFile?: (file: File) => void;
}

// ref truyền ra sẽ là HTMLInputElement
const FileButton = forwardRef<HTMLInputElement, FileButtonProps>(
  ({ children, onSelectFile, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // expose inputRef ra ngoài thông qua ref
    useImperativeHandle(ref, () => inputRef.current!, []);

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && onSelectFile) {
        onSelectFile(file);
      }
    };

    return (
      <>
        <input
          type="file"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Button onClick={handleClick} {...props}>
          {children}
        </Button>
      </>
    );
  }
);
FileButton.displayName = "FileButton";
export default FileButton;
