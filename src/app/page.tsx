import Link from 'next/link';
import { ArrowRight, Award, Users, MapPin, Star } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Award className="h-8 w-8 text-sky-500" />,
      title: "PADI Certified Courses",
      description: "Professional diving courses from beginner to advanced levels with certified instructors."
    },
    {
      icon: <Users className="h-8 w-8 text-sky-500" />,
      title: "Expert Instructors",
      description: "Learn from experienced dive masters with years of underwater exploration expertise."
    },
    {
      icon: <MapPin className="h-8 w-8 text-sky-500" />,
      title: "Andaman Waters",
      description: "Explore the pristine coral reefs and marine life in the crystal-clear waters of Andaman."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! The instructors were professional and the waters were absolutely stunning."
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Best diving school in Andaman. Highly recommend for both beginners and experienced divers."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="ocean-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Dive into <span className="text-cyan-200">Adventure</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover the underwater world of Andaman Islands with professional diving courses 
            and unforgettable marine experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="btn-primary bg-white text-sky-600 hover:bg-gray-100 text-lg px-8 py-3">
              View Courses
              <ArrowRight className="ml-2 h-5 w-5 inline" />
            </Link>
            <Link href="/medical-form" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-sky-600 text-lg px-8 py-3">
              Start Medical Form
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-slate-800">
            Why Choose Blue Belongs?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-800">
            Ready to Start Your Diving Journey?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Book your diving course today and experience the breathtaking underwater world of Andaman. 
            Payment can be made face-to-face at our center.
          </p>
          <Link href="/courses" className="btn-primary text-lg px-8 py-3">
            Book Your Course Now
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
            What Our Divers Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <p className="font-semibold text-slate-800">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
