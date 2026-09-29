// oxlint JS plugin. Rule `react-component-filename/match-component`: a file that exports
// exactly one React component is named after it, e.g. `export const UserCard` lives in
// `UserCard.tsx` (or `UserCard.stories.tsx`: only the part before the first dot is compared).
// Only top-level exported components count, so a file exporting several is exempt.
// A component is a PascalCase function: `const X = () => ...`, `const X = memo(...)`,
// `const X = forwardRef(...)` or `function X() {}`. No options.
import path from "node:path";

// PascalCase, not SCREAMING_CASE: `UserCard` is a component name, `MAX_ITEMS` is not.
const isComponentName = (name) => /^[A-Z]/.test(name) && /[a-z]/.test(name);

const isFunction = (node) => ["ArrowFunctionExpression", "FunctionExpression"].includes(node?.type);

// `memo(() => ...)` and `forwardRef(() => ...)` wrap the component function.
const unwrapCall = (init) => (init?.type === "CallExpression" ? init.arguments[0] : init);

const isComponentDeclarator = ({ id, init }) =>
  id.type === "Identifier" && isComponentName(id.name) && isFunction(unwrapCall(init));

const componentsIn = (statement) => {
  const node = statement.declaration ?? statement;

  if (node.type === "FunctionDeclaration") {
    return [node.id].filter((id) => id && isComponentName(id.name));
  }

  if (node.type === "VariableDeclaration") {
    return node.declarations.filter(isComponentDeclarator).map(({ id }) => id);
  }

  return [];
};

// `export default UserCard` names an identifier, `export default function UserCard` a declaration.
const defaultExportName = ({ declaration }) => declaration.name ?? declaration.id?.name;

const namedExportNames = (statement) =>
  statement.declaration
    ? componentsIn(statement).map(({ name }) => name)
    : statement.specifiers.map(({ local }) => local.name);

const exportNamesOf = (statement) => {
  if (statement.type === "ExportDefaultDeclaration") {
    return [defaultExportName(statement)];
  }

  if (statement.type === "ExportNamedDeclaration") {
    return namedExportNames(statement);
  }

  return [];
};

const matchComponent = {
  meta: {
    type: "suggestion",
    docs: { description: "A file whose one exported component is X must be named X.tsx." },
    messages: {
      rename: "`{{name}}` is the only exported component here; rename {{file}} to {{name}}{{ext}}.",
    },
    schema: [],
  },
  create(context) {
    return {
      Program(program) {
        const exported = new Set(program.body.flatMap(exportNamesOf));

        const components = program.body
          .flatMap(componentsIn)
          .filter(({ name }) => exported.has(name));

        if (components.length !== 1) {
          return;
        }

        const [component] = components;
        const file = path.basename(context.filename);
        const [stem] = file.split(".");

        if (stem !== component.name) {
          context.report({
            node: component,
            messageId: "rename",
            data: { name: component.name, file, ext: file.slice(stem.length) },
          });
        }
      },
    };
  },
};

export default {
  meta: { name: "react-component-filename" },
  rules: { "match-component": matchComponent },
};
