import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const coreWebVitals = require('eslint-config-next/core-web-vitals');
const typescript = require('eslint-config-next/typescript');

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'test-results/**',
      'public/**',
      '.claude/worktrees/**',
      'mockups/**',
      'v1_classic_storybook/**',
      'v2_modern_editorial/**',
      'v3_whimsical_playful/**',
      'v4_heritage_literary/**',
      'v5_warm_faith_forward/**',
      'v6_twilight_imprint/**',
      'v7_library_hearth/**',
      'v8_split_magland/**',
      'claude-config/**',
      '**/*.tsbuildinfo',
    ],
  },
];

export default eslintConfig;
