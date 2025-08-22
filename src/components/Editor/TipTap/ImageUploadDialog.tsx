import React, { useState, useRef } from "react";
import { Upload, Link, X } from "lucide-react";
import styles from "@/styles/TipTapEditor.module.scss";

interface ImageUploadDialogProps {
  onClose: () => void;
  onImageSelected: (imageUrl: string) => void;
}

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ onClose, onImageSelected }) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    }
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result);
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleImageFile(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl.trim()) {
      onImageSelected(imageUrl);
      onClose();
    }
  };

  return (
    <div className={styles.image_upload_dialog}>
      <div className={styles.dialog_content}>
        <div className={styles.header}>
          <h2>Insert Image</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.tab_buttons}>
            <button onClick={() => setActiveTab("upload")}>
              <div className={styles.icon_text}>
                <Upload size={18} />
                <span>Upload</span>
              </div>
            </button>
            <button onClick={() => setActiveTab("url")}>
              <div className={styles.icon_text}>
                <Link size={18} />
                <span>URL</span>
              </div>
            </button>
          </div>

          {activeTab === "upload" ? (
            <div
              className={styles.upload_area}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              <Upload size={24} className={styles.upload_icon} />
              <p className={styles.upload_text}>
                Drag and drop an image here, or{" "}
                <button className={styles.browse_button} onClick={() => fileInputRef.current?.click()}>
                  browse
                </button>
              </p>
              <p className={styles.support_text}>Supports: JPG, PNG, GIF (max 10MB)</p>
            </div>
          ) : (
            <form onSubmit={handleUrlSubmit}>
              <input
                type="url"
                placeholder="Paste the image URL here"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <div className={styles.submit_button}>
                <button type="submit" disabled={!imageUrl.trim()}>
                  Insert Image
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadDialog;
