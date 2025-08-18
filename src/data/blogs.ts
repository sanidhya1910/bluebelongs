export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  featured: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Marine Life Conservation in Andaman Waters',
    excerpt: 'Discover the incredible biodiversity of Andaman seas and how Blue Belong is contributing to marine conservation efforts through responsible diving practices.',
    author: 'Dr. Priya Sharma',
    date: '2024-01-15',
    category: 'Conservation',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: '2',
    title: 'Best Diving Spots Around Havelock Island',
    excerpt: 'Explore the top underwater destinations near Havelock Island, from vibrant coral reefs to mysterious underwater caves that will take your breath away.',
    author: 'Captain Mike Rodriguez',
    date: '2024-01-10',
    category: 'Diving Spots',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: '3',
    title: 'Night Diving: A Different World Underwater',
    excerpt: 'Experience the magic of night diving in Andaman waters. Learn about the unique marine life that emerges after sunset and safety tips for night dives.',
    author: 'Sarah Chen',
    date: '2024-01-08',
    category: 'Techniques',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: '4',
    title: 'Underwater Photography Tips for Beginners',
    excerpt: 'Master the art of underwater photography with these essential tips. From camera settings to composition techniques for capturing stunning marine life.',
    author: 'Alex Thompson',
    date: '2024-01-05',
    category: 'Photography',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    featured: false
  },
  {
    id: '5',
    title: 'The Coral Restoration Project: Making a Difference',
    excerpt: 'Learn about our ongoing coral restoration initiatives and how every diver can contribute to preserving the underwater ecosystem for future generations.',
    author: 'Dr. Raj Patel',
    date: '2024-01-02',
    category: 'Conservation',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    featured: true
  },
  {
    id: '6',
    title: 'Monsoon Diving: What You Need to Know',
    excerpt: 'Diving during monsoon season offers unique experiences and challenges. Get expert advice on safety, visibility, and the best practices for monsoon diving.',
    author: 'Captain Arjun Kumar',
    date: '2023-12-28',
    category: 'Safety',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1588481123261-9b6a0cb5f584?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    featured: false
  }
];
