import { ESLintUtils } from '@typescript-eslint/experimental-utils';
import ts from 'typescript';

export default ESLintUtils.RuleCreator(x => `${x}`)({
  name: 'no-explicit-type-exports',
  meta: {
    type: 'problem',
    fixable: 'code',
    docs: {
      description: 'Disallows awaiting a value that is not a Thenable',
      category: 'Best Practices',
      recommended: 'error',
      requiresTypeChecking: true,
    },
    messages: {
      'explicitExports': "Do not export '${name}' it is an imported type or interface."
    },
    schema: []
  },
  defaultOptions: [],
  create(context) {
    const parserServices = ESLintUtils.getParserServices(context);
    const checker = parserServices.program.getTypeChecker();

    return {
      ExportNamedDeclaration(node): void {
        node.specifiers.forEach(x => {
          const originalNode = parserServices.esTreeNodeToTSNodeMap.get(x);
          const symbol = checker.getSymbolAtLocation(originalNode.name);
          const declaredType = checker.getDeclaredTypeOfSymbol(symbol).symbol.declarations[0];
          const isTypeDeclaration = ts.isInterfaceDeclaration(declaredType) || ts.isTypeAliasDeclaration(declaredType);

          if(isTypeDeclaration) {
            context.report({
              node,
              messageId: 'explicitExports', 
            });
          }

          debugger;
        })
      },
    }

  }
});
