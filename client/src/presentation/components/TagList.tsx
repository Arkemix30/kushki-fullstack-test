import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "../../domain/models";

interface TagListProps {
    tags: Tag[];
}

/**
 * Shared animation variants for reuse and optimization (defined outside component to prevent re-creation)
 */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
} as const;

/**
 * Determines the color theme based on confidence levels
 */
const getTagTheme = (confidence: number) => {
    if (confidence >= 100) return {
        text: "text-blue-400",
        bg: "bg-blue-400/5",
        border: "border-blue-400/30",
        highlight: "bg-blue-400",
        shadow: "hover:shadow-blue-400/20"
    };
    if (confidence >= 80) return {
        text: "text-emerald-400",
        bg: "bg-emerald-400/5",
        border: "border-emerald-400/30",
        highlight: "bg-emerald-400",
        shadow: "hover:shadow-emerald-400/20"
    };
    if (confidence >= 70) return {
        text: "text-yellow-400",
        bg: "bg-yellow-400/5",
        border: "border-yellow-400/30",
        highlight: "bg-yellow-400",
        shadow: "hover:shadow-yellow-400/20"
    };
    return {
        text: "text-[color:var(--color-text-secondary)]",
        bg: "bg-[color:var(--color-surface-hover)]/30",
        border: "border-[color:var(--color-border)]",
        highlight: "bg-[color:var(--color-text-muted)]",
        shadow: "hover:shadow-black/10"
    };
};

/**
 * Individual Tag Component for better maintainability and performance
 */
interface TagItemProps {
    tag: Tag;
    isPrimary?: boolean;
}

const TagItem = ({ tag, isPrimary = false }: TagItemProps) => {
    const theme = getTagTheme(tag.confidence);

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            className={`
                group relative cursor-pointer overflow-hidden transition-all duration-300 ${theme.shadow}
                ${isPrimary
                    ? `rounded-xl border ${theme.border} ${theme.bg} px-4 py-2 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]`
                    : `rounded-lg border ${theme.border} ${theme.bg} px-3 py-1.5`}
            `}
        >
            <div className={`flex items-center ${isPrimary ? 'gap-3' : 'gap-2'}`}>
                <span className={`${isPrimary ? 'text-sm font-semibold' : 'text-xs font-medium'} text-[color:var(--color-text)]`}>
                    {tag.label}
                </span>
                <span className={`${isPrimary ? 'text-xs font-bold' : 'text-[10px] font-bold'} ${theme.text} tabular-nums`}>
                    {tag.confidence.toFixed(0)}%
                </span>
            </div>

            {isPrimary && (
                <div
                    className={`absolute bottom-0 left-0 h-[3px] ${theme.highlight} transition-all duration-700 ease-out`}
                    style={{ width: `${tag.confidence}%` }}
                />
            )}
        </motion.div>
    );
};

export default function TagList({ tags }: TagListProps) {
    const { primary, secondary } = useMemo(() => {
        if (!tags) return { primary: [], secondary: [] };

        const uniqueTagsMap = new Map<string, Tag>();
        tags.forEach((tag) => {
            const existing = uniqueTagsMap.get(tag.label);
            if (!existing || tag.confidence > existing.confidence) {
                uniqueTagsMap.set(tag.label, tag);
            }
        });

        const sortedTags = Array.from(uniqueTagsMap.values())
            .filter((tag) => tag.confidence >= 45)
            .sort((a, b) => b.confidence - a.confidence);

        return {
            primary: sortedTags.filter((t) => t.confidence >= 70),
            secondary: sortedTags.filter((t) => t.confidence < 70),
        };
    }, [tags]);

    if (!tags || tags.length === 0) return null;

    return (
        <div className="mt-8 flex flex-col gap-8" id="tag-list">
            {/* High Confidence Section */}
            {primary.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-xs font-bold tracking-widest text-[color:var(--color-text-secondary)] uppercase">
                        High Confidence Results
                    </h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap gap-3"
                    >
                        <AnimatePresence mode="popLayout">
                            {primary.map((tag) => (
                                <TagItem key={tag.label} tag={tag} isPrimary />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}

            {/* Secondary Tags Section */}
            {secondary.length > 0 && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-xs font-bold tracking-widest text-[color:var(--color-text-secondary)] uppercase">
                        Secondary tags
                    </h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap gap-2"
                    >
                        <AnimatePresence mode="popLayout">
                            {secondary.map((tag) => (
                                <TagItem key={tag.label} tag={tag} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
