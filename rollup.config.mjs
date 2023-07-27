// Babel
import { DEFAULT_EXTENSIONS as babelDefaultExtensions } from "@babel/core";

// Rollup configuration
import { defineConfig } from "rollup";

// Rollup plugins
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

// TypeScript
import ts from "typescript";

export default defineConfig([
  {
    input: "src/index.ts",
    plugins: [
      resolve({ preferBuiltins: false, browser: true }),
      typescript({
        typescript: ts,
        tsconfigDefaults: {
          exclude: ["./tests", "**/*.spec.ts", "**/*.test.ts", "./dist"],
        },
        tsconfigOverride: {
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist",
            paths: {}, // Do not include files referenced via `paths`
          },
        },
      }),
      json(),
      commonjs(),
    ],
    external: ["jspsych"],
    output: [
      {
        // Build file to be used as an ES import
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
        exports: "default",
        globals: { jspsych: "jsPsychModule" },
      },
      {
        // Build commonjs module (for tools that do not fully support ES6 modules)
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
        exports: "default",
        globals: { jspsych: "jsPsychModule" },
      },
      {
        // Build file to be used for tinkering in modern browsers
        file: "dist/index.browser.js",
        format: "iife",
        name: "NeurocogExtension",
        sourcemap: true,
        exports: "default",
        globals: { jspsych: "jsPsychModule" },
      }
    ]
  },
  {
    input: "src/index.ts",
    plugins: [
      resolve({ preferBuiltins: false, browser: true }),
      typescript({
        typescript: ts,
        tsconfigDefaults: {
          exclude: ["./tests", "**/*.spec.ts", "**/*.test.ts", "./dist"],
        },
        tsconfigOverride: {
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist",
            paths: {}, // Do not include files referenced via `paths`
          },
        },
      }),
      json(),
      commonjs(),
    ],
    external: ["jspsych"],
    plugins: [
      // Import `regenerator-runtime` if requested:
      replace({
        values: {
          "// __rollup-babel-import-regenerator-runtime__":
            'import "regenerator-runtime/runtime.js";',
        },
        delimiters: ["", ""],
        preventAssignment: true,
      }),
      resolve({ preferBuiltins: false, browser: true }),
      typescript({
        typescript: ts,
        tsconfigDefaults: {
          exclude: ["./tests", "**/*.spec.ts", "**/*.test.ts", "./dist"],
        },
        tsconfigOverride: {
          compilerOptions: {
            rootDir: "./src",
            outDir: "./dist",
            paths: {}, // Do not include files referenced via `paths`
          },
        },
      }),
      json(),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        extends: "@jspsych/config/babel",
        // https://github.com/ezolenko/rollup-plugin-typescript2#rollupplugin-babel
        extensions: [...babelDefaultExtensions, ".ts"],
      }),
    ],
    output: [
      {
        // Minified production build file
        file: "dist/index.browser.min.js",
        format: "iife",
        plugins: [terser()],
        name: "NeurocogExtension",
        sourcemap: true,
        exports: "default",
        globals: { jspsych: "jsPsychModule" },
      },
    ],
  }
]);;
