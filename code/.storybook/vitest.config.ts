import { defaultExclude, defineProject, mergeConfig } from 'vitest/config';

import Inspect from 'vite-plugin-inspect';

import { vitestCommonConfig } from '../vitest.workspace';

const extraPlugins: any[] = [];
if (process.env.INSPECT === 'true') {
  // this plugin assists in inspecting the Storybook Vitest plugin's transformation and sourcemaps
  extraPlugins.push(
    Inspect({
      outputDir: '../.vite-inspect',
      build: true,
      open: true,
      include: ['**/*.stories.*'],
    })
  );
}
export default mergeConfig(
  vitestCommonConfig,
  // @ts-expect-error added this because of testNamePattern below
  defineProject({
    plugins: [
      import('@storybook/experimental-addon-test/vitest-plugin').then(({ storybookTest }) =>
        storybookTest({
          configDir: process.cwd(),
          tags: {
            include: ['vitest'],
          },
        })
      ),
      ...extraPlugins,
    ],
    test: {
      name: 'storybook-ui',
      include: [
        '../addons/**/*.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/argMapping.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/args.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/argTypes.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/autotitle.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/component-play.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/decorators.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/exportOrder.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/globals.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/hooks.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/indexer.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/interleavedExports.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/layout.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/loaders.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/names.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/parameters.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/rendering.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/shortcuts.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/tags-add.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/tags-config.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/tags-remove.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/title.{story,stories}.?(c|m)[jt]s?(x)',
        // '../core/template/stories/unicode.{story,stories}.?(c|m)[jt]s?(x)',
        '../core/src/manager/**/*.{story,stories}.?(c|m)[jt]s?(x)',
        '../core/src/preview-api/**/*.{story,stories}.?(c|m)[jt]s?(x)',
        '../core/src/components/{brand,components}/**/*.{story,stories}.?(c|m)[jt]s?(x)',
      ],
      exclude: [
        ...defaultExclude,
        '../node_modules/**',
        '**/__mockdata__/**',
        '../**/__mockdata__/**',
        // expected to fail in Vitest because of fetching /iframe.html to cause ECONNREFUSED
        '**/Zoom.stories.tsx',
      ],
      // TODO: bring this back once portable stories support @storybook/core/preview-api hooks
      // @ts-expect-error this type does not exist but the property does!
      testNamePattern: /^(?!.*(UseState)).*$/,
      browser: {
        enabled: true,
        name: 'chromium',
        provider: 'playwright',
        headless: true,
        screenshotFailures: false,
      },
      setupFiles: ['./storybook.setup.ts'],
      environment: 'happy-dom',
    },
  })
);
