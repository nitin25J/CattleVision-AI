import React, { useRef } from "react";
import { validateImageFile } from "../utils/imageValidation";

export default function ImageUploader({ onImageSelected, error, setError }) {
  const fileInputRef = useRef(null);

  const processFile = (file) => {
    const { isValid, error: validationError } = validateImageFile(file);
    if (!isValid) {
      setError(validationError);
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => onImageSelected(e.target.result, file);
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-6">
      {error && (
        <div className="flex items-center gap-2 bg-[#FBE9E4] text-[#8A3C24] p-3 rounded-[var(--radius-sm)] text-[13px] font-medium mb-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-[#C9BFA0] hover:border-[var(--forest-mid)] hover:bg-[var(--sage-soft)] bg-white rounded-[var(--radius-lg)] p-12 text-center cursor-pointer transition-all"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--sage-soft)] flex items-center justify-center text-[var(--forest-mid)]">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3M7 9l5-5 5 5M12 4v12" />
          </svg>
        </div>
        <div className="font-semibold text-[16px] mb-1">Drop image here</div>
        <div className="text-[13px] text-[var(--muted)] mb-5">or choose from your device</div>
        <div className="flex gap-2.5 justify-center">
          <button
            type="button"
            className="px-4 py-2 bg-[var(--sage)] text-[var(--forest-deep)] font-semibold text-xs rounded-full shadow-sm"
          >
            Take photo
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-[var(--hairline)] text-[var(--forest-deep)] font-semibold text-xs rounded-full bg-white hover:bg-[var(--surface-sunk)]"
          >
            Choose from gallery
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files[0]) processFile(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}