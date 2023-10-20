import { Converter, ReflectionKind } from 'typedoc';

/** @param {Readonly<import('typedoc').Application>} app */
export function load(app) {
  /**
   * @param {import('typedoc').Context} context
   * @param {import('typedoc').DeclarationReflection} reflection
   */
  function handleCreateDeclaration(context, reflection) {
    if (['default', 'export='].includes(reflection.name) && reflection.parent) {
      reflection.kind = ReflectionKind.Property;

      add_badge: {
        const symbol = context.project.getSymbolFromReflection(reflection);
        if (symbol.declarations?.length) {
          const node = symbol.declarations[0];
          /** @type {{ getText(): string } | undefined} */
          const name = node.name;
          if (name) {
            reflection.flags.unshift(node.name.getText());
            break add_badge;
          }
        }

        let name = reflection.parent.getFriendlyFullName();
        name = name.split('/').at(-1);
        name = name.replace(/[_.\- ]+(\w)/g, (m, x) => x.toUpperCase());
        reflection.flags.unshift(name);
      }
    }
  }
  app.converter.on(Converter.EVENT_CREATE_DECLARATION, handleCreateDeclaration);
}
