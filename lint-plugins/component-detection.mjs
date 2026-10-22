// What the lint plugins treat as a React component: a PascalCase function, possibly wrapped
// in `memo(...)` or `forwardRef(...)`.

// PascalCase, not SCREAMING_CASE: `UserCard` is a component name, `MAX_ITEMS` is not.
export const isComponentName = (name) => /^[A-Z]/.test(name) && /[a-z]/.test(name);

export const isFunction = (node) =>
  ["ArrowFunctionExpression", "FunctionExpression"].includes(node?.type);

// `memo(() => ...)` and `forwardRef(() => ...)` wrap the component function.
export const unwrapCall = (init) => (init?.type === "CallExpression" ? init.arguments[0] : init);

export const isComponentDeclarator = ({ id, init }) =>
  id.type === "Identifier" && isComponentName(id.name) && isFunction(unwrapCall(init));
