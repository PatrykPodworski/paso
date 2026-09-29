// oxlint JS plugin. Rule `react-props-type/named-props-type`: a React component's props
// parameter uses a named type or interface (`type Props = {...}`), not an inline object type.
// The rule looks for object type literals in the first parameter's annotation, also inside
// `&`, `|` and generic arguments (`Readonly<{...}>`), and reports the outermost one only.
// A component is a PascalCase function at any depth: `const X = () => ...`,
// `const X = memo(...)`, `const X = forwardRef(...)`, `function X() {}`, or an anonymous
// `export default` function. No options.

// PascalCase, not SCREAMING_CASE: `UserCard` is a component name, `MAX_ITEMS` is not.
const isComponentName = (name) => /^[A-Z]/.test(name) && /[a-z]/.test(name);

const isFunction = (node) => ["ArrowFunctionExpression", "FunctionExpression"].includes(node?.type);

// `memo(() => ...)` and `forwardRef(() => ...)` wrap the component function.
const unwrapCall = (init) => (init?.type === "CallExpression" ? init.arguments[0] : init);

const isComponentDeclarator = ({ id, init }) =>
  id.type === "Identifier" && isComponentName(id.name) && isFunction(unwrapCall(init));

// `({ a }: Props = {})` keeps the annotation on the left side of the default value.
const annotationOf = (param) =>
  (param?.type === "AssignmentPattern" ? param.left : param)?.typeAnnotation?.typeAnnotation;

// `A & B` and `A | B` hold `types`; `Readonly<{...}>` holds `typeArguments`.
const typeChildren = (type) => [...(type.types ?? []), ...(type.typeArguments?.params ?? [])];

const typeLiteralsIn = (type) =>
  type.type === "TSTypeLiteral" ? [type] : typeChildren(type).flatMap(typeLiteralsIn);

const namedPropsType = {
  meta: {
    type: "suggestion",
    docs: { description: "Component props use a named type, not an inline object type." },
    messages: {
      named:
        "Component props need a named type or interface (e.g. `type Props = {...}`), not an inline object type.",
    },
    schema: [],
  },
  create(context) {
    const check = (component) => {
      const annotation = annotationOf(component.params[0]);

      if (!annotation) {
        return;
      }

      for (const literal of typeLiteralsIn(annotation)) {
        context.report({ node: literal, messageId: "named" });
      }
    };

    return {
      VariableDeclarator(node) {
        if (isComponentDeclarator(node)) {
          check(unwrapCall(node.init));
        }
      },
      // Only `export default function () {}` declares a function without a name.
      FunctionDeclaration(node) {
        if (!node.id || isComponentName(node.id.name)) {
          check(node);
        }
      },
      ExportDefaultDeclaration({ declaration }) {
        if (isFunction(declaration)) {
          check(declaration);
        }
      },
    };
  },
};

export default {
  meta: { name: "react-props-type" },
  rules: { "named-props-type": namedPropsType },
};
