
export type LinkStatus = "online" | "offline" | "error" | "loading";

export interface Link {
  id: string;
  url: string;
  name: string;
  description?: string;
  status: LinkStatus;
  groupId: string;
  lastChecked?: Date;
  responseTime?: number;
  downtime?: {
    since?: Date;
    duration?: string;
  };
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  clientId: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  createdAt: Date;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: "editor" | "viewer";
  avatar?: string;
  phone?: string;
  bio?: string;
}
