import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App.jsx";

describe("App", () => {
    it("renders the placeholder text", () => {
        render(<App />);
        expect(screen.getByText("App")).toBeTruthy();
    });

    it("renders a single top-level div wrapper", () => {
        const { container } = render(<App />);
        expect(container.children).toHaveLength(1);
        expect(container.firstChild.tagName).toBe("DIV");
    });
});