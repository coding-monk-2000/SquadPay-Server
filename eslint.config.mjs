import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

const commonRules = {
  'no-unused-vars': ['off', { argsIgnorePattern: '^_' }]
};

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], rules: commonRules},
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" }, rules: commonRules },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
]);
