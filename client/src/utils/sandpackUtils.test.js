import { describe, it, expect } from "vitest";
import { detectDependencies } from "./sandpackUtils";

describe("detectDependencies", () => {
    it("returns an empty object when files is null or undefined", () => {
        expect(detectDependencies(null)).toEqual({});
        expect(detectDependencies(undefined)).toEqual({});
    });

    it("returns an empty object when files is an empty object", () => {
        expect(detectDependencies({})).toEqual({});
    });

    it("detects a simple named import from an npm package", () => {
        const files = {
            "/App.js": `import axios from 'axios';`,
        };
        expect(detectDependencies(files)).toEqual({ axios: "latest" });
    });

    it("ignores react and react-dom imports", () => {
        const files = {
            "/App.js": `import React from 'react';\nimport { createRoot } from 'react-dom/client';`,
        };
        expect(detectDependencies(files)).toEqual({});
    });

    it("ignores relative imports", () => {
        const files = {
            "/App.js": `import Header from './components/Header';\nimport Utils from '../utils/helpers';`,
        };
        expect(detectDependencies(files)).toEqual({});
    });

    it("ignores absolute path imports that start with a slash", () => {
        const files = {
            "/App.js": `import Foo from '/components/Foo';`,
        };
        expect(detectDependencies(files)).toEqual({});
    });

    it("detects a scoped package import and normalizes it to scope/package", () => {
        const files = {
            "/App.js": `import { Something } from '@scope/package/sub/path';`,
        };
        expect(detectDependencies(files)).toEqual({ "@scope/package": "latest" });
    });

    it("treats @/ aliased imports as local and skips them", () => {
        const files = {
            "/App.js": `import Button from '@/components/Button';`,
        };
        expect(detectDependencies(files)).toEqual({});
    });

    it("skips imports that resolve to a local file in the project", () => {
        const files = {
            "/components/Foo.js": `export default function Foo() {}`,
            "/App.js": `import Foo from 'components/Foo';`,
        };
        expect(detectDependencies(files)).toEqual({});
    });

    it("skips imports that resolve to a local file without an extension match", () => {
        const files = {
            "/utils/helpers.js": `export const helper = () => {};`,
            "/App.js": `import { helper } from 'utils/helpers';`,
        };
        expect(detectDependencies(files)).toEqual({});
    });

    it("detects packages containing a dot in their name", () => {
        const files = {
            "/App.js": `import debounce from 'lodash.debounce';`,
        };
        expect(detectDependencies(files)).toEqual({ "lodash.debounce": "latest" });
    });

    it("deduplicates repeated imports of the same package", () => {
        const files = {
            "/App.js": `import axios from 'axios';`,
            "/Api.js": `import axios from 'axios';`,
        };
        const result = detectDependencies(files);
        expect(result).toEqual({ axios: "latest" });
        expect(Object.keys(result)).toHaveLength(1);
    });

    it("aggregates multiple distinct dependencies across files", () => {
        const files = {
            "/App.js": `import axios from 'axios';\nimport moment from 'moment';`,
            "/utils.js": `import { debounce } from 'lodash.debounce';`,
        };
        expect(detectDependencies(files)).toEqual({
            axios: "latest",
            moment: "latest",
            "lodash.debounce": "latest",
        });
    });

    it("does not throw and returns an object when files values are not import-containing strings", () => {
        const files = {
            "/data.json": `{"key": "value"}`,
        };
        expect(detectDependencies(files)).toEqual({});
    });
});