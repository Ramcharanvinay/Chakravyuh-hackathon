import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X, AlertCircle, CheckCircle } from 'lucide-react';
import { HACKATHON_CONFIG } from '../config/hackathonConfig';

interface FileUploaderProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  uploadProgress?: number; // 0 to 100
  isSubmitting?: boolean;
  disabled?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  selectedFile,
  onFileSelect,
  uploadProgress = 0,
  isSubmitting = false,
  disabled = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxBytes = HACKATHON_CONFIG.maxPptSizeBytes;
  const maxMb = (maxBytes / (1024 * 1024)).toFixed(0);

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);

    // Validate extension
    const nameLower = file.name.toLowerCase();
    if (!nameLower.endsWith('.ppt') && !nameLower.endsWith('.pptx')) {
      setErrorMessage('Unsupported file format. Please upload a PowerPoint presentation (.ppt or .pptx).');
      return;
    }

    // Validate size (25MB)
    if (file.size > maxBytes) {
      const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`File is too large (${fileSizeMb} MB). Maximum allowed size is ${maxMb} MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled || isSubmitting) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isSubmitting) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (disabled || isSubmitting) return;
    onFileSelect(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept=".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        className="hidden"
        disabled={disabled || isSubmitting}
      />

      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => {
            if (!disabled && !isSubmitting) {
              fileInputRef.current?.click();
            }
          }}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? 'border-gold bg-gold/10 shadow-gold-subtle scale-[1.01]'
              : 'border-charcoal-border hover:border-gold/40 bg-charcoal-card/60 hover:bg-charcoal-card'
          } ${disabled || isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {/* Atmospheric upload emblem */}
          <div className="w-16 h-16 rounded-2xl bg-charcoal border border-gold/30 flex items-center justify-center text-gold mb-4 shadow-gold-subtle group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>

          <span className="font-cinzel text-base sm:text-lg font-bold text-ivory tracking-wide mb-1">
            Drag & Drop PowerPoint Presentation
          </span>
          <p className="font-sans text-xs text-ivory-muted max-w-sm mb-4">
            Upload your team's tactical slide deck. Supports <strong className="text-gold">.PPT</strong> and <strong className="text-gold">.PPTX</strong> up to {maxMb} MB.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-charcoal border border-gold/40 text-gold text-xs font-sans font-semibold tracking-wider uppercase hover:bg-gold hover:text-obsidian transition-colors cursor-pointer"
            >
              BROWSE FILES
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                // Generate a lightweight synthetic presentation blob for testing/demo
                const demoBlob = new Blob(
                  ["PK\x03\x04\x14\x00\x00\x00\x08\x00Chakravyuh Demo Deck Presentation Binary Content"],
                  { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }
                );
                const demoFile = new File([demoBlob], "Chakravyuh_Squad_Tactical_Deck.pptx", {
                  type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  lastModified: Date.now(),
                });
                validateAndSetFile(demoFile);
              }}
              className="px-3.5 py-2 rounded-xl bg-gold/15 border border-gold/40 text-gold text-xs font-sans font-semibold tracking-wider uppercase hover:bg-gold/30 transition-colors cursor-pointer"
            >
              + USE SAMPLE PPTX
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-charcoal-card border border-gold/40 p-5 space-y-4 shadow-gold-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-gold/15 border border-gold/40 flex items-center justify-center text-gold shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-ivory truncate max-w-[200px] sm:max-w-md">
                  {selectedFile.name}
                </span>
                <div className="flex items-center gap-2 text-xs text-ivory-muted/70">
                  <span className="font-mono">{formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="uppercase text-gold font-mono text-[10px]">
                    {selectedFile.name.split('.').pop()}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Ready for upload
                  </span>
                </div>
              </div>
            </div>

            {!isSubmitting && (
              <button
                type="button"
                onClick={handleRemove}
                title="Remove and choose different presentation"
                className="p-2 rounded-lg bg-charcoal border border-charcoal-border text-ivory-muted hover:text-ember hover:border-ember/40 hover:bg-ember/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar if submitting */}
          {isSubmitting && (
            <div className="space-y-1.5 pt-2 border-t border-charcoal-border/70">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gold">Uploading to Supabase Storage 'hackathon-ppts'...</span>
                <span className="text-ivory font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-charcoal overflow-hidden border border-charcoal-border">
                <div
                  className="h-full bg-gradient-to-r from-gold to-amber-500 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-ember/15 border border-ember/40 text-ember text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
