# auto-configure-eslint-prettier-tsc

Automatic configuration for Eslint, Prettier, Typescript compiler (TSC) in any JavaScript/TypeScript project.

## Requirements
```bash
Node.js 14 or higher
```

This package will install dependencies in recommended versions:
```bash
ESLint @8.57.0
prettier @2.8.0
typescript @5.4.5
@react-native/eslint-config @0.74.84
@tsconfig/react-native @3.0.5
```


## Installation

```bash
npm install --save-dev auto-configure-eslint-prettier-tsc

# or

yarn add --dev auto-configure-eslint-prettier-tsc
```

## Running

```bash
npx configure-project
```

This command will add these files:

1.  .eslintrc.js
2.  .prettierrc.js
3.  tsconfig.json
4.  .prettierignore

If any of these files already exist in your repository, you will be asked for each file whether you want to overwrite it or skip the creation.

It is recommended to overwrite all files to ensure you have the proper configuration based on the Zeronest project.

## Usage

Two scripts will be added to your package.json:

To run eslint check

```bash
yarn run lint
```

To run prettier format

```bash
yarn run format
```
