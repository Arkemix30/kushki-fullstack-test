import { z } from "zod";

const envSchema = z.object({
    VITE_BACKEND_URL: z.string().url().default("http://localhost:5000"),
    VITE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export const env = envSchema.parse({
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_ENV: import.meta.env.VITE_ENV,
});

// Type safety for our env
declare global {
    interface ImportMetaEnv extends z.infer<typeof envSchema> { }
    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}
