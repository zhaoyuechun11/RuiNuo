module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],

  // in antd-design-pro
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    // note you must disable the base rule as it can report incorrect errors
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true }],
  },
};
