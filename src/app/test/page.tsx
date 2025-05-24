// app/test/page.tsx

const colorNames = [
  'background',
  'foreground',
  'primary',
  'primary-light',
  'danger',
  'danger-soft',
  'muted',
  'accent',
  'panel-dark',
  'panel-darker',
  'border',
];

export default function Test() {
  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold mb-6">Color Token Preview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {colorNames.map((name) => (
          <div key={name} className="flex flex-col items-center text-center">
            <div
              className="w-20 h-20 rounded shadow-md border"
              style={{ backgroundColor: `hsl(var(--${name}-hsl))` }}
            />
            <span className="mt-2 text-sm">{name}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
