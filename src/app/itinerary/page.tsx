"use client";
import { useEffect, useState } from 'react';
import { Plane, Ship, MapPin, Clock, AlertCircle, Camera, Utensils } from 'lucide-react';
import CTA from '@/components/ui/CTA';
import WeatherCard from '@/components/itinerary/WeatherCard';
import Checklist from '@/components/itinerary/Checklist';
import InfoCard from '@/components/itinerary/InfoCard';
import TransportCard from '@/components/itinerary/TransportCard';
import { islandCoords, type Weather, transportOptions as baseTransport, itineraryDays, essentialInfo, packingList } from '@/data/itinerary';

export default function ItineraryPage() {
  const [havelock, setHavelock] = useState<Weather>({ temp: null, wind: null, code: null });
  const [neil, setNeil] = useState<Weather>({ temp: null, wind: null, code: null });

  useEffect(() => {
    // Open-Meteo (no API key). Units: metric, current weather
    const fetchWeather = async (lat: number, lon: number) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      return {
        temp: data?.current_weather?.temperature ?? null,
        wind: data?.current_weather?.windspeed ?? null,
        code: data?.current_weather?.weathercode ?? null,
      } as Weather;
    };

    fetchWeather(islandCoords.havelock.lat, islandCoords.havelock.lon)
      .then((w) => w && setHavelock(w))
      .catch(() => {});
    fetchWeather(islandCoords.neil.lat, islandCoords.neil.lon)
      .then((w) => w && setNeil(w))
      .catch(() => {});
  }, []);
  const transportOptions = baseTransport.map((opt, i) => ({
    ...opt,
    icon: i === 0 ? <Plane className="h-8 w-8 text-sky-500" /> : <Ship className="h-8 w-8 text-sky-500" />,
  }));

  // Data moved to src/data/itinerary.ts

  return (
    <div className="min-h-screen sand-section py-12 pt-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Your Journey to Andaman
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Complete travel guide to reach the pristine waters of Andaman Islands 
            and join us for an unforgettable diving experience.
          </p>
        </div>

        {/* Islands & Live Weather */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">Havelock & Neil Islands</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <WeatherCard
              title={islandCoords.havelock.name}
              weather={havelock}
              climateNote="Usual climate: Oct–May calm seas, 26–30°C; Jun–Sep monsoon with variable visibility."
            />
            <WeatherCard
              title={islandCoords.neil.name}
              weather={neil}
              climateNote="Usual climate: Similar to Havelock; gentle reefs, great for relaxed diving and macro."
            />
          </div>
        </section>

        {/* Quick Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="card text-center">
            <MapPin className="h-8 w-8 text-sky-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Location</h3>
            <p className="text-sm text-slate-600">Port Blair, Andaman Islands</p>
          </div>
          <div className="card text-center">
            <Clock className="h-8 w-8 text-sky-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Duration</h3>
            <p className="text-sm text-slate-600">5-7 days recommended</p>
          </div>
          <div className="card text-center">
            <Plane className="h-8 w-8 text-sky-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Travel Time</h3>
            <p className="text-sm text-slate-600">2-5 hours by air</p>
          </div>
          <div className="card text-center">
            <Camera className="h-8 w-8 text-sky-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800">Experience</h3>
            <p className="text-sm text-slate-600">World-class diving</p>
          </div>
        </div>

        {/* Transportation Options */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            How to Reach Andaman
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {transportOptions.map((option, index) => (
              <TransportCard key={index} option={option} icon={option.icon} />
            ))}
          </div>
        </section>

        {/* Sample Itinerary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Sample Itinerary
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {itineraryDays.map((day, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-slate-800">{day.day}</h3>
                    <p className="text-sky-600 font-medium">{day.title}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {day.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-start text-slate-600">
                      <div className="w-2 h-2 bg-sky-500 rounded-full mr-3 mt-2"></div>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Essential Information */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Essential Information
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {essentialInfo.map((info, index) => (
              <InfoCard key={index} title={info.title}>{info.content}</InfoCard>
            ))}
          </div>
        </section>

        {/* Packing List */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <Checklist title="Packing Checklist" items={packingList} />

            <div className="card">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Important Notes
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Permit Requirements</h4>
                    <p className="text-sm text-slate-600">
                      No special permits required for Indian citizens. Foreign nationals need Restricted Area Permit (RAP).
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Utensils className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Local Cuisine</h4>
                    <p className="text-sm text-slate-600">
                      Try fresh seafood, coconut-based dishes, and tropical fruits. Vegetarian options widely available.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-sky-600 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-800">Our Location</h4>
                    <p className="text-sm text-slate-600">
                      Blue Belongs Diving Center is located in Port Blair, easily accessible from the airport and major hotels.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Travel Assistance */}
        <section className="text-center">
          <CTA
            title="Need Travel Assistance?"
            description="Our team can help you plan your journey and recommend the best travel options, accommodations, and local experiences to make your diving trip unforgettable."
            primary={{ label: 'Call Us: +91 98765 43210', href: 'tel:+919876543210' }}
            secondary={{ label: 'Email: info@bluebelongs.com', href: 'mailto:info@bluebelongs.com' }}
          />
        </section>
      </div>
    </div>
  );
}
