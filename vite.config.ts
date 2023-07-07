/// <reference types="vitest" />
import { defineConfig } from 'vite';

import viteTsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    viteTsConfigPaths()
  ],

  test: {
    environment: 'node',
    include: [
      'src/specs/**/*.{test,spec}.ts'
    ]
  },
});
