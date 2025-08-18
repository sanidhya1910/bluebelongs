export type CourseCategoryId = 'beginner' | 'certification' | 'specialty';
export type IconId = 'fish' | 'award' | 'anchor';

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  dives: number;
  price: string;
  level: string;
  certification: string;
  category: CourseCategoryId;
  image?: string;
}

export interface CourseCategory {
  id: CourseCategoryId;
  name: string;
  description: string;
  iconId: IconId;
  color: string; // gradient classes
}

export const categories: CourseCategory[] = [
  {
    id: 'beginner',
    name: 'Entry Level Programs',
    description: 'Perfect for first-time divers and those new to scuba diving - from Try Scuba to Open Water certification',
    iconId: 'fish',
    color: 'from-sky-400 to-cyan-500'
  },
  {
    id: 'certification',
    name: 'Continuing Education',
    description: 'Advanced training for certified divers seeking skill enhancement and rescue capabilities',
    iconId: 'award',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'specialty',
    name: 'Specialty Courses',
    description: 'Specialized training for unique diving experiences - from Deep Diving to Wreck Exploration',
    iconId: 'anchor',
    color: 'from-cyan-500 to-sky-600'
  }
];

export const courses: Course[] = [
  { id: 'try-scuba', title: 'Try Scuba', description: 'Safe and exhilarating introduction to scuba diving, perfect for non-swimmers. Test the waters before you commit!', duration: '3 hours', dives: 1, price: '₹4,500', level: 'Beginner', certification: 'Try Scuba Experience', category: 'beginner', image: 'https://unsplash.com/photos/black-and-white-fire-extinguisher-on-brown-concrete-wall-4HOg7XW_9co/download?force=true' },
  { id: 'basic-diver', title: 'SSI Basic Diver', description: 'Gateway to exploring depths of up to 12 meters with an experienced SSI Professional. Credits towards further certifications.', duration: '4 hours', dives: 1, price: '₹7,500', level: 'Beginner', certification: 'SSI Basic Diver', category: 'beginner', image: 'https://images.pexels.com/photos/10467/pexels-photo-10467.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'scuba-diver', title: 'SSI Scuba Diver', description: 'Excellent starting point combining online learning with practical dives. Dive up to 12 meters deep.', duration: '2 days', dives: 2, price: '₹15,000', level: 'Beginner', certification: 'SSI Scuba Diver', category: 'beginner', image: 'https://images.pexels.com/photos/3046582/pexels-photo-3046582.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'open-water', title: 'SSI Open Water Diver', description: 'Globally recognized certification program. Your gateway to lifelong diving adventures up to 18 meters deep.', duration: '4 days', dives: 4, price: '₹35,000', level: 'Beginner', certification: 'SSI Open Water Diver', category: 'beginner', image: 'https://images.pexels.com/photos/1540297/pexels-photo-1540297.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'advanced-adventurer', title: 'SSI Advanced Adventurer', description: 'Sample five SSI specialties through Adventure Dives. Certifies you to dive up to 30 meters deep.', duration: '3 days', dives: 5, price: '₹25,000', level: 'Intermediate', certification: 'SSI Advanced Adventurer', category: 'certification', image: 'https://images.pexels.com/photos/1645028/pexels-photo-1645028.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'scuba-skill-update', title: 'SSI Scuba Skill Update', description: "Refresh your skills after inactivity. Perfect for divers who haven't been in water for a while.", duration: '1 day', dives: 0, price: '₹8,000', level: 'Refresher', certification: 'Skill Update', category: 'certification', image: 'https://images.pexels.com/photos/1303651/pexels-photo-1303651.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'diver-stress-rescue', title: 'SSI Diver Stress and Rescue', description: 'Comprehensive course to manage emergencies effectively. Learn to identify stress signals and prevent accidents.', duration: '3-4 days', dives: 4, price: 'Contact for pricing', level: 'Advanced', certification: 'SSI Diver Stress and Rescue', category: 'certification', image: 'https://unsplash.com/photos/people-in-water-during-daytime-NThBgBjmgnE/download?force=true' },
  { id: 'deep-diving', title: 'SSI Deep Diving Specialty', description: 'Prepare for dives ranging from 18 to 40 meters deep. Learn dive computers and gas consumption.', duration: '2 days', dives: 4, price: 'Contact for pricing', level: 'Advanced', certification: 'SSI Deep Diving Specialty', category: 'specialty', image: 'https://images.pexels.com/photos/3410956/pexels-photo-3410956.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'perfect-buoyancy', title: 'SSI Perfect Buoyancy', description: 'Master buoyancy control underwater. Learn to swim like a fish and be balanced like a turtle.', duration: '1-2 days', dives: 2, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Perfect Buoyancy', category: 'specialty', image: 'https://images.pexels.com/photos/37530/diver-scuba-underwater-swimming-37530.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'nitrox', title: 'SSI Nitrox Specialty', description: 'Learn enriched air nitrox diving for longer bottom times and shorter surface intervals.', duration: '1 day', dives: 2, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Nitrox Specialty', category: 'specialty', image: 'https://images.pexels.com/photos/9307238/pexels-photo-9307238.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'navigation', title: 'SSI Navigation Specialty', description: 'Master underwater navigation with compass and natural techniques. Never get lost underwater again!', duration: '2 days', dives: 3, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Navigation Specialty', category: 'specialty', image: 'https://images.pexels.com/photos/4553081/pexels-photo-4553081.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'fish-identification', title: 'SSI Fish Identification', description: "Learn to identify fish species, their behaviors, and habitats. Know what you're seeing underwater!", duration: '2 days', dives: 2, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Fish Identification', category: 'specialty', image: 'https://images.pexels.com/photos/3635910/pexels-photo-3635910.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'wreck-diving', title: 'SSI Wreck Diving (Havelock Only)', description: 'Explore and navigate wreck dive sites safely. Discover underwater history like the Titanic!', duration: '2 days', dives: 4, price: 'Contact for pricing', level: 'Advanced', certification: 'SSI Wreck Diving', category: 'specialty', image: 'https://images.pexels.com/photos/3098980/pexels-photo-3098980.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'night-diving', title: 'SSI Night & Limited Visibility (Havelock Only)', description: 'Safely navigate underwater environments in low light. Discover nocturnal marine life behaviors.', duration: '2 days', dives: 3, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Night & Limited Visibility', category: 'specialty', image: 'https://images.pexels.com/photos/3098970/pexels-photo-3098970.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'science-diving', title: 'SSI Science of Diving (Theory)', description: 'Comprehensive understanding of diving physics, physiology, and decompression theory.', duration: '1 day', dives: 0, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Science of Diving', category: 'specialty', image: 'https://images.pexels.com/photos/1441024/pexels-photo-1441024.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'boat-diving', title: 'SSI Boat Diving Specialty', description: 'Learn boat diving logistics, entry/exit techniques, and safety protocols for diving from boats.', duration: '1 day', dives: 2, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Boat Diving', category: 'specialty', image: 'https://images.pexels.com/photos/8826360/pexels-photo-8826360.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'equipment-technique', title: 'SSI Equipment Technique', description: 'Master dive equipment maintenance, care, and troubleshooting. Make the right equipment choices.', duration: '1 day', dives: 0, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Equipment Technique', category: 'specialty', image: 'https://images.pexels.com/photos/1276531/pexels-photo-1276531.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'search-recovery', title: 'SSI Search and Recovery', description: 'Learn to locate and retrieve objects underwater. Find that lost wedding ring!', duration: '2 days', dives: 4, price: 'Contact for pricing', level: 'Advanced', certification: 'SSI Search and Recovery', category: 'specialty', image: 'https://images.pexels.com/photos/13478691/pexels-photo-13478691.jpeg?auto=compress&cs=tinysrgb&w=1400&q=80' },
  { id: 'computer-diving', title: 'SSI Computer Diving', description: 'Master dive computer operation for safer diving. Learn algorithms and dive profile optimization.', duration: '1 day', dives: 2, price: 'Contact for pricing', level: 'Open Water', certification: 'SSI Computer Diving', category: 'specialty', image: 'https://source.unsplash.com/featured/1200x800?dive-computer,wrist,scubadiving,gauge' },
];
