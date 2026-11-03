
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  image: string;
}

export const demoEvents: Event[] = [
  {
    id: "1",
    title: "Winter Clothes Distribution",
    description: "Help distribute warm clothes to families in need.",
    location: "Mirpur 10, Dhaka",
    date: "2026-12-15",
    category: "Donation",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Green Dhaka Plantation Drive",
    description: "Plant trees and make our neighborhoods greener.",
    location: "Dhanmondi, Dhaka",
    date: "2026-12-20",
    category: "Plantation",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Community Street Cleanup",
    description: "Join hands to make public spaces cleaner.",
    location: "Uttara, Dhaka",
    date: "2026-12-25",
    category: "Cleanup",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Food For Everyone",
    description: "Prepare and distribute food for people in need.",
    location: "Mohammadpur, Dhaka",
    date: "2027-01-05",
    category: "Donation",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "Community Health Awareness",
    description: "Spread awareness about basic health and hygiene.",
    location: "Bashundhara, Dhaka",
    date: "2027-01-10",
    category: "Awareness",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Support For Street Children",
    description: "Spend time supporting and helping children.",
    location: "Old Dhaka",
    date: "2027-01-15",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop",
  },
];
