/**
 * Infrastructure layer — HTTP client for the backend API.
 */

import { createAnalysisResult, createAnalysisError, AnalysisResult } from "../domain/models";
import { env } from "../env";

const BASE_URL = env.VITE_BACKEND_URL + "/api";

/**
 * Upload an image and get analysis tags.
 */
export async function analyzeImage(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("image", file);

    let response: Response;
    try {
        response = await fetch(`${BASE_URL}/analyze`, {
            method: "POST",
            body: formData,
        });
    } catch {
        throw createAnalysisError(502, "Could not connect to the server.");
    }

    const data = await response.json();

    if (!response.ok) {
        const errorData = data.error || {};
        throw createAnalysisError(errorData.code || response.status, errorData.message);
    }

    return createAnalysisResult(data);
}
