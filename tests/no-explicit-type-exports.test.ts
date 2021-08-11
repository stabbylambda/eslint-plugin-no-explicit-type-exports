import { RuleTester } from '@typescript-eslint/experimental-utils/dist/eslint-utils';
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import rule from '../src/rules/no-explicit-type-exports';

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    tsconfigRootDir: path.join(__dirname, "files"),
    project: './tsconfig.json',
  },
  parser: '@typescript-eslint/parser'
});

ruleTester.run('no-explicit-type-exports', rule, {
  valid: [
    // { code: "import baz, {bar, foo} from './bar'; export {baz}" },
    // { code: "import baz from './bar'; export { baz as IBaz }" },
    // { code: "import baz, {bar, foo} from './noFile'; export {baz}" },
    // { code: "import baz, {bar, foo} from './noFile';" },
    // { code: "import {foo} from './bar';" },
    // { code: "import {bar} from './bar';" },
    // { code: "import type { x } from './oneLine'; export type { x };" },
    // { code: "export type { foo } from './bar';" },
    // { code: "export type { foo as IFoo } from './bar';" },
    // { code: "export type { foo } from './bar'; export  { baz } from './bar';" },
    // { code: " export * from './bar';" },
    // { code: "import type * as types from './bar'; export type {types};" },
    // { code: "import type * as types from './bar'; export {types};" },
  ],
  invalid: [
    {
      code: `import {bar} from './bar'; 
      export {bar};
      `,
      output: "import type { bar } from './bar';\n export type { bar };\n",
      errors: [
        {
          line: 2,
          messageId: 'explicitExports',
        },
      ],
    },
    // {
    //   // The rule fails when you export an imported interface
    //       code: "import baz, {bar, foo} from './bar'; export {bar};",
    //   output:
    //     "import type { bar,foo } from './bar';\nimport { baz } from './bar'; export type { bar };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when you export an imported type
    //       code: "import baz, {bar, foo} from './bar'; export {foo};",
    //   output:
    //     "import type { bar,foo } from './bar';\nimport { baz } from './bar'; export type { foo };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when you export an imported type (single line type)
    //       code: "import {baz} from './foo'; export {baz};",
    //   output: "import type { baz } from './foo';\n export type { baz };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when you export an imported type (single line type)
    //   // And rename the type using `asType` syntax
    //       code: "import type {baz} from './foo'; export {baz as IBaz};",
    //   output: "import type {baz} from './foo'; export type { baz as IBaz };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when you export an imported interface (single line interface)
    //       code: "import {foo} from './foo'; export {foo};",
    //   output: "import type { foo } from './foo';\n export type { foo };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when you export an imported default type
    //       code: "import aType from './default'; export {aType};",
    //   output:
    //     "import type { aType } from './default';\n export type { aType };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when you export default a type.
    //       code: "import aType from './default'; export default aType;",
    //   output: "import type { aType } from './default';\n export default aType;",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when export and import a type or interface on a single line
    //       code: "export { x } from './oneLine'",
    //   output: "export type { x } from './oneLine';\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails multiple times.
    //       code: "import foo, {bar, baz} from './bar'; export {bar, foo};",
    //   output:
    //     "import type { foo,bar } from './bar';\nimport { baz } from './bar'; export type { bar,foo };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when exporting a type in an export with multiple exports
    //       code: "import {bar, foo, baz} from './bar'; export {baz, foo};",
    //   output:
    //     "import type { bar,foo } from './bar';\nimport { baz } from './bar'; export type { foo };\nexport { baz };",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when exporting a type in an export with multiple export
    //       code: "import foo, {bar, baz} from './bar'; export {foo, baz};",
    //   output:
    //     "import type { foo,bar } from './bar';\nimport { baz } from './bar'; export type { foo };\nexport { baz };",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when there are extra imports in the file.
    //       code: "import {aType} from './randomImports'; export {aType};",
    //   output:
    //     "import type { aType } from './randomImports';\n export type { aType };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when export and import a type or interface on a single line
    //       code: "import type { x } from './oneLine'; export { x };",
    //   output: "import type { x } from './oneLine'; export type { x };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when export and import a type or interface on a single line
    //       code:
    //     "import type { x } from './oneLine';import {bar} from './bar'; export {bar}; export { x };",
    //   output:
    //     "import type { x } from './oneLine';import type { bar } from './bar';\n export type { bar };\n export type { x };\n",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails when export and import a type or interface on a single line
    //       code: "import { x } from './oneLine'; export type { x };",
    //   output: "import type { x } from './oneLine';\n export type { x };",
    //   errors: [
    //   ],
    // },
    // {
    //   // The rule fails single line imported/exported  types
    //       code: "export { foo, baz } from './bar';",
    //   output: "export type { foo } from './bar';\nexport { baz } from './bar';",
    //   errors: [
    //   ],
    // },
  ],
});
