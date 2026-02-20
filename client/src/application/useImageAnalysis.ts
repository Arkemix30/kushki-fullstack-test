/**
 * Application layer — useImageAnalysis hook.
 * Using TanStack Query for state management.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { analyzeImage } from "../infrastructure/api";
import { validateFile, AnalysisResult, AnalysisError } from "../domain/models";

export function useImageAnalysis() {
    const queryClient = useQueryClient();

    const mutation = useMutation<AnalysisResult, AnalysisError, File>({
        mutationFn: async (file: File) => {
            const validation = validateFile(file);
            if (!validation.valid) {
                throw validation.error!;
            }
            return analyzeImage(file);
        },
        onSuccess: () => {
            // Automatically invalidate queries if we had fetching queries
            queryClient.invalidateQueries({ queryKey: ["analysis"] });
            toast.success("Image analyzed successfully!");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to analyze image");
        },
    });

    return {
        analyze: mutation.mutate,
        tags: mutation.data?.tags || [],
        loading: mutation.isPending,
        error: mutation.error,
        reset: mutation.reset,
    };
}
