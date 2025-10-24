'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Fish, Waves, Leaf, Heart, Shield, Info, MapPin, Calendar, AlertCircle } from 'lucide-react';

interface MarineSpecies {
  id: string;
  name: string;
  scientificName: string;
  category: 'fish' | 'coral' | 'mammal' | 'invertebrate' | 'reptile';
  description: string;
  habitat: string;
  conservationStatus: 'least_concern' | 'vulnerable' | 'endangered' | 'critically_endangered';
  commonSighting: boolean;
  bestSeason: string;
  imageUrl: string;
  funFacts: string[];
  safetyNotes?: string;
}

// Pre-populated marine species database
const marineSpeciesData: MarineSpecies[] = [
  {
    id: '1',
    name: 'Manta Ray',
    scientificName: 'Mobula birostris',
    category: 'fish',
    description: 'Majestic giants of the sea, manta rays are among the largest rays in the world. These gentle filter feeders glide gracefully through the water with wingspans reaching up to 7 meters.',
    habitat: 'Open ocean, coral reefs, and cleaning stations',
    conservationStatus: 'vulnerable',
    commonSighting: true,
    bestSeason: 'December to April',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    funFacts: [
      'Each manta ray has a unique pattern of spots on its belly, like a fingerprint',
      'They have the largest brain-to-body ratio of all fish',
      'Can live up to 50 years in the wild'
    ],
    safetyNotes: 'Keep a respectful distance of at least 3 meters. Never touch or chase them.'
  },
  {
    id: '2',
    name: 'Green Sea Turtle',
    scientificName: 'Chelonia mydas',
    category: 'reptile',
    description: 'Named for the green color of their fat, not their shells. These herbivorous turtles are commonly seen grazing on seagrass beds around Andaman Islands.',
    habitat: 'Seagrass beds, coral reefs, and coastal areas',
    conservationStatus: 'endangered',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    funFacts: [
      'Can hold their breath for up to 5 hours when resting',
      'Navigate using Earth\'s magnetic field',
      'Return to the same beach where they were born to lay eggs'
    ],
    safetyNotes: 'Do not touch or disturb. Maintain at least 2 meters distance.'
  },
  {
    id: '3',
    name: 'Clownfish',
    scientificName: 'Amphiprioninae',
    category: 'fish',
    description: 'Made famous by "Finding Nemo", these small, colorful fish live in symbiosis with sea anemones. The mucus coating on their scales protects them from the anemone\'s stinging tentacles.',
    habitat: 'Sea anemones in coral reefs',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=80',
    funFacts: [
      'All clownfish are born male and can change to female',
      'Form lifelong bonds with their anemone home',
      'Communicate through popping and clicking sounds'
    ]
  },
  {
    id: '4',
    name: 'Giant Moray Eel',
    scientificName: 'Gymnothorax javanicus',
    category: 'fish',
    description: 'The largest of all moray eels, reaching up to 3 meters in length. Despite their fierce appearance, they are generally shy and only aggressive when threatened.',
    habitat: 'Coral reef crevices and caves',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    funFacts: [
      'Have a second set of jaws in their throat to pull prey down',
      'Poor eyesight but excellent sense of smell',
      'Can live up to 30 years'
    ],
    safetyNotes: 'Never put hands in reef crevices. Keep a safe distance and do not provoke.'
  },
  {
    id: '5',
    name: 'Dugong',
    scientificName: 'Dugong dugon',
    category: 'mammal',
    description: 'Peaceful marine mammals related to elephants, dugongs are herbivores that spend their days grazing on seagrass. They are a rare and treasured sight in Andaman waters.',
    habitat: 'Shallow coastal seagrass beds',
    conservationStatus: 'vulnerable',
    commonSighting: false,
    bestSeason: 'November to March',
    imageUrl: 'https://images.unsplash.com/photo-1591025207163-942350e47db2?w=800&q=80',
    funFacts: [
      'Believed to be the inspiration for mermaid legends',
      'Can hold their breath for up to 6 minutes',
      'Closest living relative to the elephant'
    ],
    safetyNotes: 'Extremely rare sighting. Observe from distance, do not approach.'
  },
  {
    id: '6',
    name: 'Table Coral',
    scientificName: 'Acropora hyacinthus',
    category: 'coral',
    description: 'Fast-growing coral that forms large, flat, table-like structures. These corals are crucial for reef building and provide habitat for countless marine species.',
    habitat: 'Shallow reef flats and slopes',
    conservationStatus: 'vulnerable',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80',
    funFacts: [
      'Can grow up to 10-15 cm per year',
      'Home to hundreds of fish species',
      'Highly susceptible to coral bleaching'
    ],
    safetyNotes: 'Never touch or stand on coral. Maintain proper buoyancy control.'
  },
  {
    id: '7',
    name: 'Lionfish',
    scientificName: 'Pterois volitans',
    category: 'fish',
    description: 'Strikingly beautiful but venomous, lionfish are distinguished by their elaborate fins and bold stripes. They are ambush predators that hunt at dusk and dawn.',
    habitat: 'Coral reefs, rocky outcrops, and shipwrecks',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    funFacts: [
      'Venomous spines can cause severe pain but are rarely fatal',
      'Can consume prey up to half their own size',
      'Active mainly at twilight'
    ],
    safetyNotes: 'VENOMOUS: Maintain safe distance. Do not touch or corner. Seek immediate medical attention if stung.'
  },
  {
    id: '8',
    name: 'Octopus',
    scientificName: 'Octopus vulgaris',
    category: 'invertebrate',
    description: 'Highly intelligent invertebrates with eight arms and the ability to change color instantly. Masters of camouflage and problem-solving.',
    habitat: 'Rocky reefs, caves, and sandy bottoms',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=800&q=80',
    funFacts: [
      'Have three hearts and blue blood',
      'Can squeeze through any gap larger than their beak',
      'Highly intelligent with problem-solving abilities'
    ],
    safetyNotes: 'Do not disturb or attempt to touch. Some species are venomous.'
  },
  {
    id: '9',
    name: 'Whale Shark',
    scientificName: 'Rhincodon typus',
    category: 'fish',
    description: 'The largest fish in the ocean, whale sharks are gentle giants that filter feed on plankton. Despite their massive size (up to 12 meters), they pose no threat to humans.',
    habitat: 'Open ocean, often near the surface',
    conservationStatus: 'endangered',
    commonSighting: false,
    bestSeason: 'February to May',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    funFacts: [
      'Can live up to 100 years',
      'Each whale shark has a unique spot pattern',
      'Filter up to 6000 liters of water per hour'
    ],
    safetyNotes: 'Rare encounter. Maintain 3-4 meters distance. Never touch or obstruct their path.'
  },
  {
    id: '10',
    name: 'Sea Snake',
    scientificName: 'Hydrophis platurus',
    category: 'reptile',
    description: 'Highly adapted to marine life, sea snakes are among the most venomous snakes in the world. However, they are generally docile and bites are extremely rare.',
    habitat: 'Open ocean surface and coastal areas',
    conservationStatus: 'least_concern',
    commonSighting: false,
    bestSeason: 'December to April',
    imageUrl: 'https://images.unsplash.com/photo-1595429660111-3e81b25b0f2c?w=800&q=80',
    funFacts: [
      'Can hold their breath for up to 8 hours',
      'Venom is 10x more potent than a cobra',
      'Give live birth in the water'
    ],
    safetyNotes: 'VENOMOUS: Keep distance, do not touch or provoke. Generally non-aggressive but extremely dangerous if handled.'
  },
  {
    id: '11',
    name: 'Parrotfish',
    scientificName: 'Scaridae',
    category: 'fish',
    description: 'Named for their bright colors and beak-like teeth, parrotfish play a crucial role in creating sandy beaches by eating algae off coral and excreting fine sand.',
    habitat: 'Coral reefs',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=80',
    funFacts: [
      'Produce up to 90kg of sand per year per fish',
      'Sleep in a mucus cocoon for protection',
      'Some species can change sex during their lifetime'
    ]
  },
  {
    id: '12',
    name: 'Barracuda',
    scientificName: 'Sphyraena barracuda',
    category: 'fish',
    description: 'Swift predators with powerful jaws and razor-sharp teeth. Often seen in large schools circling reefs or hunting alone in open water.',
    habitat: 'Open water near reefs and drop-offs',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    funFacts: [
      'Can swim at speeds up to 35 mph',
      'Attracted to shiny objects (remove jewelry when diving)',
      'Have poor eyesight but detect vibrations'
    ],
    safetyNotes: 'Generally harmless but curious. Remove shiny jewelry. Do not swim with open wounds.'
  },
  {
    id: '13',
    name: 'Hawksbill Turtle',
    scientificName: 'Eretmochelys imbricata',
    category: 'reptile',
    description: 'Critically endangered sea turtles known for their beautiful shell patterns. They play a vital role in maintaining healthy coral reefs by eating sponges.',
    habitat: 'Coral reefs and rocky areas',
    conservationStatus: 'critically_endangered',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    funFacts: [
      'Their shells have been illegally traded for "tortoiseshell" products',
      'Can live 30-50 years in the wild',
      'One of the few creatures that can eat venomous sponges'
    ],
    safetyNotes: 'Critically endangered - observe only, never touch. Report sightings to conservation authorities.'
  },
  {
    id: '14',
    name: 'Nudibranch',
    scientificName: 'Nudibranchia',
    category: 'invertebrate',
    description: 'Colorful sea slugs that come in every color imaginable. These shell-less mollusks are a favorite among underwater photographers for their vibrant patterns.',
    habitat: 'Coral reefs, rocky areas, and seagrass beds',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    funFacts: [
      'Over 3000 known species worldwide',
      'Some can steal stinging cells from prey and use them for defense',
      'Hermaphrodites - have both male and female reproductive organs'
    ]
  },
  {
    id: '15',
    name: 'Eagle Ray',
    scientificName: 'Aetobatus narinari',
    category: 'fish',
    description: 'Graceful rays with distinctive spotted patterns, eagle rays often travel in small groups. They flap their wings like birds, making them appear to "fly" through the water.',
    habitat: 'Sandy bottoms near reefs',
    conservationStatus: 'vulnerable',
    commonSighting: true,
    bestSeason: 'November to April',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    funFacts: [
      'Can leap several feet out of the water',
      'Use their flat snout to dig for mollusks in sand',
      'Live up to 25 years'
    ],
    safetyNotes: 'Keep respectful distance. Do not approach from above or chase.'
  },
  {
    id: '16',
    name: 'Blue-Spotted Stingray',
    scientificName: 'Taeniura lymma',
    category: 'fish',
    description: 'Beautiful rays with bright blue spots on their bodies. Often found resting under coral ledges or partially buried in sand during the day.',
    habitat: 'Sandy areas near reefs and lagoons',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    funFacts: [
      'Have venomous barbs on their tail',
      'Hunt at night for mollusks and crustaceans',
      'Can partially bury themselves in sand for camouflage'
    ],
    safetyNotes: 'VENOMOUS: Watch where you place hands and fins. Shuffle feet when walking in shallow water.'
  },
  {
    id: '17',
    name: 'Soft Coral',
    scientificName: 'Alcyonacea',
    category: 'coral',
    description: 'Unlike hard corals, soft corals lack a rigid calcium skeleton. They sway gracefully with currents, creating an underwater garden of vibrant colors.',
    habitat: 'Reef slopes and walls with moderate current',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80',
    funFacts: [
      'Can retract completely when touched or during low tide',
      'Some species glow under UV light',
      'Home to many small fish and invertebrates'
    ],
    safetyNotes: 'Do not touch - damages coral and some species can cause skin irritation.'
  },
  {
    id: '18',
    name: 'Cuttlefish',
    scientificName: 'Sepiida',
    category: 'invertebrate',
    description: 'Masters of disguise with the ability to change color and texture instantly. These intelligent cephalopods are related to octopuses and squid.',
    habitat: 'Sandy bottoms and reef edges',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1545671913-b89ac1b4ac10?w=800&q=80',
    funFacts: [
      'Can produce hypnotic color displays',
      'Have W-shaped pupils for better depth perception',
      'Possess three hearts and green-blue blood'
    ]
  },
  {
    id: '19',
    name: 'Reef Shark',
    scientificName: 'Carcharhinus melanopterus',
    category: 'fish',
    description: 'Small, elegant sharks with distinctive black-tipped fins. Common inhabitants of coral reefs and one of the most frequently encountered shark species by divers.',
    habitat: 'Shallow coral reefs and lagoons',
    conservationStatus: 'vulnerable',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1560275619-4662e36fa65c?w=800&q=80',
    funFacts: [
      'Can sense electrical fields from muscle contractions',
      'Timid around humans and usually swim away',
      'Give birth to live pups (not eggs)'
    ],
    safetyNotes: 'Generally harmless and shy. Maintain calm, avoid sudden movements. Do not corner or provoke.'
  },
  {
    id: '20',
    name: 'Moray Eel (Honeycomb)',
    scientificName: 'Gymnothorax favagineus',
    category: 'fish',
    description: 'Distinguished by their honeycomb-patterned skin, these eels are nocturnal hunters that rest in reef crevices during the day with their mouths open.',
    habitat: 'Coral reef crevices and caves',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    funFacts: [
      'Open mouth is for breathing, not aggression',
      'Form hunting partnerships with groupers',
      'Can tie their body in knots to generate force when eating'
    ],
    safetyNotes: 'Never put hands in crevices. Do not feed or provoke.'
  },
  {
    id: '21',
    name: 'Seahorse',
    scientificName: 'Hippocampus',
    category: 'fish',
    description: 'Enchanting creatures that swim upright and use their prehensile tail to anchor to coral or seagrass. Males carry and give birth to babies.',
    habitat: 'Seagrass beds and coral reefs',
    conservationStatus: 'vulnerable',
    commonSighting: false,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=80',
    funFacts: [
      'Males get pregnant and give birth',
      'Eyes move independently like a chameleon',
      'Can change color to match surroundings'
    ],
    safetyNotes: 'Rare sighting - very fragile. Observe from distance, never touch or disturb.'
  },
  {
    id: '22',
    name: 'Giant Trevally',
    scientificName: 'Caranx ignobilis',
    category: 'fish',
    description: 'Powerful apex predators known for their aggressive hunting tactics. Often seen hunting in packs or patrolling reef edges.',
    habitat: 'Reef edges, channels, and open water',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    funFacts: [
      'Can grow up to 170cm and weigh 80kg',
      'Known to hunt birds by leaping out of water',
      'Live for over 35 years'
    ]
  },
  {
    id: '23',
    name: 'Sea Anemone',
    scientificName: 'Actiniaria',
    category: 'invertebrate',
    description: 'Beautiful but deadly to small fish, sea anemones use stinging cells to capture prey. They form symbiotic relationships with clownfish and anemone shrimp.',
    habitat: 'Attached to rocks and coral',
    conservationStatus: 'least_concern',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80',
    funFacts: [
      'Can live for over 50 years',
      'Clone themselves to reproduce',
      'Some species can move by gliding along the substrate'
    ],
    safetyNotes: 'Do not touch - stinging cells can cause painful welts and allergic reactions.'
  },
  {
    id: '24',
    name: 'Brain Coral',
    scientificName: 'Diploria labyrinthiformis',
    category: 'coral',
    description: 'Named for their maze-like appearance resembling a human brain. These slow-growing corals can live for several hundred years.',
    habitat: 'Reef slopes and shallow areas',
    conservationStatus: 'vulnerable',
    commonSighting: true,
    bestSeason: 'Year-round',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80',
    funFacts: [
      'Can live for 900+ years',
      'Grow only 2-3mm per year',
      'Colonies can reach several meters in diameter'
    ],
    safetyNotes: 'Extremely fragile and slow-growing. Never touch or stand on coral.'
  }
];

const categories = [
  { id: 'all', label: 'All Species', icon: Waves },
  { id: 'fish', label: 'Fish', icon: Fish },
  { id: 'coral', label: 'Corals', icon: Leaf },
  { id: 'mammal', label: 'Mammals', icon: Heart },
  { id: 'reptile', label: 'Reptiles', icon: Shield },
  { id: 'invertebrate', label: 'Invertebrates', icon: Info }
];

const conservationColors = {
  least_concern: 'from-green-500 to-emerald-600',
  vulnerable: 'from-yellow-500 to-orange-500',
  endangered: 'from-orange-500 to-red-500',
  critically_endangered: 'from-red-600 to-rose-700'
};

const conservationLabels = {
  least_concern: 'Least Concern',
  vulnerable: 'Vulnerable',
  endangered: 'Endangered',
  critically_endangered: 'Critically Endangered'
};

export default function MarineLifePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSpecies, setSelectedSpecies] = useState<MarineSpecies | null>(null);

  const filteredSpecies = useMemo(() => {
    return marineSpeciesData.filter(species => {
      const matchesSearch = species.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           species.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           species.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || species.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50 to-cyan-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-400 to-cyan-500 rounded-full mb-6">
            <Fish className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Marine Life Encyclopedia
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover the incredible biodiversity of Andaman&apos;s underwater world. Learn about the amazing creatures you&apos;ll encounter on your dives.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by species name, scientific name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all duration-300 text-slate-700 bg-white shadow-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-lg'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border-2 border-slate-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{category.label}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Results Counter */}
          <p className="text-center text-slate-600">
            Showing <span className="font-semibold text-sky-600">{filteredSpecies.length}</span> species
          </p>
        </motion.div>

        {/* Species Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {filteredSpecies.map((species, index) => (
            <motion.div
              key={species.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedSpecies(species)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={species.imageUrl}
                  alt={species.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Common Sighting Badge */}
                {species.commonSighting && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Common Sighting
                  </div>
                )}
                {/* Conservation Status */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${conservationColors[species.conservationStatus]} text-white text-xs font-semibold py-2 px-3`}>
                  {conservationLabels[species.conservationStatus]}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-1">{species.name}</h3>
                <p className="text-sm italic text-slate-500 mb-3">{species.scientificName}</p>
                <p className="text-slate-600 line-clamp-3 mb-4">{species.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span className="capitalize">{species.category}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{species.bestSeason}</span>
                  </div>
                </div>

                {species.safetyNotes && (
                  <div className="mt-4 flex items-start space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-yellow-800 font-medium">Safety notes available</span>
                  </div>
                )}

                <button className="mt-4 w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all duration-300">
                  Learn More
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredSpecies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Fish className="h-20 w-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No species found</h3>
            <p className="text-slate-500">Try adjusting your search or filter criteria</p>
          </motion.div>
        )}

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Encounter These Species on Your Dives!</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            The Andaman Islands are home to over 750 species of fish and countless other marine creatures. 
            Book a dive course to experience this underwater paradise firsthand.
          </p>
          <a
            href="/courses"
            className="inline-block bg-white text-sky-600 font-semibold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300"
          >
            Browse Diving Courses
          </a>
        </motion.div>
      </div>

      {/* Species Detail Modal */}
      <AnimatePresence>
        {selectedSpecies && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSpecies(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <img
                  src={selectedSpecies.imageUrl}
                  alt={selectedSpecies.name}
                  className="w-full h-64 md:h-96 object-cover rounded-t-3xl"
                />
                <button
                  onClick={() => setSelectedSpecies(null)}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-4xl font-bold text-slate-800 mb-2">{selectedSpecies.name}</h2>
                    <p className="text-lg italic text-slate-500">{selectedSpecies.scientificName}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${conservationColors[selectedSpecies.conservationStatus]} text-white font-semibold text-sm`}>
                    {conservationLabels[selectedSpecies.conservationStatus]}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-sky-500" />
                      Category
                    </h4>
                    <p className="text-slate-600 capitalize">{selectedSpecies.category}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-sky-500" />
                      Best Season
                    </h4>
                    <p className="text-slate-600">{selectedSpecies.bestSeason}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-2">Description</h4>
                  <p className="text-slate-600 leading-relaxed">{selectedSpecies.description}</p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-700 mb-2">Habitat</h4>
                  <p className="text-slate-600">{selectedSpecies.habitat}</p>
                </div>

                {selectedSpecies.funFacts && selectedSpecies.funFacts.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-700 mb-3">Fun Facts</h4>
                    <ul className="space-y-2">
                      {selectedSpecies.funFacts.map((fact, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-sky-500 mt-1">•</span>
                          <span className="text-slate-600">{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedSpecies.safetyNotes && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Safety Notes
                    </h4>
                    <p className="text-yellow-700">{selectedSpecies.safetyNotes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
