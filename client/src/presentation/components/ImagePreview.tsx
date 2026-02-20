interface ImagePreviewProps {
    file: File | null;
}

/**
 * Preview of the selected image using Tailwind CSS v4.
 */
export default function ImagePreview({ file }: ImagePreviewProps) {
    if (!file) return null;

    const imageUrl = URL.createObjectURL(file);

    return (
        <div className="text-center" id="image-preview">
            <img
                src={imageUrl}
                alt={`Preview of ${file.name}`}
                className="mx-auto max-h-[300px] w-full object-contain rounded-md border border-[color:var(--color-border)]"
                onLoad={() => URL.revokeObjectURL(imageUrl)}
            />
            <p className="mt-2 break-all text-[0.65rem] text-[color:var(--color-text-muted)]">
                {file.name}
            </p>
        </div>
    );
}
