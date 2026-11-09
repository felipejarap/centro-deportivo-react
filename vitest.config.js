import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['tests/karma/**', 'node_modules/**']
  }
});
