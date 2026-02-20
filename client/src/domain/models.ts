import { z } from "zod";

/**
 * Zod schemas for runtime validation.
 */
export const tagSchema = z.object({
    label: z.string(),
    confidence: z.number(),
});

export const analysisResultSchema = z.object({
    tags: z.array(tagSchema),
});

/**
 * Derive types from schemas.
 */
export type Tag = z.infer<typeof tagSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export interface AnalysisError {
    code: number;
    message: string;
}

/**
 * Create a Tag object with rounding logic.
 */
export function createTag(label: string, confidence: number): Tag {
    return tagSchema.parse({
        label,
        confidence: Math.round(confidence * 100) / 100,
    });
}

/**
 * Create an AnalysisResult from raw API response using Zod validation.
 */
export function createAnalysisResult(data: unknown): AnalysisResult {
    const validated = analysisResultSchema.parse(data);
    return {
        tags: validated.tags.map((t) => createTag(t.label, t.confidence)),
    };
}

/**
 * Create a user-friendly error from API error response.
 */
export function createAnalysisError(code: number, message?: string): AnalysisError {
    const messages: Record<number, string> = {
        400: "Invalid file. Please upload a JPEG or PNG image.",
        413: "File is too large. Maximum size is 5MB.",
        502: "Image analysis service is temporarily unavailable. Try again later.",
        500: "An unexpected error occurred. Please try again.",
    };

    return {
        code,
        message: message || messages[code] || "Something went wrong.",
    };
}

/**
 * Validate a file on the client side before uploading.
 */
export function validateFile(file: File): { valid: boolean; error?: AnalysisError } {
    const ALLOWED_TYPES = ["image/jpeg", "image/png"];
    const MAX_SIZE = 5 * 1024 * 1024;

    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: createAnalysisError(400) };
    }

    if (file.size > MAX_SIZE) {
        return { valid: false, error: createAnalysisError(413) };
    }

    return { valid: true };
}
