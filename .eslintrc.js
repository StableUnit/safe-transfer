module.exports = {
    env: {
        mocha: true,
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "airbnb",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:jsx-a11y/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
        "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
        "react/jsx-props-no-spreading": "off",
        "react/no-unescaped-entities": "off",
        "react/require-default-props": "off",
        semi: [2, "always"],
        "no-use-before-define": "off",
        "no-restricted-syntax": "off",
        "no-await-in-loop": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "arrow-body-style": "off",
        "import/no-extraneous-dependencies": "warn",
        "jsx-a11y/click-events-have-key-events": "off",
        "jsx-a11y/no-static-element-interactions": "off",
        "jsx-a11y/no-noninteractive-element-interactions": "off",
        "jsx-a11y/alt-text": "off",
        "jsx-a11y/label-has-associated-control": [
            "error",
            {
                required: {
                    some: ["nesting", "id"],
                },
            },
        ],
        "jsx-a11y/label-has-for": [
            "error",
            {
                required: {
                    some: ["nesting", "id"],
                },
            },
        ],
        "react/self-closing-comp": "warn",
        "consistent-return": "warn",
        "import/prefer-default-export": "warn",
        "no-unused-vars": "off",
        "no-empty-pattern": "off",
        "max-len": ["error", { code: 120 }],
    },
};
