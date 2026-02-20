import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag } from "../../domain/models";

interface TagListProps {
    tags: Tag[];
}

/**
 * Renders tags with specific color tiers: Blue (100%), Green (>=80%), Yellow (>=75%), Gray (<70%).
 * Shows all tags from 100% down to 0%.
 */
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

        // Show tags from 100 down to 45 as requested
        const processedTags = Array.from(uniqueTagsMap.values())
            .filter((tag) => tag.confidence >= 45)
            .sort((a, b) => b.confidence - a.confidence);

        return {
            primary: processedTags.filter((t) => t.confidence >= 70),
            secondary: processedTags.filter((t) => t.confidence < 70),
        };
    }, [tags]);

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

    if (!tags || tags.length === 0) return null;

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
                            {primary.map((tag) => {
                                const colors = getTagTheme(tag.confidence);
                                return (
                                    <motion.div
                                        key={tag.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                                        className={`group relative cursor-pointer overflow-hidden rounded-xl border ${colors.border} ${colors.bg} px-4 py-2 transition-all duration-300 ${colors.shadow} hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold text-[color:var(--color-text)]">
                                                {tag.label}
                                            </span>
                                            <span className={`text-xs font-bold ${colors.text} tabular-nums`}>
                                                {tag.confidence.toFixed(0)}%
                                            </span>
                                        </div>
                                        <div
                                            className={`absolute bottom-0 left-0 h-[3px] ${colors.highlight} transition-all duration-700 ease-out`}
                                            style={{ width: `${tag.confidence}%` }}
                                        />
                                    </motion.div>
                                );
                            })}
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
                            {secondary.map((tag) => {
                                const colors = getTagTheme(tag.confidence);
                                return (
                                    <motion.div
                                        key={tag.label}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05 }}
                                        className={`cursor-pointer rounded-lg border ${colors.border} ${colors.bg} px-3 py-1.5 transition-all duration-300 ${colors.shadow}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-[color:var(--color-text)]">
                                                {tag.label}
                                            </span>
                                            <span className={`text-[10px] font-bold ${colors.text} tabular-nums`}>
                                                {tag.confidence.toFixed(0)}%
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </div>
    );
}



