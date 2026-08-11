import { describe, it, expect } from "vitest";
import { homeTags } from "./assets.js";

describe("homeTags", () => {
    it("is a non-empty array of strings", () => {
        expect(Array.isArray(homeTags)).toBe(true);
        expect(homeTags.length).toBeGreaterThan(0);
        homeTags.forEach((tag) => expect(typeof tag).toBe("string"));
    });

    it("contains the expected website category tags in order", () => {
        expect(homeTags).toEqual([
            "Portfolio Website",
            "E-commerce Website",
            "Blog",
            "Landing Page",
            "Resume Website",
            "Personal Website",
            "Business Website",
            "Marketing Website",
            "Educational Website",
        ]);
    });

    it("does not contain duplicate tags", () => {
        const unique = new Set(homeTags);
        expect(unique.size).toBe(homeTags.length);
    });

    it("does not contain empty or whitespace-only tags", () => {
        homeTags.forEach((tag) => expect(tag.trim().length).toBeGreaterThan(0));
    });
});