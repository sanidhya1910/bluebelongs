'use client';

import { Cloud, MapPin, ThermometerSun, Wind } from 'lucide-react';
import type { Weather } from '@/data/itinerary';

interface WeatherCardProps {
  title: string;
  weather: Weather;
  subtitle?: string;
  climateNote?: string;
}

export default function WeatherCard({ title, weather, subtitle = 'Live Weather', climateNote }: WeatherCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-sky-600" />
          <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        </div>
        <span className="text-sm text-slate-500">{subtitle}</span>
      </div>
      <div className="grid grid-cols-3 gap-4 items-center">
        <div className="flex items-center gap-2">
          <ThermometerSun className="h-5 w-5 text-sky-600" />
          <span className="text-slate-700">{weather.temp !== null ? `${weather.temp}°C` : '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-sky-600" />
          <span className="text-slate-700">{weather.wind !== null ? `${weather.wind} km/h` : '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-sky-600" />
          <span className="text-slate-700">{weather.code !== null ? 'Conditions updated' : '—'}</span>
        </div>
      </div>
      {climateNote && (
        <div className="mt-4 text-slate-600 text-sm">{climateNote}</div>
      )}
    </div>
  );
}
