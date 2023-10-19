module.exports = {
    arrowParens: "always",
    printWidth: 120,
    semi: true,
    tabWidth: 4,
    overrides: [
        {
            files: ["*.js", "*.ts", "*.jsx", "*.tsx"],
            options: {
                parser: "typescript",
            },
        },
        {
            files: ["*.md"],
            options: {
                parser: "markdown",
            },
        },
        {
            files: ["*.json"],
            options: {
                parser: "json",
            },
        },
    ],
};
