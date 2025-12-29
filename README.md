# prettier-plugin-mdc

[![NPM version](https://img.shields.io/npm/v/prettier-plugin-mdc?color=a1b858&label=)](https://www.npmjs.com/package/prettier-plugin-mdc)

A [Prettier](https://prettier.io/) plugin for formatting [MDC (Markdown Components)](https://content.nuxt.com/docs/files/markdown#mdc-syntax) syntax used in [Nuxt Content](https://content.nuxt.com/).

## 💎 Features

- Preserve YAML front matter in components
- Support for nested components
- Compatible with GFM (GitHub Flavored Markdown) and math syntax

## 📦 Installation

```bash
npm install -D prettier-plugin-mdc
# or
yarn add -D prettier-plugin-mdc
# or
pnpm add -D prettier-plugin-mdc
```

## 🚀 Usage

Add the plugin to your Prettier configuration:

```json
// .prettierrc
{
  "plugins": ["prettier-plugin-mdc"],
  "overrides": [
    {
      "files": ["*.md"],
      "options": {
        "parser": "mdc"
      }
    }
  ]
}
```

Or in `prettier.config.js`:

```js
export default {
  plugins: ["prettier-plugin-mdc"],
  overrides: [
    {
      files: ["*.md"],
      options: {
        parser: "mdc",
      },
    },
  ],
};
```

Then format your `.mdc` or `.md` files:

```bash
prettier --write "**/*.mdc"
prettier --write "**/*.md"
```

For MDC Syntax Reference, please check [remark-mdc](https://github.com/nuxt-content/remark-mdc).

## License

[MIT](./LICENSE). Made with ❤️ by [Ray](https://github.com/so1ve)
