import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ImageUploader from "../src/presentation/components/ImageUploader.jsx";

describe("ImageUploader", () => {
    it("renders upload area with instructions", () => {
        render(<ImageUploader onFileSelect={() => { }} disabled={false} />);
        expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
        expect(screen.getByText(/jpeg or png/i)).toBeInTheDocument();
    });

    it("has a hidden file input that accepts images", () => {
        render(<ImageUploader onFileSelect={() => { }} disabled={false} />);
        const input = document.getElementById("file-input");
        expect(input).toBeInTheDocument();
        expect(input.accept).toBe("image/jpeg,image/png");
    });

    it("calls onFileSelect when a file is selected", () => {
        const mockFn = vi.fn();
        render(<ImageUploader onFileSelect={mockFn} disabled={false} />);

        const input = document.getElementById("file-input");
        const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

        fireEvent.change(input, { target: { files: [file] } });
        expect(mockFn).toHaveBeenCalledWith(file);
    });

    it("is disabled when loading", () => {
        render(<ImageUploader onFileSelect={() => { }} disabled={true} />);
        const uploader = document.getElementById("image-uploader");
        expect(uploader.className).toContain("uploader--disabled");
    });
});
