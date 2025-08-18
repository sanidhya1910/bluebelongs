'use client';

interface ChecklistProps {
  title: string;
  items: string[];
}

export default function Checklist({ title, items }: ChecklistProps) {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <label key={index} className="flex items-center">
            <input type="checkbox" className="mr-3 rounded text-sky-500" />
            <span className="text-slate-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
