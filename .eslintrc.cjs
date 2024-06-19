module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
  },
  parserOptions: {
    requireConfigFile: false,
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx', '*.mjs'],
      parserOptions: {
        ecmaVersion: 2021,
      },
    },
  ],
};
