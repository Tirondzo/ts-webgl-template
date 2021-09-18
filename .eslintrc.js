module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    './node_modules/gts', // Use google typescript styleguide
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
  },
  overrides: [
    {
      files: ['webpack.config.ts', 'test/**/*.js'],
      rules: {
        'node/no-unpublished-require': 'off',
        'node/no-unpublished-import': 'off',
      },
    },
  ],
};
