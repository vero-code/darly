export interface ResidentProfile {
  name: string;
  age: number;
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
    address: string;
    phone: string;
  };
  emergencyService: {
    provider: string;
    phone: string;
  };
}