
export interface Contact {
  id: string;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  linkedin?: string;
  notes?: string;
  isEdited?: boolean;
}

export type AppView = 'SCAN' | 'REVIEW' | 'EMAIL' | 'EXPORT';

export interface ScanResult {
  contacts: Contact[];
}
