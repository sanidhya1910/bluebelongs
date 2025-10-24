'use client';

import { useState, useMemo } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, Select, SelectItem, Card, CardBody, Button, Accordion, AccordionItem, Chip } from '@heroui/react';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // FAQ Database - Admin can manage this
  const faqs: FAQ[] = [
    // Getting Started
    {
      id: '1',
      category: 'Getting Started',
      question: 'Do I need prior experience to start diving?',
      answer: 'No prior experience is required! Our beginner courses start from basics. You just need to be comfortable in water and meet basic health requirements.'
    },
    {
      id: '2',
      category: 'Getting Started',
      question: 'What is the minimum age for diving?',
      answer: 'The minimum age is 10 years for junior certifications with restrictions. Full open water certification requires a minimum age of 15 years. Parental consent is required for minors.'
    },
    {
      id: '3',
      category: 'Getting Started',
      question: 'Do I need to know swimming?',
      answer: 'Basic swimming skills and water comfort are required. You don\'t need to be an Olympic swimmer, but you should be comfortable in deep water and able to swim 200 meters.'
    },
    
    // Certifications
    {
      id: '4',
      category: 'Certifications',
      question: 'What certification will I receive?',
      answer: 'We provide SSI (Scuba Schools International) certifications, which are internationally recognized and accepted worldwide at all dive centers.'
    },
    {
      id: '5',
      category: 'Certifications',
      question: 'How long does certification take?',
      answer: 'Open Water Diver certification typically takes 3-4 days, including theory, confined water training, and open water dives. Advanced courses take 2-3 days.'
    },
    {
      id: '6',
      category: 'Certifications',
      question: 'Is SSI certification recognized internationally?',
      answer: 'Yes! SSI is one of the world\'s leading dive training agencies. Your certification is valid worldwide and recognized by all dive centers globally.'
    },

    // Health & Safety
    {
      id: '7',
      category: 'Health & Safety',
      question: 'Are there any health restrictions?',
      answer: 'Yes. Certain medical conditions may prevent diving. You must complete a medical questionnaire. Conditions like heart disease, lung problems, ear issues, or pregnancy require medical clearance.'
    },
    {
      id: '8',
      category: 'Health & Safety',
      question: 'Is diving safe?',
      answer: 'Diving is very safe when proper training and procedures are followed. We maintain strict safety standards, use quality equipment, and have an experienced SSI-certified instructor. All dives are supervised.'
    },
    {
      id: '9',
      category: 'Health & Safety',
      question: 'What if I have asthma?',
      answer: 'Asthma requires medical evaluation. Some asthmatics can dive if their condition is well-controlled and they have medical clearance from a diving physician.'
    },
    {
      id: '10',
      category: 'Health & Safety',
      question: 'Can I dive if I wear glasses/contacts?',
      answer: 'Yes! You can wear contact lenses while diving. We also have prescription masks available. Vision correction is not a barrier to diving.'
    },

    // Equipment
    {
      id: '11',
      category: 'Equipment',
      question: 'Do you provide all equipment?',
      answer: 'Yes! We provide all necessary diving equipment including wetsuit, BCD, regulator, tank, weights, mask, fins, and snorkel. Equipment is well-maintained and regularly serviced.'
    },
    {
      id: '12',
      category: 'Equipment',
      question: 'Should I buy my own equipment?',
      answer: 'For beginners, we recommend using our equipment first. Once certified and diving regularly, you may want to invest in personal mask, snorkel, and fins for better fit and comfort.'
    },
    {
      id: '13',
      category: 'Equipment',
      question: 'What should I bring for diving?',
      answer: 'Bring swimwear, towel, sunscreen, and any personal medications. We provide all diving equipment. Optional: underwater camera, logbook, certification card (if certified).'
    },

    // Booking & Pricing
    {
      id: '14',
      category: 'Booking & Pricing',
      question: 'How do I book a course?',
      answer: 'You can book online through our website, via WhatsApp, or call us directly. We require basic information and course selection. Payment can be made online or at our center.'
    },
    {
      id: '15',
      category: 'Booking & Pricing',
      question: 'What is your cancellation policy?',
      answer: 'Cancellations made 7+ days before the course receive full refund. 3-7 days: 50% refund. Less than 3 days: no refund. Weather cancellations by us are fully refundable.'
    },
    {
      id: '16',
      category: 'Booking & Pricing',
      question: 'Are there group discounts?',
      answer: 'Yes! Groups of 4+ people receive special discounts. Contact us for group pricing. We also offer family packages and student discounts with valid ID.'
    },
    {
      id: '17',
      category: 'Booking & Pricing',
      question: 'What does the course fee include?',
      answer: 'Course fee includes instruction, all equipment, certification materials, dive insurance during the course, and your digital certification card. Excludes accommodation and meals.'
    },

    // Andaman Specific
    {
      id: '18',
      category: 'Andaman Islands',
      question: 'What is the best time to visit Andaman for diving?',
      answer: 'October to May is the best season. Weather is calm, visibility is excellent (15-30m), and sea conditions are ideal. We operate year-round but monsoon (June-September) has rougher conditions.'
    },
    {
      id: '19',
      category: 'Andaman Islands',
      question: 'What marine life can I see?',
      answer: 'Andaman waters are rich with marine life: colorful coral reefs, tropical fish, sea turtles, rays, reef sharks, octopus, and occasionally dolphins and manta rays. Rich biodiversity!'
    },
    {
      id: '20',
      category: 'Andaman Islands',
      question: 'How do I reach your dive center?',
      answer: 'We\'re located in Havelock Island. Fly to Port Blair, then take a ferry to Havelock (2.5 hours). We can arrange pickup from the jetty. Check our Travel Itinerary page for details.'
    },
    {
      id: '21',
      category: 'Andaman Islands',
      question: 'Do you recommend any accommodations?',
      answer: 'Yes! We have partnerships with several hotels and resorts in Havelock. We can help arrange accommodation that suits your budget. Many offer diving packages.'
    },

    // Advanced Questions
    {
      id: '22',
      category: 'Advanced Diving',
      question: 'Can I do technical or deep diving?',
      answer: 'Yes! We offer technical diving courses and deep diving specialties for certified divers. Andaman has excellent deep dive sites. Advanced certifications required.'
    },
    {
      id: '23',
      category: 'Advanced Diving',
      question: 'Do you offer night diving?',
      answer: 'Yes! Night diving is available for Advanced Open Water divers. Experience the reef at night with completely different marine life. Truly magical experience!'
    },
    {
      id: '24',
      category: 'Advanced Diving',
      question: 'What about wreck diving?',
      answer: 'Andaman has some wreck diving opportunities. We conduct trips to accessible wrecks for appropriately certified divers. Wreck diving specialty courses available.'
    }
  ];

  const categories = [
    { key: 'all', label: 'All Categories' },
    ...Array.from(new Set(faqs.map(faq => faq.category))).map(cat => ({
      key: cat,
      label: cat
    }))
  ];

  const filteredFAQs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 pt-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <HelpCircle className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about diving with Blue Belongs
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="shadow-lg">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    startContent={<Search className="text-slate-400 h-5 w-5" />}
                    classNames={{
                      input: "text-slate-700",
                      inputWrapper: "bg-white border-2 border-slate-200 hover:border-sky-400 focus-within:!border-sky-500"
                    }}
                    size="lg"
                    radius="lg"
                  />
                </div>

                {/* Category Filter */}
                <Select
                  placeholder="Select category"
                  selectedKeys={[selectedCategory]}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys)[0] as string;
                    setSelectedCategory(key);
                  }}
                  classNames={{
                    trigger: "bg-white border-2 border-slate-200 hover:border-sky-400 data-[hover=true]:border-sky-400",
                    value: "text-slate-700"
                  }}
                  size="lg"
                  radius="lg"
                  className="md:w-64"
                >
                  {categories.map((category) => (
                    <SelectItem key={category.key}>
                      {category.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* Results Count */}
              <div className="mt-4 flex items-center gap-2">
                <Chip color="primary" variant="flat" size="sm">
                  {filteredFAQs.length} of {faqs.length} questions
                </Chip>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredFAQs.length > 0 ? (
            <Accordion
              variant="splitted"
              selectionMode="multiple"
              className="gap-4"
            >
              {filteredFAQs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  aria-label={faq.question}
                  title={
                    <div className="flex flex-col">
                      <Chip 
                        color="primary" 
                        variant="flat" 
                        size="sm" 
                        className="mb-2 w-fit"
                      >
                        {faq.category}
                      </Chip>
                      <span className="text-lg font-semibold text-slate-800">
                        {faq.question}
                      </span>
                    </div>
                  }
                  classNames={{
                    base: "shadow-md hover:shadow-lg transition-shadow bg-white",
                    title: "text-left",
                    trigger: "py-6 px-6",
                    content: "px-6 pb-6 text-slate-600 text-base"
                  }}
                >
                  {faq.answer}
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card className="shadow-lg">
              <CardBody className="text-center py-12">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-lg text-slate-600 font-medium">No questions found matching your search.</p>
                <p className="text-sm text-slate-500 mt-2">Try different keywords or browse all categories.</p>
              </CardBody>
            </Card>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-r from-sky-600 to-cyan-600 shadow-2xl">
            <CardBody className="p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">Still have questions?</h2>
              <p className="text-sky-100 mb-6 text-lg">
                Our team is here to help! Contact us via WhatsApp, email, or phone.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  as="a"
                  href="https://wa.me/919876543210"
                  size="lg"
                  radius="full"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-lg"
                >
                  Chat on WhatsApp
                </Button>
                <Button
                  as="a"
                  href="/contact"
                  size="lg"
                  radius="full"
                  variant="flat"
                  className="bg-white text-sky-600 hover:bg-slate-100 font-semibold shadow-lg"
                >
                  Contact Us
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
