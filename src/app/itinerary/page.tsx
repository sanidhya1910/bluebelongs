"use client";
import { useEffect, useState } from 'react';
import { Plane, Ship, MapPin, Clock, AlertCircle, Camera, Utensils, ThermometerSun, Cloud, Wind } from 'lucide-react';

type Weather = {
  temp: number | null;
  wind: number | null;
  code: number | null;
};

const islandCoords = {
  havelock: { name: 'Havelock (Swaraj Dweep)', lat: 11.957, lon: 93.0 },
  neil: { name: 'Neil (Shaheed Dweep)', lat: 11.83, lon: 93.03 }
};

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
  const transportOptions = [
    {
      icon: <Plane className="h-8 w-8 text-sky-500" />,
      title: "By Air (Recommended)",
      description: "Fly directly to Port Blair from major Indian cities",
      details: [
        "Direct flights from Delhi, Mumbai, Chennai, Kolkata, Bangalore",
        "Flight duration: 2-5 hours depending on origin",
        "Airlines: Air India, IndiGo, SpiceJet, Vistara",
        "Book in advance for better prices"
      ],
      tips: "Most convenient option. Airport is well-connected to the city center."
    },
    {
      icon: <Ship className="h-8 w-8 text-sky-500" />,
      title: "By Sea",
      description: "Ferry services from Chennai, Kolkata, and Visakhapatnam",
      details: [
        "MV Akbar from Chennai (3-4 days)",
        "MV Nancowry from Kolkata (3-4 days)",
        "MV Harsha Vardhana from Visakhapatnam (2-3 days)",
        "Book tickets well in advance"
      ],
      tips: "Adventure option but takes longer. Subject to weather conditions."
    }
  ];

  const itinerary = [
    {
      day: "Day 1",
      title: "Arrival in Port Blair",
      activities: [
        "Arrive at Veer Savarkar International Airport",
        "Check into accommodation",
        "Visit Cellular Jail Light & Sound Show (evening)",
        "Rest and prepare for diving adventures"
      ]
    },
    {
      day: "Day 2",
      title: "Diving Course Begins",
      activities: [
        "Meet at Blue Belongs Diving Center",
        "Complete medical forms and equipment fitting",
        "Theory sessions and pool training",
        "First confined water dives"
      ]
    },
    {
      day: "Day 3-4",
      title: "Open Water Training",
      activities: [
        "Open water dives at pristine locations",
        "Marine life exploration",
        "Skill development and safety training",
        "Underwater photography opportunities"
      ]
    },
    {
      day: "Day 5",
      title: "Certification & Exploration",
      activities: [
        "Final skills assessment",
        "Receive SSI certification",
        "Explore Ross Island or North Bay",
        "Celebration dinner"
      ]
    }
  ];

  const essentialInfo = [
    {
      title: "Best Time to Visit",
      content: "October to May (dry season with calm waters)"
    },
    {
      title: "Currency",
      content: "Indian Rupee (INR). ATMs available in Port Blair"
    },
    {
      title: "Language",
      content: "Hindi, English, Bengali, and Tamil widely spoken"
    },
    {
      title: "Climate",
      content: "Tropical climate, 23-30°C year-round"
    }
  ];

  const packingList = [
    "Valid government photo ID (mandatory)",
    "Swimwear and comfortable clothing",
    "Sunscreen (reef-safe recommended)",
    "Sunglasses and hat",
    "Water bottle",
    "Personal medications",
    "Underwater camera (optional)",
    "Light jacket for air-conditioned spaces"
  ];

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
            {/* Havelock */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-sky-600" />
                  <h3 className="text-xl font-semibold text-slate-800">{islandCoords.havelock.name}</h3>
                </div>
                <span className="text-sm text-slate-500">Live Weather</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5 text-sky-600" />
                  <span className="text-slate-700">{havelock.temp !== null ? `${havelock.temp}°C` : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-sky-600" />
                  <span className="text-slate-700">{havelock.wind !== null ? `${havelock.wind} km/h` : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-sky-600" />
                  <span className="text-slate-700">{havelock.code !== null ? 'Conditions updated' : '—'}</span>
                </div>
              </div>
              <div className="mt-4 text-slate-600 text-sm">
                Usual climate: Oct–May calm seas, 26–30°C; Jun–Sep monsoon with variable visibility.
              </div>
            </div>

            {/* Neil */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-sky-600" />
                  <h3 className="text-xl font-semibold text-slate-800">{islandCoords.neil.name}</h3>
                </div>
                <span className="text-sm text-slate-500">Live Weather</span>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="flex items-center gap-2">
                  <ThermometerSun className="h-5 w-5 text-sky-600" />
                  <span className="text-slate-700">{neil.temp !== null ? `${neil.temp}°C` : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-sky-600" />
                  <span className="text-slate-700">{neil.wind !== null ? `${neil.wind} km/h` : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-sky-600" />
                  <span className="text-slate-700">{neil.code !== null ? 'Conditions updated' : '—'}</span>
                </div>
              </div>
              <div className="mt-4 text-slate-600 text-sm">
                Usual climate: Similar to Havelock; gentle reefs, great for relaxed diving and macro.
              </div>
            </div>
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
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {option.icon}
                  <h3 className="text-xl font-semibold text-slate-800 ml-3">
                    {option.title}
                  </h3>
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
            ))}
          </div>
        </section>

        {/* Sample Itinerary */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Sample Itinerary
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {itinerary.map((day, index) => (
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
              <div key={index} className="card text-center">
                <h3 className="font-semibold text-slate-800 mb-2">{info.title}</h3>
                <p className="text-sm text-slate-600">{info.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Packing List */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Packing Checklist
              </h2>
              <div className="space-y-3">
                {packingList.map((item, index) => (
                  <label key={index} className="flex items-center">
                    <input type="checkbox" className="mr-3 rounded text-sky-500" />
                    <span className="text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </div>

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
          <div className="card bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Need Travel Assistance?
            </h2>
            <p className="text-slate-600 mb-6">
              Our team can help you plan your journey and recommend the best travel options, 
              accommodations, and local experiences to make your diving trip unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+919876543210" className="btn-primary">
                Call Us: +91 98765 43210
              </a>
              <a href="mailto:info@bluebelongs.com" className="btn-secondary">
                Email: info@bluebelongs.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
