module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    extends: "airbnb",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
        "react/no-array-index-key": "off",
        "no-shadow": ["error", { "builtinGlobals": false, "hoist": "functions", "allow": ["board"] }],
        "import/no-named-as-default": 0
    }
};
