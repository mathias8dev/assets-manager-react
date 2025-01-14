import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import {parserOptions, rules} from "eslint-config-next";

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    rules = {
        "@typescript-eslint/explicit-function-return-type": "off",
    },
    parserOptions ={
        project: 'tsconfig.json',
    }
);