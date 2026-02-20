import { motion } from "framer-motion";

interface ImagePreviewProps {
    file: File | null;
}

/**
 * Preview of the selected image using Framer Motion for a smooth entrance.
 */
export default function ImagePreview({ file }: ImagePreviewProps) {
    if (!file) return null;

    const imageUrl = URL.createObjectURL(file);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="text-center"
            id="image-preview"
        >
            <img
                src={imageUrl}
                alt={`Preview of ${file.name}`}
                className="mx-auto max-h-[300px] w-full object-contain rounded-md border border-[color:var(--color-border)] shadow-xl"
                onLoad={() => URL.revokeObjectURL(imageUrl)}
            />
            <p className="mt-4 break-all text-[0.65rem] font-medium tracking-tight text-[color:var(--color-text-muted)] uppercase">
                {file.name}
            </p>
        </motion.div>
    );
}
