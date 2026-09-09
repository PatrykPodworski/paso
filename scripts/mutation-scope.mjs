import { parse } from "@babel/parser";
// Mutate state, decisions, calculations and event handlers. Static JSX copy,
// styling, icons and layout are checked by Playwright's screenshot assertions.
// All non-UI modules are mutated in full; no mutation operators are disabled.
const children = (node) =>
  Object.entries(node).flatMap(([key, value]) =>
    ["loc", "tokens", "comments", "extra"].includes(key)
      ? []
      : Array.isArray(value)
        ? value.filter((v) => v && typeof v.type === "string")
        : value && typeof value.type === "string"
          ? [value]
          : [],
  );
const isJSX = (node) => node.type === "JSXElement" || node.type === "JSXFragment";
export const businessRanges = (source) => {
  const tree = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
  const ranges = [];
  const roots = [];
  const findRoots = (node) => {
    if (isJSX(node)) {
      roots.push([node.start, node.end]);
      return;
    }
    for (const child of children(node)) {
      findRoots(child);
    }
  };
  findRoots(tree);
  let cursor = 0;
  for (const [start, end] of roots.sort((a, b) => a[0] - b[0])) {
    if (start > cursor) {
      ranges.push([cursor, start]);
    }
    cursor = end;
  }
  if (cursor < source.length) {
    ranges.push([cursor, source.length]);
  }
  const containsJSX = (node) => isJSX(node) || children(node).some(containsJSX);
  const addExpression = (node) => {
    if (
      !node ||
      isJSX(node) ||
      /^(String|Numeric|Null|Boolean)Literal$/.test(node.type) ||
      node.type === "JSXEmptyExpression"
    ) {
      return;
    }
    if (node.type === "ConditionalExpression") {
      addExpression(node.test);
      addExpression(node.consequent);
      addExpression(node.alternate);
      return;
    }
    if (!containsJSX(node)) {
      ranges.push([node.start, node.end]);
      return;
    }
    if (node.type === "LogicalExpression") {
      addExpression(node.left);
      addExpression(node.right);
      return;
    }
    for (const child of children(node)) {
      addExpression(child);
    }
  };
  const visit = (node, parent) => {
    if (node.type === "JSXExpressionContainer") {
      const attr = parent?.type === "JSXAttribute" ? parent.name.name : null;
      if (
        !attr ||
        /^on[A-Z]/.test(attr) ||
        [
          "disabled",
          "checked",
          "aria-pressed",
          "aria-expanded",
          "draft",
          "limit",
          "key",
          "progress",
          "q",
          "lesson",
        ].includes(attr)
      ) {
        addExpression(node.expression);
      }
    }
    for (const child of children(node)) {
      visit(child, node);
    }
  };
  visit(tree);
  const merged = [];
  for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) {
    const previous = merged.at(-1);
    if (previous && start <= previous[1]) {
      previous[1] = Math.max(end, previous[1]);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
};
export const mutationGlobs = (file, source) => {
  const position = (offset) => {
    const before = source.slice(0, offset).split("\n");
    return `${before.length}:${before.at(-1).length}`;
  };
  return businessRanges(source).map(
    ([start, end]) => `${file}:${position(start)}-${position(end)}`,
  );
};
