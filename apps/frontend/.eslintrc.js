module.exports = {
  ...require('config/eslint-frontend.js'),
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
};
