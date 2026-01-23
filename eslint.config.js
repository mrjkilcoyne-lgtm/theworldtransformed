import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  ...eslintPluginAstro.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Customize rules as needed
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
    ],
  },
];
