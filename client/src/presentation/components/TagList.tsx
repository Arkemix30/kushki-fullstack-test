import { Tag } from "../../domain/models";

interface TagListProps {
    tags: Tag[];
}

/**
 * Renders a list of tags with visual confidence bars.
 * Uses Tailwind CSS v4 utilities.
 */
export default function TagList({ tags }: TagListProps) {
    if (!tags || tags.length === 0) return null;

    return (
        <div className="mt-6 flex flex-col gap-6" id="tag-list">
            <h2 className="text-xl font-semibold text-[color:var(--color-text)]">
                Analysis Results
            </h2>
            <ul className="flex max-h-[200px] flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {tags.map((tag, index) => (
                    <li
                        key={`${tag.label}-${index}`}
                        className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <div className="mb-1 flex justify-between items-center">
                            <span className="text-sm font-medium text-[color:var(--color-text)]">
                                {tag.label}
                            </span>
                            <span className="text-xs font-semibold text-accent tabular-nums">
                                {tag.confidence.toFixed(1)}%
                            </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--color-bar-bg)]">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-accent to-cyan-600 transition-[width] duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                                style={{ width: `${Math.min(tag.confidence, 100)}%` }}
                                role="progressbar"
                                aria-valuenow={tag.confidence}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${tag.label}: ${tag.confidence.toFixed(1)}% confidence`}
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
