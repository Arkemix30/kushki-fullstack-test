import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
}

/**
 * Drag-and-drop + file input component for image upload.
 */
export default function ImageUploader({ onFileSelect, disabled }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) onFileSelect(file);
        },
        [onFileSelect]
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
        },
        [onFileSelect]
    );

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

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
            role="button"
            tabIndex={0}
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
