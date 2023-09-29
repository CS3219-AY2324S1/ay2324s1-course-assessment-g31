/* eslint-env node */
module.exports = {
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    root: true,
    overrides: [{
        files: ['*.test.ts'],
        rules: {
            '@typescript-eslint/no-var-requires': 'off',
        },
    }, ],
};