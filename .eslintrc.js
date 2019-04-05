module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],

  plugins: [
    'vue',
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'no-unused-expressions': ['error', { 'allowShortCircuit': true, 'allowTernary': true }],
    'vue/component-name-in-template-casing': 'off',
    'vue/attribute-hyphenation': 'off',
  },
};
