import { useState, useCallback } from "react";
import { useImageAnalysis } from "../application/useImageAnalysis";
import ImageUploader from "./components/ImageUploader";
import ImagePreview from "./components/ImagePreview";
import TagList from "./components/TagList";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const { analyze, tags, loading, error, reset } = useImageAnalysis();

    const handleFileSelect = useCallback(
        (selectedFile: File) => {
            setFile(selectedFile);
            analyze(selectedFile);
        },
        [analyze]
    );

    const handleReset = useCallback(() => {
        setFile(null);
        reset();
    }, [reset]);

    return (
        <div className="flex min-h-screen flex-col bg-[color:var(--color-bg)]">
            <header className="border-b border-[color:var(--color-border)] bg-linear-to-b from-teal-500/5 to-transparent px-6 py-8 text-center">
                <div className="mx-auto max-w-xl">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-linear-to-br from-accent to-cyan-600 text-white shadow-[0_0_20px_var(--color-accent-glow)]">
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                    <h1 className="bg-linear-to-br from-[color:var(--color-text)] to-accent bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                        Image Analyzer
                    </h1>
                    <p className="mt-1 text-sm text-[color:var(--color-text-secondary)]">
                        AI-powered image tagging
                    </p>
                </div>
            </header>

            <main className="flex flex-1 items-start justify-center px-6 py-12" aria-label="Main Content">
                <section
                    className="w-full max-w-[560px] rounded-2xl border border-[color:var(--color-border)] bg-surface p-8 shadow-2xl shadow-black/30"
                    id="upload-section"
                >
                    <ImageUploader onFileSelect={handleFileSelect} disabled={loading} />

                    {loading && (
                        <div className="flex flex-col items-center gap-4 py-8" id="loading-spinner" role="status">
                            <div className="h-10 w-10 animate-spin rounded-full border-3 border-[color:var(--color-border)] border-t-accent" />
                            <p className="animate-pulse text-sm text-[color:var(--color-text-secondary)]">
                                Analyzing image…
                            </p>
                        </div>
                    )}

                    <ErrorMessage error={error} onDismiss={handleReset} />

                    {file && !loading && (
                        <div className="mt-8 flex flex-col gap-8">
                            <ImagePreview file={file} />
                            <TagList tags={tags} />
                        </div>
                    )}

                    {(tags.length > 0 || error) && !loading && (
                        <button
                            onClick={handleReset}
                            className="mt-8 w-full cursor-pointer rounded-lg border border-[color:var(--color-border)] bg-transparent px-6 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition-all duration-200 hover:border-accent hover:bg-accent/10 hover:text-accent active:scale-[0.98]"
                            id="reset-button"
                        >
                            Analyze another image
                        </button>
                    )}
                </section>
            </main>

            <footer className="border-t border-[color:var(--color-border)] py-6 text-center text-xs text-[color:var(--color-text-muted)]">
                <p>Built with Flask + React · Powered by Imagga AI</p>
            </footer>
        </div>
    );
}
