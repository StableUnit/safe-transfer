module.exports = {
    arrowParens: 'always',
    printWidth: 120,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
    endOfLine: 'auto',
    semi: true,
    singleQuote: true,
    tabWidth: 4,
    trailingComma: 'all',
    overrides: [
        {
            files: ['*.js', '*.ts', '*.jsx', '*.tsx'],
            options: {
                parser: 'typescript',
            },
        },
        {
            files: ['*.md'],
            options: {
                parser: 'markdown',
            },
        },
        {
            files: ['*.json'],
            options: {
                parser: 'json',
            },
        },
    ],
};
