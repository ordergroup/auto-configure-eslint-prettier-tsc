#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import {execSync} from 'child_process';

const prettierConfig = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: [
    '^react$',
    '^react-native$',
    '<THIRD_PARTY_MODULES>',
    '^@core/(.*)$',
    '^@server/(.*)$',
    '^@ui/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

const prettierIgnore = `
build
node_modules
README.md
.next
out
`.trim();

const tsConfig = {
  extends: '@tsconfig/react-native/tsconfig.json',
  compilerOptions: {
    noImplicitAny: true,
    strictFunctionTypes: true,
    strictPropertyInitialization: true,
    noImplicitThis: true,
    alwaysStrict: true,
  },
};

const eslintConfig = {
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
};

const posibleEslintFiles = [
  '.eslintrc.json',
  '.eslintrc.cjs',
  '.eslintrc.mjs',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  'eslint.config.js',
  'eslint.config.mjs',
  'eslint.config.cjs',
];

const checkAndRenameExistingConfig = async () => {
  for (const file of posibleEslintFiles) {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `File ${file} already exists. This package uses .eslintrc.js. Do you want to rename your file to old_${file} and use our config file? If you don't agree eslint might not work properly.`,
          default: true,
        },
      ]);

      const currentName = path.basename(filePath);
      const newName = `old_${currentName}`;

      if (answers.overwrite) {
        const oldFilePath = `${path.dirname(filePath)}/${newName}`;
        fs.renameSync(filePath, oldFilePath);
        console.log(`Renamed ${currentName} to ${newName}`);
      } else {
        console.log(`Skipped renaming ${currentName}`);
      }
    }
  }
};

const writeConfigFile = async (filePath, config, isModule, isJSONStringify) => {
  const prePath = isModule ? 'module.exports = ' : '';

  const fileName = path.basename(filePath);

  const createFile = () => {
    const content = isJSONStringify ? JSON.stringify(config, null, 2) : config;
    fs.writeFileSync(filePath, `${prePath}${content}`);
  };

  if (fs.existsSync(filePath)) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'overwrite',
        message: `File ${fileName} already exists. Overwrite?`,
        default: true,
      },
    ]);

    if (answers.overwrite) {
      createFile();
      console.log(`Overwritten ${fileName}`);
    } else {
      console.log(`Skipped ${fileName}`);
    }
  } else {
    createFile();
    console.log(`Created ${fileName}`);
  }
};

const updatePackageJson = () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.scripts = {
    ...packageJson.scripts,
    lint: "eslint '**/*.{js,ts,jsx,tsx}'",
    format: 'prettier --write .',
  };

  // Add devDependencies if they do not exist
  packageJson.devDependencies = packageJson.devDependencies || {};

  if (
    !packageJson.devDependencies['eslint'] &&
    !packageJson.dependencies['eslint']
  ) {
    packageJson.devDependencies['eslint'] = '^8.57.0';
  }
  if (
    !packageJson.devDependencies['prettier'] &&
    !packageJson.dependencies['prettier']
  ) {
    packageJson.devDependencies['prettier'] = '^2.8.0';
  }
  if (
    !packageJson.devDependencies['typescript'] &&
    !packageJson.dependencies['typescript']
  ) {
    packageJson.devDependencies['typescript'] = '^5.4.5';
  }

  if (
    !packageJson.devDependencies['@react-native/eslint-config'] &&
    !packageJson.dependencies['@react-native/eslint-config']
  ) {
    packageJson.devDependencies['@react-native/eslint-config'] = '^0.74.84';
  }

  if (
    !packageJson.devDependencies['@tsconfig/react-native'] &&
    !packageJson.dependencies['@tsconfig/react-native']
  ) {
    packageJson.devDependencies['@tsconfig/react-native'] = '^3.0.5';
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Updated scripts in package.json');
};

const installDependencies = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'installDependencies',
      message:
        'Do you want to install ESLint @8.57.0, prettier @2.8.0, typescript @5.4.5 @react-native/eslint-config @0.74.84 @tsconfig/react-native @3.0.5?',
      default: true,
    },
  ]);

  if (answers.installDependencies) {
    try {
      console.log('Installing dependencies...');
      execSync(
        'yarn add eslint@^8.57.0 prettier@^2.8.0 typescript@^5.4.5 @react-native/eslint-config@^0.74.84 @tsconfig/react-native@^3.0.5 --dev',
        {stdio: 'inherit'},
      );
      console.log('Dependencies installed');
    } catch (error) {
      console.error('Failed to install dependencies', error);
    }
  } else {
    console.log('Skipped installing dependencies');
  }
};

const run = async () => {
  await checkAndRenameExistingConfig();

  await writeConfigFile(
    path.resolve(process.cwd(), '.eslintrc.js'),
    eslintConfig,
    true,
    true,
  );
  await writeConfigFile(
    path.resolve(process.cwd(), '.prettierrc.js'),
    prettierConfig,
    true,
    true,
  );
  await writeConfigFile(
    path.resolve(process.cwd(), 'tsconfig.json'),
    tsConfig,
    false,
    true,
  );

  await writeConfigFile(
    path.resolve(process.cwd(), '.prettierignore'),
    prettierIgnore,
    false,
    false,
  );

  updatePackageJson();
  installDependencies();
};

run();
