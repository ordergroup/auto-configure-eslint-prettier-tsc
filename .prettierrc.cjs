module.exports = {
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
