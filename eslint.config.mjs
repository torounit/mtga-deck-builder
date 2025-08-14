import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import baseConfig from '@hono/eslint-config'

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  baseConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
