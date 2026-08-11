import { describe, it, expect, beforeEach } from "vitest";
import api, { dummyUser, initialProjects } from "./api";

const seedProjects = (projects) => {
    localStorage.setItem("mock_projects", JSON.stringify(projects));
};

const makeProject = (overrides = {}) => ({
    _id: "proj-test",
    name: "Test Project",
    description: "A test project",
    version: 1,
    status: "completed",
    published: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    messages: [{ role: "user", content: "hi", timestamp: "2024-01-01T00:00:00.000Z" }],
    files: { "/App.js": "console.log('hi')" },
    ...overrides,
});

describe("api mock adapter", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("configures the axios instance with credentials enabled", () => {
        expect(api.defaults.withCredentials).toBe(true);
    });

    describe("GET /api/projects", () => {
        it("falls back to initialProjects when nothing is stored", async () => {
            const res = await api.get("/api/projects");
            expect(res.status).toBe(200);
            expect(res.data).toHaveLength(initialProjects.length);
            expect(res.data[0]).toMatchObject({
                _id: initialProjects[0]._id,
                name: initialProjects[0].name,
                description: initialProjects[0].description,
            });
            expect(res.data[0]).not.toHaveProperty("files");
            expect(res.data[0]).not.toHaveProperty("messages");
        });

        it("returns projects saved in localStorage instead of the defaults", async () => {
            seedProjects([makeProject({ _id: "proj-a" }), makeProject({ _id: "proj-b" })]);
            const res = await api.get("/api/projects");
            expect(res.data.map((p) => p._id)).toEqual(["proj-a", "proj-b"]);
        });
    });

    describe("auth routes", () => {
        it("GET /api/auth/me returns the dummy user when nothing is stored", async () => {
            const res = await api.get("/api/auth/me");
            expect(res.status).toBe(200);
            expect(res.data.user).toEqual(dummyUser);
        });

        it("GET /api/auth/me rejects with 401 when the stored user is explicitly null", async () => {
            localStorage.setItem("mock_user", JSON.stringify(null));
            await expect(api.get("/api/auth/me")).rejects.toMatchObject({
                response: { status: 401, data: { error: "Unauthorized" } },
            });
        });

        it("POST /api/auth/login derives a name from the email and persists the user", async () => {
            const res = await api.post("/api/auth/login", { email: "jane@example.com" });
            expect(res.data.user).toMatchObject({
                _id: "user-1",
                name: "jane",
                email: "jane@example.com",
            });
            expect(JSON.parse(localStorage.getItem("mock_user"))).toEqual(res.data.user);
        });

        it("POST /api/auth/login falls back to 'User' when no email is provided", async () => {
            const res = await api.post("/api/auth/login", {});
            expect(res.data.user.name).toBe("User");
        });

        it("POST /api/auth/register creates and persists a new user", async () => {
            const res = await api.post("/api/auth/register", { name: "Jane", email: "jane@example.com" });
            expect(res.data.user).toMatchObject({ name: "Jane", email: "jane@example.com" });
            expect(res.data.user._id).toMatch(/^user-\d+$/);
            expect(JSON.parse(localStorage.getItem("mock_user"))).toEqual(res.data.user);
        });

        it("POST /api/auth/logout clears the stored user", async () => {
            localStorage.setItem("mock_user", JSON.stringify(dummyUser));
            const res = await api.post("/api/auth/logout");
            expect(res.data).toEqual({ message: "Logged out" });
            expect(localStorage.getItem("mock_user")).toBeNull();
        });
    });

    describe("POST /api/projects", () => {
        it("creates a project using the prompt as its name when short enough", async () => {
            const res = await api.post("/api/projects", { prompt: "Short prompt" });
            expect(res.status).toBe(201);
            expect(res.data.name).toBe("Short prompt");
            expect(res.data.description).toBe("Short prompt");
            expect(res.data.version).toBe(1);
            expect(res.data.published).toBe(false);
            expect(res.data.files).toHaveProperty("/App.js");
            expect(res.data.messages).toHaveLength(2);
            expect(res.data.messages[0]).toMatchObject({ role: "user", content: "Short prompt" });
            expect(res.data.messages[1].role).toBe("assistant");
        });

        it("truncates long prompts to 28 characters with an ellipsis for the project name", async () => {
            const longPrompt = "a".repeat(40);
            const res = await api.post("/api/projects", { prompt: longPrompt });
            expect(res.data.name).toBe(`${"a".repeat(28)}...`);
            expect(res.data.description).toBe(longPrompt);
        });

        it("defaults to 'New Project' when no prompt is provided", async () => {
            const res = await api.post("/api/projects", {});
            expect(res.data.name).toBe("New Project");
        });

        it("prepends the new project to existing stored projects", async () => {
            seedProjects([makeProject({ _id: "existing" })]);
            await api.post("/api/projects", { prompt: "New site" });
            const stored = JSON.parse(localStorage.getItem("mock_projects"));
            expect(stored).toHaveLength(2);
            expect(stored[0].name).toBe("New site");
            expect(stored[1]._id).toBe("existing");
        });
    });

    describe("GET /api/projects/public/:id", () => {
        it("returns the full project data for a known id", async () => {
            seedProjects([makeProject({ _id: "pub-1", published: true })]);
            const res = await api.get("/api/projects/public/pub-1");
            expect(res.status).toBe(200);
            expect(res.data._id).toBe("pub-1");
            expect(res.data.files).toBeDefined();
        });

        it("rejects with 404 for an unknown id", async () => {
            seedProjects([]);
            await expect(api.get("/api/projects/public/missing")).rejects.toMatchObject({
                response: { status: 404, data: { error: "Website unavailable or not published yet" } },
            });
        });
    });

    describe("POST /api/projects/:id/chat", () => {
        it("appends a user and assistant message and bumps the version", async () => {
            seedProjects([makeProject({ _id: "chat-1", version: 1, messages: [] })]);
            const res = await api.post("/api/projects/chat-1/chat", { prompt: "Add a footer" });
            expect(res.status).toBe(200);
            expect(res.data.version).toBe(2);
            expect(res.data.messages).toHaveLength(2);
            expect(res.data.messages[0]).toMatchObject({ role: "user", content: "Add a footer" });
            expect(res.data.messages[1].role).toBe("assistant");
        });

        it("persists the updated project back to storage", async () => {
            seedProjects([makeProject({ _id: "chat-2", version: 3, messages: [] })]);
            await api.post("/api/projects/chat-2/chat", { prompt: "Update" });
            const stored = JSON.parse(localStorage.getItem("mock_projects"));
            expect(stored[0].version).toBe(4);
        });

        it("rejects with 404 for an unknown project id", async () => {
            seedProjects([]);
            await expect(api.post("/api/projects/missing/chat", { prompt: "hi" })).rejects.toMatchObject({
                response: { status: 404, data: { error: "Project not found" } },
            });
        });
    });

    describe("POST /api/projects/:id/publish", () => {
        it("marks the project as published and persists the change", async () => {
            seedProjects([makeProject({ _id: "pub-2", published: false })]);
            const res = await api.post("/api/projects/pub-2/publish");
            expect(res.data).toEqual({ published: true });
            const stored = JSON.parse(localStorage.getItem("mock_projects"));
            expect(stored[0].published).toBe(true);
        });

        it("rejects with 404 for an unknown project id", async () => {
            seedProjects([]);
            await expect(api.post("/api/projects/missing/publish")).rejects.toMatchObject({
                response: { status: 404, data: { error: "Project not found" } },
            });
        });
    });

    describe("PUT /api/projects/:id/files", () => {
        it("overwrites the files of a project and persists the change", async () => {
            seedProjects([makeProject({ _id: "files-1" })]);
            const newFiles = { "/App.js": "updated content" };
            const res = await api.put("/api/projects/files-1/files", { files: newFiles });
            expect(res.data).toEqual({ success: true });
            const stored = JSON.parse(localStorage.getItem("mock_projects"));
            expect(stored[0].files).toEqual(newFiles);
        });

        it("rejects with 404 for an unknown project id", async () => {
            seedProjects([]);
            await expect(api.put("/api/projects/missing/files", { files: {} })).rejects.toMatchObject({
                response: { status: 404, data: { error: "Project not found" } },
            });
        });
    });

    describe("GET /api/projects/:id", () => {
        it("returns the full project for a known id", async () => {
            seedProjects([makeProject({ _id: "single-1" })]);
            const res = await api.get("/api/projects/single-1");
            expect(res.data._id).toBe("single-1");
            expect(res.data.files).toBeDefined();
        });

        it("rejects with 404 for an unknown id", async () => {
            seedProjects([]);
            await expect(api.get("/api/projects/missing")).rejects.toMatchObject({
                response: { status: 404, data: { error: "Project not found" } },
            });
        });
    });

    describe("DELETE /api/projects/:id", () => {
        it("removes the matching project from storage", async () => {
            seedProjects([makeProject({ _id: "del-1" }), makeProject({ _id: "del-2" })]);
            const res = await api.delete("/api/projects/del-1");
            expect(res.data).toEqual({ message: "Project deleted" });
            const stored = JSON.parse(localStorage.getItem("mock_projects"));
            expect(stored.map((p) => p._id)).toEqual(["del-2"]);
        });

        it("resolves successfully even when the id does not exist", async () => {
            seedProjects([makeProject({ _id: "keep-1" })]);
            const res = await api.delete("/api/projects/unknown-id");
            expect(res.data).toEqual({ message: "Project deleted" });
            const stored = JSON.parse(localStorage.getItem("mock_projects"));
            expect(stored).toHaveLength(1);
            expect(stored[0]._id).toBe("keep-1");
        });
    });
});