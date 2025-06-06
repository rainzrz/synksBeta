export interface Company {
  id: string;
  name: string;
  description: string | null;
  website?: string | null;
  status?: 'online' | 'offline' | 'warning' | 'unknown';
  link_count?: number;
  last_check?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  url: string;
  name: string;
  description: string | null;
  company_id: string;
  status: 'online' | 'offline' | 'error' | 'pending';
  response_time: number | null;
  last_checked: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string | null;
  icon: string | null;
  category: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type LinkStatus = "online" | "offline" | "error" | "pending";

export interface DashboardStats {
  totalCompanies: number;
  totalLinks: number;
  onlineLinks: number;
  offlineLinks: number;
  errorLinks: number;
  pendingLinks: number;
  averageResponseTime: number;
}
