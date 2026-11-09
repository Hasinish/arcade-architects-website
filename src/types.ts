export type ProjectCategory = 'all' | 'exterior' | 'interior' | 'exhibition';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'exterior' | 'interior' | 'exhibition';
  location: string;
  year: string;
  coverImage: string;
  gallery: string[];
  description: string;
  scope: string[];
  specs: {
    area?: string;
    timeline?: string;
    type?: string;
    status: string;
  };
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  deliverables: string[];
  image: string;
  tag: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  comment: string;
  location: string;
  date: string;
}

