'use client';

import type { TransportOption } from '@/data/itinerary';

interface TransportCardProps {
  option: TransportOption;
  icon?: React.ReactNode;
}

export default function TransportCard({ option, icon }: TransportCardProps) {
  return (
    <div className="card">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-slate-800 ml-3">{option.title}</h3>
      </div>
      <p className="text-slate-600 mb-4">{option.description}</p>
      <ul className="space-y-2 mb-4">
        {option.details.map((detail, idx) => (
          <li key={idx} className="flex items-start text-sm text-slate-600">
            <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
            {detail}
          </li>
        ))}
      </ul>
      <div className="sand-gradient p-3 rounded-lg border border-slate-200">
        <p className="text-sm text-slate-700">
          <strong>Tip:</strong> {option.tips}
        </p>
      </div>
    </div>
  );
}
