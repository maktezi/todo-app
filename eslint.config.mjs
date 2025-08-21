import perfectionist from "eslint-plugin-perfectionist";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
    {
        plugins: {
            perfectionist,
        },
        rules: {
            "perfectionist/sort-imports": "error",
            "perfectionist/sort-interfaces": ["error"],
            "perfectionist/sort-objects": [
                "error",
                {
                    type: "alphabetical",
                },
            ],
        },
        settings: {
            perfectionist: {
                partitionByComment: true,
                type: "alphabetical",
            },
        },
    },
]);
