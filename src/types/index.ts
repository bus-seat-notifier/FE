export interface BusRoute {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  duration: string;
}

export interface BusSchedule {
  id: string;
  routeId: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Alert {
  id: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  isActive: boolean;
  createdAt: Date;
  targetSeats: number;
}

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}
