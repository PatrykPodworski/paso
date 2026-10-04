import { sections } from "./sections";

// A test harness, not a designed page. Reached at /#design-system; see src/main.tsx.
const Gallery = () => (
  <main className="flex flex-col gap-8 p-8">
    <h1 className="font-serif text-4xl font-semibold tracking-tight leading-tight">
      Design system
    </h1>
    {sections.map(({ id, name, render }) => (
      <section key={id} data-section={id} className="flex flex-col items-start gap-4">
        <h2 className="font-serif text-2xl font-semibold tracking-tight leading-tight">{name}</h2>
        {render()}
      </section>
    ))}
  </main>
);

export default Gallery;
