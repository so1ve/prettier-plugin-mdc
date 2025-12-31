import base from "@so1ve/prettier-config";

export default {
  ...base,
  plugins: [...base.plugins, "./dist/index.mjs"],
  overrides: [
    ...base.overrides,
    {
      files: ["*.md"],
      options: {
        parser: "mdc",
      },
    },
  ],
};
