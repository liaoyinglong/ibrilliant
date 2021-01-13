const OFF = 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WARN = 1;
const ERROR = 2;

module.exports = {
  extends: [require.resolve("@umijs/fabric/dist/eslint")],
  rules: {
    "no-underscore-dangle": OFF,
    "no-console": OFF,
    "global-require": OFF,
    "consistent-return": OFF,
    "no-void": OFF,
    "no-param-reassign": OFF,
    "spaced-comment": OFF,
    "no-extra-boolean-cast": OFF,
    "import/no-extraneous-dependencies": OFF,
    "max-classes-per-file": OFF,
    "no-plusplus": OFF,
    "no-restricted-properties": OFF,
    "prefer-rest-params": OFF,
    "class-methods-use-this": OFF,

    "@typescript-eslint/lines-between-class-members": OFF,
    "@typescript-eslint/no-parameter-properties": OFF,
    "@typescript-eslint/consistent-type-definitions": OFF,

    "react/button-has-type": OFF,
    "react/react-in-jsx-scope": OFF,
    "react/self-closing-comp": OFF,
    "react/no-unescaped-entities": OFF,

    "react-hooks/rules-of-hooks": ERROR,
    "react-hooks/exhaustive-deps": ERROR,
  },
};
