import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "regular",
          include: ["test/**/*.test.ts"],
        },
        define: {
          __TEST_DEV__: false,
        },
      },
      {
        test: {
          name: "dev",
          include: ["test/**/*.test.ts"],
        },
        define: {
          __TEST_DEV__: true,
        },
        resolve: {
          alias: {
            "prettier/plugins/markdown": "prettier-dev/plugins/markdown",
            "prettier/parser-markdown": "prettier-dev/parser-markdown",
          },
        },
      },
    ],
  },
});
