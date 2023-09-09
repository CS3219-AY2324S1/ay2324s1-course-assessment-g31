module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'airbnb-typescript',
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
     project: ['./tsconfig.json', './tsconfig.node.json']
  },
  plugins: ['react-refresh', "@typescript-eslint", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/no-absolute-path": "off",
    "import/no-extraneous-dependencies": [
      "error", 
      { "devDependencies": true }
    ],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
