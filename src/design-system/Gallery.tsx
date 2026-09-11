import { sections } from "./sections";

// A test harness, not a designed page. Reached at /#design-system; see src/main.tsx.
const Gallery = () => (
  <main className="flex flex-col gap-8 p-8">
    <h1>Design system</h1>
    {sections.map(({ id, name, render }) => (
      <section key={id} data-section={id} className="flex flex-col items-start gap-4">
        <h2>{name}</h2>
        {render()}
      </section>
    ))}
  </main>
);
export default Gallery;
