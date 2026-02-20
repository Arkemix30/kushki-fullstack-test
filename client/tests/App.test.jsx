import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/presentation/App.jsx";

describe("App", () => {
    it("renders without crashing", () => {
        render(<App />);
        expect(screen.getByText("Image Analyzer")).toBeInTheDocument();
    });

    it("renders the upload area", () => {
        render(<App />);
        expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    });

    it("renders the footer", () => {
        render(<App />);
        expect(screen.getByText(/flask \+ react/i)).toBeInTheDocument();
    });
});
