import { describe, it, expect, vi, beforeEach } from "vitest";
import { StrictMode } from "react";
import App from "./App.jsx";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
    createRoot: createRootMock,
}));

describe("main.jsx entry point", () => {
    beforeEach(() => {
        vi.resetModules();
        createRootMock.mockClear();
        renderMock.mockClear();
        document.body.innerHTML = '<div id="root"></div>';
    });

    it("mounts the app onto the #root element using createRoot", async () => {
        await import("./main.jsx");

        const rootEl = document.getElementById("root");
        expect(createRootMock).toHaveBeenCalledTimes(1);
        expect(createRootMock).toHaveBeenCalledWith(rootEl);
        expect(renderMock).toHaveBeenCalledTimes(1);
    });

    it("renders the App component wrapped in StrictMode", async () => {
        await import("./main.jsx");

        const renderedElement = renderMock.mock.calls[0][0];
        expect(renderedElement.type).toBe(StrictMode);
        expect(renderedElement.props.children.type).toBe(App);
    });
});