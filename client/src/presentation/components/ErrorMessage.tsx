import { AnalysisError } from "../../domain/models";

interface ErrorMessageProps {
    error: AnalysisError | null;
    onDismiss?: () => void;
}

/**
 * User-friendly error message display using Tailwind CSS v4.
 */
export default function ErrorMessage({ error, onDismiss }: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div
            className="mt-4 flex animate-[shakeIn_0.3s_ease] items-center gap-3 rounded-lg border border-[color:var(--color-error-border)] bg-[color:var(--color-error-bg)] p-4"
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
            <p className="flex-1 text-sm text-[color:var(--color-error)]">{error.message}</p>
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
        </div>
    );
}
