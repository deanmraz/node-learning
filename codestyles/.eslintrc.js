module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  extends: [
    'prettier',
    'eslint:recommended'
  ],
  env: {
    node: true
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'comma-dangle': 0,
    'prefer-const': 1,
    'no-constant-condition': 0,
    'no-console': 1
  },
};
