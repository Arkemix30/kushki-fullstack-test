import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../src/presentation/App";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithProvider = (ui) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe("App", () => {
    it("renders without crashing", () => {
        renderWithProvider(<App />);
        expect(screen.getByText("Image Analyzer")).toBeInTheDocument();
    });

    it("renders the upload area", () => {
        renderWithProvider(<App />);
        expect(screen.getByText(/drag & drop/i)).toBeInTheDocument();
    });

    it("renders the footer", () => {
        renderWithProvider(<App />);
        expect(screen.getByText(/flask \+ react/i)).toBeInTheDocument();
    });
});
