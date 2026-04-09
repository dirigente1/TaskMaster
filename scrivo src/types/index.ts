export interface Agent {
  name: string;
  matricola: string;
  rank: string;
}

export interface Sanction {
  id: string;
  label: string;
  law: string;
  amount: number;
  minAmount?: number;
  maxAmount?: number;
  cat: 'stradali' | 'animali' | 'ambiente';
}

export type SanctionStatus = 'contestata';

export interface SanctionRecord {
  id: string;
  date: string;
  timestamp: number;
  sanction: string;
  law: string;
  amount: string | number;
  plate: string;
  notes: string;
  photo: string | null;
  agentName: string;
  matricola: string;
  location?: string;
  status: SanctionStatus;
}
