import { motion } from "framer-motion";
import { AnalysisError } from "../../domain/models";

interface ErrorMessageProps {
    error: AnalysisError | null;
    onDismiss?: () => void;
}

/**
 * User-friendly error message display using Framer Motion for animations.
 */
export default function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
    if (!error) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: [0, -4, 4, -2, 2, 0] // Shake effect
            }}
            transition={{
                duration: 0.4,
                x: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }
            }}
            className="mt-6 flex items-center gap-3 rounded-lg border border-[color:var(--color-error-border)] bg-[color:var(--color-error-bg)] p-4 shadow-lg shadow-red-500/10"
            role="alert"
            id="error-message"
        >
            <div className="shrink-0 text-[color:var(--color-error)]">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
            </div>
            <p className="flex-1 text-sm font-medium text-[color:var(--color-error)]">{error.message}</p>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="cursor-pointer p-1 text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text)]"
                    aria-label="Dismiss error"
                    id="dismiss-error"
                >
                    ✕
                </button>
            )}
        </motion.div>
    );
}
