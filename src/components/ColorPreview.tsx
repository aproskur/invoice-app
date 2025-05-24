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
  
  export default function ColorPreview() {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8">
        {colorNames.map((name) => (
          <div key={name} className="flex flex-col items-center text-sm">
            <div
              className={`w-16 h-16 rounded shadow-md bg-${name}`}
              style={{ backgroundColor: `hsl(var(--${name}-hsl))` }}
            />
            <span className="mt-2">{name}</span>
          </div>
        ))}
      </div>
    );
  }
  