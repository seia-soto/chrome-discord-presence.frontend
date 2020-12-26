module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    webextensions: true
  },
  extends: [
    'standard',
    'standard-jsx',
    'standard-react'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    chrome: true
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 'first'
      }
    ]
  }
}
