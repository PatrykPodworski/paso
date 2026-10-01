import { sections } from "./sections";

// A test harness, not a designed page. Reached at /#design-system; see src/main.tsx.
const Gallery = () => (
  <main className="flex flex-col gap-8 p-8">
    <h1 className="font-serif text-[36px] font-semibold tracking-[-1.3px] leading-[1.2]">
      Design system
    </h1>
    {sections.map(({ id, name, render }) => (
      <section key={id} data-section={id} className="flex flex-col items-start gap-4">
        <h2 className="font-serif text-[27px] font-semibold tracking-[-0.7px] leading-[1.25]">
          {name}
        </h2>
        {render()}
      </section>
    ))}
  </main>
);

export default Gallery;
