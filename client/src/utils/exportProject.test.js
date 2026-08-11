import { describe, it, expect, vi, beforeEach } from "vitest";

const fileMock = vi.fn();
const generateAsyncMock = vi.fn().mockResolvedValue("mock-blob-content");
const saveAsMock = vi.fn();

vi.mock("jszip", () => {
    return {
        default: vi.fn().mockImplementation(() => ({
            file: fileMock,
            generateAsync: generateAsyncMock,
        })),
    };
});

vi.mock("file-saver", () => ({
    saveAs: saveAsMock,
}));

import { exportProjectZip } from "./exportProject";

// Helper to turn the recorded zip.file() calls into a lookup map
const getZipFilesMap = () => {
    const map = {};
    for (const [path, content] of fileMock.mock.calls) {
        map[path] = content;
    }
    return map;
};

describe("exportProjectZip", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        generateAsyncMock.mockResolvedValue("mock-blob-content");
    });

    it("does nothing when project is null or undefined", async () => {
        await exportProjectZip(null);
        await exportProjectZip(undefined);
        expect(fileMock).not.toHaveBeenCalled();
        expect(saveAsMock).not.toHaveBeenCalled();
    });

    it("builds a package.json, vite config, index.html, entry file and project files", async () => {
        const project = {
            name: "My Site",
            files: {
                "/App.js": "export default function App() { return null; }",
            },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        expect(Object.keys(files)).toEqual(
            expect.arrayContaining(["package.json", "vite.config.js", "index.html", "src/index.jsx", "src/App.js"]),
        );

        const pkg = JSON.parse(files["package.json"]);
        expect(pkg.name).toBe("my-site");
        expect(pkg.dependencies.react).toBe("^18.2.0");
        expect(pkg.dependencies["react-dom"]).toBe("^18.2.0");

        expect(files["vite.config.js"]).toContain("@vitejs/plugin-react");
        expect(files["index.html"]).toContain("<title>My Site</title>");
        expect(files["src/index.jsx"]).toContain("createRoot(document.getElementById('root'))");
        expect(files["src/App.js"]).toBe("export default function App() { return null; }");
    });

    it("merges detected npm dependencies from import statements into package.json", async () => {
        const project = {
            name: "Dep Project",
            files: {
                "/App.js": "import axios from 'axios';\nimport moment from 'moment';",
            },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        const pkg = JSON.parse(files["package.json"]);
        expect(pkg.dependencies.axios).toBe("latest");
        expect(pkg.dependencies.moment).toBe("latest");
    });

    it("normalizes files whose content is stored under a content property", async () => {
        const project = {
            name: "Object Content",
            files: {
                "/App.js": { content: "export default function App() {}" },
            },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        expect(files["src/App.js"]).toBe("export default function App() {}");
    });

    it("falls back to empty string for object content without a content field", async () => {
        const project = {
            name: "Empty Content",
            files: {
                "/App.js": {},
            },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        expect(files["src/App.js"]).toBe("");
    });

    it("strips a leading slash from file paths before adding them to the zip", async () => {
        const project = {
            name: "Nested",
            files: {
                "/components/Header.js": "export default function Header() {}",
            },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        expect(files).toHaveProperty("src/components/Header.js");
        expect(files).not.toHaveProperty("src//components/Header.js");
    });

    it("falls back to default names when the project has no name", async () => {
        const project = {
            files: { "/App.js": "code" },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        const pkg = JSON.parse(files["package.json"]);
        expect(pkg.name).toBe("my-website");
        expect(files["index.html"]).toContain("<title>My Website</title>");
        expect(saveAsMock).toHaveBeenCalledWith("mock-blob-content", "website.zip");
    });

    it("sanitizes special characters in the project name for the package name and zip filename", async () => {
        const project = {
            name: "My Cool! Site_2024",
            files: { "/App.js": "code" },
        };

        await exportProjectZip(project);

        const files = getZipFilesMap();
        const pkg = JSON.parse(files["package.json"]);
        expect(pkg.name).toBe("my-cool-site-2024");
        expect(saveAsMock).toHaveBeenCalledWith("mock-blob-content", "my-cool-site-2024.zip");
    });

    it("calls saveAs with the generated blob and derived file name", async () => {
        const project = {
            name: "Landing Page",
            files: { "/App.js": "code" },
        };

        await exportProjectZip(project);

        expect(saveAsMock).toHaveBeenCalledTimes(1);
        expect(saveAsMock).toHaveBeenCalledWith("mock-blob-content", "landing-page.zip");
    });

    it("catches and logs errors instead of throwing when zip generation fails", async () => {
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        generateAsyncMock.mockRejectedValueOnce(new Error("zip failed"));

        const project = {
            name: "Broken",
            files: { "/App.js": "code" },
        };

        await expect(exportProjectZip(project)).resolves.toBeUndefined();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Export project error:", expect.any(Error));
        expect(saveAsMock).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});