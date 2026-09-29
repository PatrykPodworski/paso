// @vitest-environment node
import { describe, it } from "vitest";
import { RuleTester } from "oxlint/plugins-dev";
import componentFilename from "./react-component-filename.mjs";
import propsType from "./react-props-type.mjs";

RuleTester.describe = describe;
RuleTester.it = it;

const tester = new RuleTester({ languageOptions: { parserOptions: { lang: "tsx" } } });

tester.run("named-props-type", propsType.rules["named-props-type"], {
  valid: [
    "type Props = { a: string }; const Named = ({ a }: Props) => a;",
    'const Generic = (props: ComponentProps<"button">) => props;',
    'const Picked = ({ a }: Pick<Props, "a">) => a;',
    "const Combined = ({ a }: Props & Other) => a;",
    "const Unannotated = (props) => props;",
    "const NoProps = () => null;",
    "const useThing = ({ a }: { a: string }) => a;",
    "const helper = (value: { a: string }) => value.a;",
    "const MAX_ITEMS = (value: { a: string }) => value;",
    "const Pair = (a: string, b: { x: number }) => a;",
    "const Card = ({ onDone = (value: { a: string }) => value }: Props) => onDone;",
    "const sections = [{ render: ({ a }: { a: string }) => a }];",
  ],
  invalid: [
    { code: "const Inline = ({ a }: { a: string }) => a;", errors: [{ messageId: "named" }] },
    { code: "const Ident = (props: { a: string }) => props.a;", errors: 1 },
    { code: "function Decl({ a }: { a: string }) { return a; }", errors: 1 },
    { code: "const Expr = function ({ a }: { a: string }) { return a; };", errors: 1 },
    { code: "const Memo = memo(({ a }: { a: string }) => a);", errors: 1 },
    { code: "const Ref = forwardRef((props: { a: string }, ref) => ref);", errors: 1 },
    { code: "const Defaulted = ({ a }: { a?: string } = {}) => a;", errors: 1 },
    { code: "const Intersect = ({ a }: Props & { b: number }) => a;", errors: 1 },
    { code: "const Union = (props: { a: string } | { b: string }) => props;", errors: 2 },
    { code: "const Generic = ({ a }: Readonly<{ a: string }>) => a;", errors: 1 },
    {
      code: "const Nested = ({ items }: { items: { id: string }[] }) => items;",
      errors: [{ messageId: "named", column: 27 }],
    },
    { code: "export default function ({ a }: { a: string }) { return a; }", errors: 1 },
    { code: "export default ({ a }: { a: string }) => a;", errors: 1 },
    {
      code: "const Outer = () => { const Inner = ({ a }: { a: string }) => a; return Inner; };",
      errors: 1,
    },
  ],
});

tester.run("match-component", componentFilename.rules["match-component"], {
  valid: [
    { code: "export const Only = () => null;", filename: "Only.tsx" },
    { code: "export function Page() { return null; }", filename: "Page.tsx" },
    { code: "const UserCard = () => null; export default UserCard;", filename: "UserCard.tsx" },
    {
      code: "export const Header = () => null; export const Footer = () => null;",
      filename: "Layout.tsx",
    },
    {
      code: "export const useThing = () => 1; export const LIMIT = 3; export const MAX_SIZE = () => 1; export const Good = () => null;",
      filename: "Good.tsx",
    },
    {
      code: "const Private = () => null; export const helper = () => Private;",
      filename: "helpers.tsx",
    },
    { code: 'import { Good } from "./Good"; export { Good };', filename: "index.tsx" },
    { code: "export const Story = () => null;", filename: "Story.stories.tsx" },
    {
      code: 'export const sections = [{ id: "a", render: () => null }];',
      filename: "sections.tsx",
    },
    { code: "const App = () => null; render(App);", filename: "main.tsx" },
    { code: "export default () => null;", filename: "anything.tsx" },
  ],
  invalid: [
    {
      code: "export const stop = () => {}; export const PlayButton = () => null;",
      filename: "Player.tsx",
      errors: [
        {
          messageId: "rename",
          data: { name: "PlayButton", file: "Player.tsx", ext: ".tsx" },
        },
      ],
    },
    {
      code: "const Row = () => null; export const UserList = () => Row;",
      filename: "Users.tsx",
      errors: 1,
    },
    { code: "export default function Page() { return null; }", filename: "page.tsx", errors: 1 },
    { code: "export const Card = memo(() => null);", filename: "Tile.tsx", errors: 1 },
    { code: "const Local = () => null; export { Local };", filename: "Other.tsx", errors: 1 },
    {
      code: "export const Bar = () => null;",
      filename: "Foo.stories.tsx",
      errors: [
        {
          messageId: "rename",
          data: { name: "Bar", file: "Foo.stories.tsx", ext: ".stories.tsx" },
        },
      ],
    },
  ],
});
