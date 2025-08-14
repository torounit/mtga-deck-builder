import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import honoEslintConfig from '@hono/eslint-config'
import eslintConfigPrettier from 'eslint-config-prettier'
import { includeIgnoreFile } from '@eslint/compat'
import { fileURLToPath } from 'node:url'

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url))

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  honoEslintConfig,
  eslintConfigPrettier,
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  {
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    }
  }
)
