
export interface Company {
  id: string;
  name: string;
  description: string | null;
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

export interface Profile {
  id: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type LinkStatus = "online" | "offline" | "error" | "pending";
