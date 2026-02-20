import { useState, useRef, useCallback, DragEvent, ChangeEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

/**
 * Drag-and-drop + file input component for image upload.
 * Improved with file validation and accessibility support.
 */
export default function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateAndSelect = useCallback((file: File | undefined) => {
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert("Please upload a valid image (JPEG or PNG).");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds 5MB limit.");
            return;
        }

        onFileSelect(file);
    }, [onFileSelect]);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            if (disabled) return;
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            validateAndSelect(file);
        },
        [disabled, validateAndSelect]
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            validateAndSelect(file);
            // Reset input value so same file can be selected again if needed
            e.target.value = "";
        },
        [validateAndSelect]
    );

    const handleClick = useCallback(() => {
        if (disabled) return;
        inputRef.current?.click();
    }, [disabled]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    }, [disabled, handleClick]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: isDragging ? 1.02 : 1,
                backgroundColor: isDragging ? "rgba(20, 184, 166, 0.05)" : "transparent"
            }}
            whileHover={!disabled ? { scale: 1.01, borderColor: "var(--color-accent)" } : {}}
            whileTap={!disabled ? { scale: 0.99 } : {}}
            className={`uploader group ${isDragging ? "uploader--dragging" : ""} ${disabled ? "uploader--disabled" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label="Upload image for analysis"
            id="image-uploader"
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleChange}
                className="hidden"
                disabled={disabled}
                id="file-input"
                aria-hidden="true"
            />

            <div className="flex flex-col items-center gap-3">
                <motion.div
                    animate={isDragging ? { y: -5 } : { y: 0 }}
                    className="text-[color:var(--color-text-muted)] transition-colors duration-300 group-hover:text-accent"
                >
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                </motion.div>
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-[color:var(--color-text)]">
                        {isDragging ? "Drop to analyze" : "Click or drag image here"}
                    </p>
                    <p className="text-xs text-[color:var(--color-text-muted)] font-medium">
                        Supports JPEG, PNG up to 5MB
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
