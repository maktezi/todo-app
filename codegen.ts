import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    documents: "./client/graphql/*",
    generates: {
        "./client/types/codegen/": {
            plugins: [],
            preset: "client",
        },
    },
    overwrite: true,
    schema: "http://127.0.0.1:8000/graphql",
};

export default config;
