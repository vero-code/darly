export interface ResidentProfile {
  name: string;
  age: number;
  phone?: string;
  address: string;
  notes: string;
  timezone: string;
  primaryCaregiver: {
    name: string;
    relationship: string;
    phone: string;
    status: 'online' | 'on_call';
  };
  neighborHelper: {
    name: string;
    phone: string;
  };
  emergencyService: {
    provider: string;
    phone: string;
  };
}