


export enum LeadTier { 
  HOT = 'HOT', 
  WARM = 'WARM', 
  COLD = 'COLD' 
}

export enum LeadStatus { 
  NEW = 'NEW', 
  WORKING = 'WORKING', 
  QUALIFIED = 'QUALIFIED', 
  UNQUALIFIED = 'UNQUALIFIED', 
  ENROLLED = 'ENROLLED', 
  CLOSED = 'CLOSED' 
}

export enum LeadClassification {
  STUDENT = 'STUDENT',
  INTERN = 'INTERN',
  ENTERPRISE = 'ENTERPRISE',
  LECTURER = 'LECTURER',
  UNIVERSITY = 'UNIVERSITY',
  PARTNER = 'PARTNER',
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  assignee?: {
    name: string;
    avatarUrl: string;
  };
  score: number;
  tier: LeadTier;
  status: LeadStatus;
  createdAt: string;
  classification?: LeadClassification;
}

export enum StudentStatus {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  GRADUATED = 'Graduated',
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  course: string;
  progress: number;
  status: StudentStatus;
  joinDate: string;
  skills: string[];
  teamIds?: string[];
  skillMap?: { [key: string]: number }; // Added for Phase 3
  age?: number;
  phone?: string;
  address?: string;
  nationalId?: string;
}

export enum TaskStatus {
    COMPLETED = 'Completed',
    IN_PROGRESS = 'In Progress',
    PENDING = 'Pending',
}

export interface Task {
    id: string;
    studentId: string;
    title: string;
    status: TaskStatus;
    dueDate: string;
    score?: number; // Added for Phase 3
    relatedSkills?: string[]; // Added for Phase 3
    teamId?: string;
}

export interface TeamTask extends Task {
  studentName: string;
  studentAvatarUrl: string;
}

export interface UpdateTaskData {
    title?: string;
    dueDate?: string;
    status?: TaskStatus;
}


export interface AnomalyAlert {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  acknowledged: boolean;
  link?: string; // Added for Phase 3
}

export interface KpiData {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
}

export interface NavItem {
  path: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  roles: UserRole[]; // Added for RBAC
}

export interface ParsedJd {
  skills: string[];
  softSkills: string[];
  experienceYears: {
    min?: number;
    max?: number;
  };
  hiddenRequirements: string[];
}

export interface MatchingCandidate extends Student {
  matchScore: number;
  matchingSkills: string[];
}

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  MENTOR = 'MENTOR',
  STUDENT = 'STUDENT',
  COMPANY_USER = 'COMPANY_USER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  role: UserRole;
  age?: number;
  phone?: string;
  address?: string;
  nationalId?: string;
  companyName?: string;
}

export type TeamStatus = 'Planning' | 'In Progress' | 'Completed';

export interface Team {
  id: string;
  name: string;
  mentor: string;
  leader: Student;
  members: Student[];
  project: string;
  projectDescription: string;
  status: TeamStatus;
}

export interface JobPosting {
  id: string;
  title: string;
  companyName: string;
  status: 'Open' | 'Closed' | 'Interviewing';
  postedDate: string;
  matchCount: number;
  description: string;
}

// Added for Phase 3
export enum InterviewStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

// Added for Phase 3
export interface Interview {
  id: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  companyName: string;
  scheduledTime: string;
  location: string;
  status: InterviewStatus;
}

export interface Notification {
  id: string;
  userId: string;
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, string | number>;
  timestamp: string;
  isRead: boolean;
  link?: string;
  interviewId?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  createdAt: string;
}


// Added for Phase 3
export type SkillMap = { skill: string; score: number }[];