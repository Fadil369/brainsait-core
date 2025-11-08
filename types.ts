import { Page, IconName } from "./constants";

export interface NavItem {
  icon: IconName;
  label: string;
  page: Page;
  subItems?: NavItem[];
}

export interface HeaderNavItem {
    label: string;
    page: Page;
}

export interface User {
  name: string;
  initials: string;
}

export interface Task {
  id: number;
  name: string;
  project?: string;
  status: 'Todo' | 'In Progress' | 'Done';
  priority: 'High' | 'Medium' | 'Low' | 'Unassigned';
  difficulty?: string;
  department?: string;
  startDate?: string;
  dueDate?: string;
}

export interface Email {
    id: number;
    // FIX: Made 'from' optional and added optional 'to' to support sent/draft emails.
    from?: string;
    to?: string;
    subject: string;
    body: string;
    timestamp: string;
    folder: 'Inbox' | 'Sent' | 'Drafts' | 'Trash';
}

export interface FileObject {
    id: number;
    name: string;
    type: 'file';
    size: string;
}

export interface Folder {
    id: number;
    name: string;
    type: 'folder';
}

export type DriveItem = FileObject | Folder;