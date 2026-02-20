import { useState, useRef, useCallback, DragEvent, ChangeEvent } from "react";

interface ImageUploaderProps {
    onFileSelect: (file: File) => void;
    disabled: boolean;
}

/**
 * Drag-and-drop + file input component for image upload.
 * Refactored to use Tailwind-assisted classes.
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
        <div
            className={`uploader ${isDragging ? "uploader--dragging" : ""} ${disabled ? "uploader--disabled" : ""}`}
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
            <label htmlFor="file-input" className="sr-only">
                Upload image
            </label>

            <div className="flex flex-col items-center gap-2">
                <div className="text-[color:var(--color-text-muted)] transition-colors duration-250 group-hover:text-accent">
                    <svg
                        width="48"
                        height="48"
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
                </div>
                <p className="font-medium text-[color:var(--color-text)]">
                    {isDragging ? "Drop your image here" : "Drag & drop an image, or click to browse"}
                </p>
                <p className="text-xs text-[color:var(--color-text-muted)]">JPEG or PNG, max 5MB</p>
            </div>
        </div>
    );
}
