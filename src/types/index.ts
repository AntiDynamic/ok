export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  userType: 'customer' | 'provider';
  createdAt: Date;
}

export interface ServiceProvider extends User {
  userType: 'provider';
  skills: string[];
  portfolio: PortfolioItem[];
  bio: string;
  location: string;
  rating: number;
  reviewCount: number;
  availability: Availability[];
}

export interface Customer extends User {
  userType: 'customer';
  savedServices: string[];
  bookings: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Availability {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  location: string;
  rating: number;
  reviewCount: number;
  createdAt: Date;
}

export interface Booking {
  id: string;
  serviceId: string;
  customerId: string;
  providerId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  totalAmount: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  serviceId: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
}
