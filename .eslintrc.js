module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Integrates Prettier rules into ESLint
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Link to your tsconfig for type-aware linting
  },
  plugins: [
    '@typescript-eslint',
    'prettier', // Add prettier plugin
  ],
  rules: {
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // Enforce Prettier rules, auto handles line endings
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // Warn about console.log in production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Warn about unused vars, ignore if prefixed with _
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about using 'any' type
    // Add other specific rules as needed
    'indent': 'off', // Handled by Prettier
    '@typescript-eslint/indent': 'off', // Handled by Prettier
    'linebreak-style': 'off', // Handled by Prettier/Git
    'quotes': 'off', // Handled by Prettier
    'semi': 'off', // Handled by Prettier
  },
  ignorePatterns: ['node_modules/', 'dist/', '*.js', '*.d.ts'], // Ignore JS files in root, dist, etc.
};
