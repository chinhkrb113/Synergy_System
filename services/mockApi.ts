import { KpiData, AnomalyAlert, Lead, LeadTier, LeadStatus, Student, StudentStatus, Task, TaskStatus, ParsedJd, MatchingCandidate, User, UserRole, Team, JobPosting, TeamStatus, SkillMap, Interview, TeamTask, UpdateTaskData, LeadClassification, Notification, InterviewStatus, Company } from '../types';
import { DollarSign, Users, Activity, Target } from 'lucide-react';
import React from 'react';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Persistence Layer using localStorage ---

const saveToStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
    }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            if (new URLSearchParams(window.location.search).has('reset_storage')) {
                 localStorage.clear(); // Clear all for a full reset
                 saveToStorage(key, defaultValue);
                 return defaultValue;
            }
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
    }
    saveToStorage(key, defaultValue);
    return defaultValue;
};


// --- Initial Mock Data (Seed Data) ---

const INITIAL_MOCK_USERS: User[] = [
  { id: 'user_admin', email: 'admin@example.com', name: 'Admin User', avatarUrl: 'https://picsum.photos/seed/admin/32/32', role: UserRole.ADMIN, address: '123 Admin Ave', phone: '555-0101', nationalId: '001088001234' },
  { id: 'user_agent', email: 'agent@example.com', name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/agent/32/32', role: UserRole.AGENT, address: '456 Agent St', phone: '555-0102', nationalId: '001088005678' },
  { id: 'user_mentor', email: 'mentor@example.com', name: 'Mentor Mike', avatarUrl: 'https://picsum.photos/seed/mentor/32/32', role: UserRole.MENTOR, age: 35, address: '789 Mentor Blvd', phone: '555-0103', nationalId: '001088009012' },
  { id: 'student_4', email: 'student@example.com', name: 'Emma Williams', avatarUrl: `https://picsum.photos/seed/Emma Williams/32/32`, role: UserRole.STUDENT, age: 23 },
  { id: 'user_company', email: 'company@example.com', name: 'Recruiter Ray', avatarUrl: 'https://picsum.photos/seed/company/32/32', role: UserRole.COMPANY_USER, address: '101 Corporate Pkwy', phone: '555-0104', nationalId: '001088003456', companyName: 'Tech Innovators Inc.' },
  { id: 'student_1', email: 'alice.j@example.com', name: 'Alice Johnson', avatarUrl: 'https://picsum.photos/seed/Alice/32/32', role: UserRole.STUDENT, age: 22 },
  { id: 'student_2', email: 'bob.s@example.com', name: 'Bob Smith', avatarUrl: 'https://picsum.photos/seed/Bob/32/32', role: UserRole.STUDENT, age: 24 },
  { id: 'student_3', email: 'charlie.d@example.com', name: 'Charlie Davis', avatarUrl: 'https://picsum.photos/seed/Charlie/32/32', role: UserRole.STUDENT, age: 21 },
  { id: 'student_5', email: 'david.lee@example.com', name: 'David Lee', avatarUrl: `https://picsum.photos/seed/David Lee/32/32`, role: UserRole.STUDENT, age: 25 },
  { id: 'student_6', email: 'frank.g@example.com', name: 'Frank Green', avatarUrl: `https://picsum.photos/seed/Frank Green/32/32`, role: UserRole.STUDENT, age: 22 },
  { id: 'student_7', email: 'grace.h@example.com', name: 'Grace Hall', avatarUrl: `https://picsum.photos/seed/Grace Hall/32/32`, role: UserRole.STUDENT, age: 23 },
  { id: 'student_8', email: 'heidi.i@example.com', name: 'Heidi Ivanova', avatarUrl: `https://picsum.photos/seed/Heidi Ivanova/32/32`, role: UserRole.STUDENT, age: 21 },
];

const INITIAL_MOCK_LEADS: Lead[] = [
    { id: 'lead_1', name: 'John Doe', email: 'john.doe@example.com', source: 'Web', assignee: { name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/Agent Smith/32/32' }, score: 95.5, tier: LeadTier.HOT, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_2', name: 'Jane Smith', email: 'jane.smith@example.com', source: 'Facebook', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, score: 82.1, tier: LeadTier.HOT, status: LeadStatus.WORKING, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.INTERN },
    { id: 'lead_3', name: 'Alex Johnson', email: 'alex.j@example.com', source: 'Referral', assignee: { name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/Agent Smith/32/32' }, score: 75.0, tier: LeadTier.WARM, status: LeadStatus.QUALIFIED, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.ENTERPRISE },
    { id: 'lead_4', name: 'Emily Brown', email: 'emily.b@example.com', source: 'Zalo', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, score: 68.3, tier: LeadTier.WARM, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.UNIVERSITY },
    { id: 'lead_5', name: 'Michael Davis', email: 'michael.d@example.com', source: 'Web', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, score: 55.9, tier: LeadTier.COLD, status: LeadStatus.UNQUALIFIED, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_6', name: 'Sarah Wilson', email: 'sarah.w@example.com', source: 'Referral', assignee: { name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/Agent Smith/32/32' }, score: 91.2, tier: LeadTier.HOT, status: LeadStatus.ENROLLED, createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_unassigned_1', name: 'Unassigned Lead A', email: 'unassigned.a@example.com', source: 'Organic', score: 88.0, tier: LeadTier.HOT, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_unassigned_2', name: 'Unassigned Lead B', email: 'unassigned.b@example.com', source: 'Campaign', score: 72.0, tier: LeadTier.WARM, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];

const INITIAL_MOCK_STUDENTS: Student[] = [
    { id: 'student_1', name: 'Alice Johnson', email: 'alice.j@example.com', avatarUrl: 'https://picsum.photos/seed/Alice/200/200', course: 'Full-Stack Development', progress: 85, status: StudentStatus.ACTIVE, joinDate: new Date('2023-01-15').toISOString(), skills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker'], teamIds: ['team_1'], skillMap: { 'React': 90, 'Node.js': 85, 'TypeScript': 80, 'SQL': 75, 'Docker': 70, 'Communication': 88 }, age: 22, address: '123 Maple St', phone: '555-1111', nationalId: '123456789' },
    { id: 'student_2', name: 'Bob Smith', email: 'bob.s@example.com', avatarUrl: 'https://picsum.photos/seed/Bob/200/200', course: 'Data Science', progress: 70, status: StudentStatus.ACTIVE, joinDate: new Date('2023-02-20').toISOString(), skills: ['Python', 'Pandas', 'TensorFlow', 'Scikit-learn', 'SQL'], teamIds: ['team_1'], skillMap: { 'Python': 95, 'Pandas': 85, 'TensorFlow': 75, 'Scikit-learn': 80, 'SQL': 90, 'Problem Solving': 92 }, age: 24 },
    { id: 'student_3', name: 'Charlie Davis', email: 'charlie.d@example.com', avatarUrl: 'https://picsum.photos/seed/Charlie/200/200', course: 'UI/UX Design', progress: 95, status: StudentStatus.GRADUATED, joinDate: new Date('2022-11-10').toISOString(), skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'], teamIds: ['team_2'], skillMap: { 'Figma': 92, 'Adobe XD': 88, 'User Research': 95, 'Prototyping': 90, 'Teamwork': 85 }, age: 21 },
    { id: 'student_4', name: 'Emma Williams', email: 'student@example.com', avatarUrl: `https://picsum.photos/seed/Emma Williams/200/200`, course: 'Full-Stack Development', progress: 60, status: StudentStatus.ACTIVE, joinDate: new Date('2023-03-01').toISOString(), skills: ['HTML', 'CSS', 'JavaScript', 'React'], teamIds: ['team_2'], skillMap: { 'HTML': 80, 'CSS': 75, 'JavaScript': 85, 'React': 70, 'Adaptability': 80 }, age: 23, address: '456 Oak Ave', phone: '555-2222', nationalId: '987654321' },
    { id: 'student_5', name: 'David Lee', email: 'david.lee@example.com', avatarUrl: `https://picsum.photos/seed/David Lee/200/200`, course: 'DevOps Engineering', progress: 78, status: StudentStatus.ACTIVE, joinDate: new Date('2023-04-12').toISOString(), skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'], teamIds: ['team_1'], skillMap: { 'Docker': 90, 'Kubernetes': 80, 'AWS': 85, 'CI/CD': 88, 'Terraform': 75, 'Critical Thinking': 90 }, age: 25 },
    { id: 'student_6', name: 'Frank Green', email: 'frank.g@example.com', avatarUrl: `https://picsum.photos/seed/Frank Green/200/200`, course: 'Data Science', progress: 55, status: StudentStatus.PAUSED, joinDate: new Date('2023-05-18').toISOString(), skills: ['Python', 'SQL', 'Data Visualization'], teamIds: [], skillMap: { 'Python': 70, 'SQL': 80, 'Data Visualization': 65 }, age: 22 },
    { id: 'student_7', name: 'Grace Hall', email: 'grace.h@example.com', avatarUrl: `https://picsum.photos/seed/Grace Hall/200/200`, course: 'Full-Stack Development', progress: 92, status: StudentStatus.ACTIVE, joinDate: new Date('2023-01-25').toISOString(), skills: ['Vue.js', 'Nuxt.js', 'GraphQL', 'MongoDB'], teamIds: ['team_2'], skillMap: { 'Vue.js': 95, 'Nuxt.js': 90, 'GraphQL': 85, 'MongoDB': 88 }, age: 23 },
    { id: 'student_8', name: 'Heidi Ivanova', email: 'heidi.i@example.com', avatarUrl: `https://picsum.photos/seed/Heidi Ivanova/200/200`, course: 'UI/UX Design', progress: 88, status: StudentStatus.ACTIVE, joinDate: new Date('2023-06-02').toISOString(), skills: ['Figma', 'Web Accessibility', 'Design Systems'], teamIds: [], skillMap: { 'Figma': 95, 'Web Accessibility': 85, 'Design Systems': 90 }, age: 21 },
];

const INITIAL_MOCK_TASKS: Task[] = [
    { id: 'task_1', studentId: 'student_1', teamId: 'team_1', title: 'Setup Node.js Backend', status: TaskStatus.COMPLETED, dueDate: new Date('2023-08-15').toISOString(), score: 95, relatedSkills: ['Node.js'] },
    { id: 'task_2', studentId: 'student_1', teamId: 'team_1', title: 'Develop User Auth Endpoints', status: TaskStatus.IN_PROGRESS, dueDate: new Date('2023-08-30').toISOString(), score: 80, relatedSkills: ['Node.js', 'SQL'] },
    { id: 'task_3', studentId: 'student_1', title: 'React State Management Research', status: TaskStatus.PENDING, dueDate: new Date('2023-09-05').toISOString() },
    { id: 'task_4', studentId: 'student_2', teamId: 'team_1', title: 'Data Cleaning Script', status: TaskStatus.COMPLETED, dueDate: new Date('2023-08-12').toISOString(), score: 98, relatedSkills: ['Python', 'Pandas'] },
    { id: 'task_5', studentId: 'student_4', teamId: 'team_2', title: 'Create Landing Page Wireframe', status: TaskStatus.COMPLETED, dueDate: new Date('2023-09-01').toISOString(), score: 92, relatedSkills: ['Figma'] },
    { id: 'task_6', studentId: 'student_4', teamId: 'team_2', title: 'Build Reusable Button Component', status: TaskStatus.IN_PROGRESS, dueDate: new Date('2023-09-10').toISOString(), score: 85, relatedSkills: ['React', 'CSS'] },
    { id: 'task_7', studentId: 'student_5', teamId: 'team_1', title: 'Configure Docker Compose', status: TaskStatus.COMPLETED, dueDate: new Date('2023-08-20').toISOString(), score: 94, relatedSkills: ['Docker'] },
    { id: 'task_8', studentId: 'student_7', teamId: 'team_2', title: 'Design Component Library in Figma', status: TaskStatus.IN_PROGRESS, dueDate: new Date('2023-09-15').toISOString() },
];

const INITIAL_MOCK_TEAMS: Team[] = [
    { id: 'team_1', name: 'Alpha Coders', mentor: 'Mentor Mike', project: 'E-commerce Platform', projectDescription: 'A full-stack e-commerce site using the MERN stack with a data analytics dashboard.', status: 'In Progress', leader: INITIAL_MOCK_STUDENTS[0], members: [INITIAL_MOCK_STUDENTS[0], INITIAL_MOCK_STUDENTS[1], INITIAL_MOCK_STUDENTS[4]] },
    { id: 'team_2', name: 'Design Dynamos', mentor: 'Mentor Mike', project: 'Social Media App UI', projectDescription: 'Design a modern, accessible UI for a new social media application, focusing on user engagement.', status: 'Planning', leader: INITIAL_MOCK_STUDENTS[2], members: [INITIAL_MOCK_STUDENTS[2], INITIAL_MOCK_STUDENTS[3], INITIAL_MOCK_STUDENTS[6]] },
];

const INITIAL_MOCK_JOBS: JobPosting[] = [
    { id: 'job_1', title: 'Senior Frontend Developer', companyName: 'Tech Innovators Inc.', status: 'Open', postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 5, description: 'Seeking a Senior Frontend Developer with 5+ years of experience in React, TypeScript, and modern web technologies. Must be a team player with strong communication skills. Experience with GraphQL is a plus.' },
    { id: 'job_2', title: 'Data Scientist', companyName: 'Data Insights Co.', status: 'Interviewing', postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 3, description: 'Data Scientist needed to build and deploy machine learning models. Required skills: Python, TensorFlow, Scikit-learn, and strong SQL knowledge. M.S. or Ph.D. in a quantitative field preferred.' },
    { id: 'job_3', title: 'DevOps Engineer', companyName: 'Cloud Solutions', status: 'Closed', postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 8, description: 'Join our DevOps team to manage our cloud infrastructure. Expertise in AWS, Kubernetes, Docker, and CI/CD pipelines is essential. Terraform experience is highly desirable.' },
];

const INITIAL_MOCK_COMPANIES: Company[] = [
    { id: 'comp_1', name: 'Tech Innovators Inc.', industry: 'Technology', contactEmail: 'hr@techinnovators.com', createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'comp_2', name: 'Data Insights Co.', industry: 'Data Analytics', contactEmail: 'contact@datainsights.co', createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'comp_3', name: 'Cloud Solutions', industry: 'Cloud Computing', contactEmail: 'info@cloudsolutions.dev', createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() },
];

const INITIAL_MOCK_INTERVIEWS: Interview[] = [];
const INITIAL_MOCK_NOTIFICATIONS: Notification[] = [];


// --- Data Stores ---

let MOCK_USERS = loadFromStorage<User[]>('synergy_users', INITIAL_MOCK_USERS);
let MOCK_LEADS = loadFromStorage<Lead[]>('synergy_leads', INITIAL_MOCK_LEADS);
let MOCK_STUDENTS = loadFromStorage<Student[]>('synergy_students', INITIAL_MOCK_STUDENTS);
let MOCK_TASKS = loadFromStorage<Task[]>('synergy_tasks', INITIAL_MOCK_TASKS);
let MOCK_TEAMS = loadFromStorage<Team[]>('synergy_teams', INITIAL_MOCK_TEAMS);
let MOCK_JOBS = loadFromStorage<JobPosting[]>('synergy_jobs', INITIAL_MOCK_JOBS);
let MOCK_INTERVIEWS = loadFromStorage<Interview[]>('synergy_interviews', INITIAL_MOCK_INTERVIEWS);
let MOCK_NOTIFICATIONS = loadFromStorage<Notification[]>('synergy_notifications', INITIAL_MOCK_NOTIFICATIONS);
let MOCK_COMPANIES = loadFromStorage<Company[]>('synergy_companies', INITIAL_MOCK_COMPANIES);

// --- API Functions ---

// Dashboard
export const getKpiData = async (t): Promise<KpiData[]> => {
    await delay(500);
    return [
        { title: t('totalRevenue'), value: '$45,231.89', change: '+20.1%', changeType: 'increase', icon: React.createElement(DollarSign, {className: "h-5 w-5"}) },
        { title: t('newLeads'), value: '+2,350', change: '+180.1%', changeType: 'increase', icon: React.createElement(Users, {className: "h-5 w-5"}) },
        { title: t('conversionRate'), value: '12.5%', change: '-2.4%', changeType: 'decrease', icon: React.createElement(Target, {className: "h-5 w-5"}) },
        { title: t('activeLearners'), value: '573', change: '+19%', changeType: 'increase', icon: React.createElement(Activity, {className: "h-5 w-5"}) },
    ];
};

export const getSalesData = () => [
    { name: 'Jan', revenue: 4000, profit: 2400 }, { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 2000, profit: 9800 }, { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: 1890, profit: 4800 }, { name: 'Jun', revenue: 2390, profit: 3800 },
];

export const getLeadsBySourceData = () => [
    { name: 'Web', value: 400 }, { name: 'Facebook', value: 300 },
    { name: 'Referral', value: 200 }, { name: 'Zalo', value: 278 },
];

export const getAnomalyAlerts = async (): Promise<AnomalyAlert[]> => {
    await delay(800);
    return [
        { id: 'alert_1', title: 'Unusually high lead volume from "Web"', description: 'Lead count from the "Web" source is 3 standard deviations above the weekly average.', severity: 'medium', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), acknowledged: false, link: '/acquisition/leads' },
        { id: 'alert_2', title: 'Student progress stalled for Team Alpha', description: 'No tasks have been completed by members of "Alpha Coders" in the last 5 days.', severity: 'high', timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), acknowledged: false, link: '/learning/teams/team_1' },
        { id: 'alert_3', title: 'Low conversion rate for Agent Smith', description: 'Agent Smith\'s lead-to-enrollment conversion rate dropped by 15% this month.', severity: 'low', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), acknowledged: true },
    ];
};

// Auth
export const loginUser = async (email: string): Promise<User | null> => {
    await delay(600);
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
};

// Leads
export const getLeads = async (agentName?: string): Promise<Lead[]> => {
    await delay(400);
    if (agentName) {
        return MOCK_LEADS.filter(lead => lead.assignee?.name === agentName);
    }
    return MOCK_LEADS;
};

export const getUnassignedLeads = async (): Promise<Lead[]> => {
    await delay(400);
    return MOCK_LEADS.filter(lead => !lead.assignee);
};

export const claimLead = async (leadId: string, user: User): Promise<Lead> => {
    await delay(500);
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === leadId);
    if (leadIndex === -1) throw new Error("Lead not found");

    MOCK_LEADS[leadIndex].assignee = { name: user.name, avatarUrl: user.avatarUrl };
    saveToStorage('synergy_leads', MOCK_LEADS);
    return MOCK_LEADS[leadIndex];
};


export const getLeadById = async (id: string): Promise<Lead | null> => {
    await delay(200);
    return MOCK_LEADS.find(l => l.id === id) || null;
};

export const createLead = async (data: any): Promise<Lead> => {
    await delay(500);
    const newLead: Lead = {
        id: `lead_${Date.now()}`,
        name: data.name,
        email: data.email,
        source: data.source,
        score: data.score,
        tier: data.tier,
        status: data.status,
        classification: data.classification,
        assignee: { name: data.assigneeName, avatarUrl: `https://picsum.photos/seed/${data.assigneeName}/32/32` },
        createdAt: new Date().toISOString(),
    };
    MOCK_LEADS.unshift(newLead);
    saveToStorage('synergy_leads', MOCK_LEADS);
    return newLead;
};

export const updateLead = async (id: string, data: any): Promise<Lead> => {
    await delay(500);
    const index = MOCK_LEADS.findIndex(l => l.id === id);
    if (index === -1) throw new Error("Lead not found");
    
    const updatedLead = {
        ...MOCK_LEADS[index],
        ...data,
        assignee: { name: data.assigneeName, avatarUrl: `https://picsum.photos/seed/${data.assigneeName}/32/32` }
    };
    MOCK_LEADS[index] = updatedLead;
    saveToStorage('synergy_leads', MOCK_LEADS);
    return updatedLead;
};

export const deleteLead = async (id: string): Promise<boolean> => {
    await delay(300);
    const initialLength = MOCK_LEADS.length;
    MOCK_LEADS = MOCK_LEADS.filter(l => l.id !== id);
    saveToStorage('synergy_leads', MOCK_LEADS);
    return MOCK_LEADS.length < initialLength;
};

// Students
export const getStudents = async (): Promise<Student[]> => {
    await delay(300);
    return MOCK_STUDENTS;
};

export const getStudentById = async (id: string): Promise<Student | null> => {
    await delay(200);
    return MOCK_STUDENTS.find(s => s.id === id) || null;
};

export const createStudent = async (data: Omit<Student, 'id' | 'joinDate' | 'avatarUrl' | 'progress'>): Promise<Student> => {
    await delay(500);
    const studentId = `student_${Date.now()}`;
    const newStudent: Student = {
        id: studentId,
        name: data.name,
        email: data.email,
        course: data.course,
        status: data.status,
        skills: data.skills,
        avatarUrl: `https://picsum.photos/seed/${data.name}/200/200`,
        joinDate: new Date().toISOString(),
        progress: 0,
    };
    MOCK_STUDENTS.unshift(newStudent);
    saveToStorage('synergy_students', MOCK_STUDENTS);

    // Automatic user account creation
    const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (!userExists) {
        const newUser: User = {
            id: studentId, // Use the same ID
            name: data.name,
            email: data.email,
            role: UserRole.STUDENT,
            avatarUrl: `https://picsum.photos/seed/${data.name}/32/32`,
        };
        MOCK_USERS.push(newUser);
        saveToStorage('synergy_users', MOCK_USERS);
    }

    return newStudent;
};

export const updateStudent = async (id: string, data: Partial<Omit<Student, 'id'>>): Promise<Student> => {
    await delay(500);
    const index = MOCK_STUDENTS.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Student not found");
    
    const updatedStudent = { ...MOCK_STUDENTS[index], ...data };
    MOCK_STUDENTS[index] = updatedStudent;
    saveToStorage('synergy_students', MOCK_STUDENTS);
    return updatedStudent;
};

export const deleteStudent = async (id: string): Promise<boolean> => {
    await delay(300);
    MOCK_STUDENTS = MOCK_STUDENTS.filter(s => s.id !== id);
    saveToStorage('synergy_students', MOCK_STUDENTS);
    return true;
};

export const getStudentSkillMap = async (studentId: string): Promise<SkillMap> => {
    await delay(600);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student) return [];
    
    // Simulate dynamic scores based on completed tasks
    const studentTasks = MOCK_TASKS.filter(t => t.studentId === studentId && t.status === TaskStatus.COMPLETED && t.score);
    const skillMap = student.skillMap ? { ...student.skillMap } : {};

    studentTasks.forEach(task => {
        task.relatedSkills?.forEach(skill => {
            if (skillMap[skill]) {
                skillMap[skill] = Math.min(100, Math.round(skillMap[skill] * 0.8 + task.score! * 0.2));
            } else {
                 skillMap[skill] = task.score!;
            }
        });
    });

    return Object.entries(skillMap).map(([skill, score]) => ({ skill, score }));
};

export const updateStudentSkills = async (studentId: string, skills: { skill: string; score: number }[]): Promise<boolean> => {
    await delay(700);
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return false;
    
    const newSkillMap: { [key: string]: number } = {};
    const newSkillList: string[] = [];
    skills.forEach(s => {
        newSkillMap[s.skill] = s.score;
        newSkillList.push(s.skill);
    });
    
    MOCK_STUDENTS[studentIndex].skillMap = newSkillMap;
    // Keep skills list in sync with the map keys
    MOCK_STUDENTS[studentIndex].skills = newSkillList;

    saveToStorage('synergy_students', MOCK_STUDENTS);
    return true;
};


// Tasks
export const getTasksForStudent = async (studentId: string): Promise<Task[]> => {
    await delay(400);
    return MOCK_TASKS.filter(t => t.studentId === studentId);
};

export const createTask = async (data: Omit<Task, 'id' | 'status'>): Promise<Task> => {
    await delay(300);
    const newTask: Task = {
        ...data,
        id: `task_${Date.now()}_${Math.random()}`,
        status: TaskStatus.PENDING,
    };
    MOCK_TASKS.push(newTask);
    saveToStorage('synergy_tasks', MOCK_TASKS);
    return newTask;
};

export const updateTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
    await delay(300);
    const index = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error("Task not found");
    const updatedTask = { ...MOCK_TASKS[index], ...data };
    MOCK_TASKS[index] = updatedTask;
    saveToStorage('synergy_tasks', MOCK_TASKS);
    return updatedTask;
};

export const getTeamTaskById = async (taskId: string): Promise<TeamTask | null> => {
    await delay(200);
    const task = MOCK_TASKS.find(t => t.id === taskId);
    if (!task) return null;
    const student = await getStudentById(task.studentId);
    if (!student) return null;
    return {
        ...task,
        studentName: student.name,
        studentAvatarUrl: student.avatarUrl,
    };
};


// Matching & JD Parsing
export const getMatchingStudents = async (jd: ParsedJd): Promise<MatchingCandidate[]> => {
    await delay(1500);
    const requiredSkills = jd.skills || [];
    const requiredSoftSkills = jd.softSkills || [];
    const experienceYears = jd.experienceYears || {};

    const allStudents = await getStudents();

    const candidates = allStudents.map(student => {
        const studentSkills = student.skills || [];

        const matchingSkills = studentSkills.filter(s => 
            requiredSkills.some(req => s.toLowerCase().includes(req.toLowerCase()))
        );
        
        let score = requiredSkills.length > 0 
            ? (matchingSkills.length / requiredSkills.length) * 100 
            : 0;

        // If no required skills are parsed, give a small base score for having any skills.
        if (requiredSkills.length === 0 && studentSkills.length > 0) {
            score = 25;
        }

        // Bonus for soft skills
        const matchingSoftSkills = studentSkills.filter(s => 
            requiredSoftSkills.some(req => s.toLowerCase().includes(req.toLowerCase()))
        );
        score += matchingSoftSkills.length * 5;

        // Experience adjustment
        const studentExp = (student.age || 22) - 21;
        if (experienceYears.min && studentExp < experienceYears.min) {
            score *= 0.7;
        }
        if (experienceYears.max && studentExp > experienceYears.max) {
             score *= 0.9;
        }

        return {
            ...student,
            matchScore: Math.min(100, score),
            matchingSkills: matchingSkills,
        };
    });

    return candidates.filter(c => c.matchScore > 40).sort((a, b) => b.matchScore - a.matchScore);
};

export const requestInterview = async (jobId: string, candidateId: string, companyName: string, scheduledTime: string, location: string): Promise<Interview> => {
    await delay(700);
    const job = MOCK_JOBS.find(j => j.id === jobId);
    if (!job) throw new Error("Job not found");

    const newInterview: Interview = {
        id: `interview_${Date.now()}`,
        jobId,
        jobTitle: job.title,
        candidateId,
        companyName,
        scheduledTime,
        location,
        status: InterviewStatus.PENDING,
    };
    MOCK_INTERVIEWS.push(newInterview);
    saveToStorage('synergy_interviews', MOCK_INTERVIEWS);
    
    const newNotification: Notification = {
        id: `notif_${Date.now()}`,
        userId: candidateId,
        titleKey: 'interviewRequestTitle',
        messageKey: 'interviewRequestMessage',
        messageParams: { companyName, jobTitle: job.title },
        timestamp: new Date().toISOString(),
        isRead: false,
        interviewId: newInterview.id,
    };
    MOCK_NOTIFICATIONS.unshift(newNotification);
    saveToStorage('synergy_notifications', MOCK_NOTIFICATIONS);

    return newInterview;
};


// Teams
export const getTeams = async (): Promise<Team[]> => {
    await delay(400);
    return MOCK_TEAMS;
};

export const getTeamById = async (teamId: string): Promise<Team | null> => {
    await delay(300);
    return MOCK_TEAMS.find(t => t.id === teamId) || null;
};

export const getTeamForStudent = async (studentId: string): Promise<Team | null> => {
    await delay(300);
    const student = await getStudentById(studentId);
    if (!student || !student.teamIds || student.teamIds.length === 0) return null;
    return getTeamById(student.teamIds[0]);
};

export const getTeamsForStudent = async (studentId: string): Promise<Team[] | null> => {
     await delay(300);
    const student = await getStudentById(studentId);
    if (!student || !student.teamIds) return [];
    return MOCK_TEAMS.filter(team => student.teamIds!.includes(team.id));
}

export const getTeamsForMentor = async (mentorName: string): Promise<Team[] | null> => {
    await delay(300);
    return MOCK_TEAMS.filter(team => team.mentor === mentorName);
};

export const suggestTeamMembers = async (projectDescription: string): Promise<Student[]> => {
    await delay(1500); // Simulate AI call
    const allStudents = await getStudents();
    const unassignedStudents = allStudents.filter(s => !s.teamIds || s.teamIds.length === 0);
    // Dummy logic: just return a few unassigned students
    return unassignedStudents.slice(0, 5);
};

export const createTeam = async (data: Omit<Team, 'id'|'leader'|'members'> & { memberIds: string[] }): Promise<Team> => {
    await delay(600);
    const members = MOCK_STUDENTS.filter(s => data.memberIds.includes(s.id));
    if (members.length === 0) throw new Error("A team must have members.");
    
    const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: data.name,
        project: data.project,
        projectDescription: data.projectDescription,
        status: data.status,
        mentor: data.mentor,
        leader: members[0], // Assign first member as leader for simplicity
        members: members,
    };
    
    MOCK_TEAMS.unshift(newTeam);
    // Update students' team assignments
    data.memberIds.forEach(studentId => {
        const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
        if (studentIndex > -1) {
            MOCK_STUDENTS[studentIndex].teamIds = [...(MOCK_STUDENTS[studentIndex].teamIds || []), newTeam.id];
        }
    });

    saveToStorage('synergy_teams', MOCK_TEAMS);
    saveToStorage('synergy_students', MOCK_STUDENTS);
    return newTeam;
};

export const updateTeam = async (teamId: string, data: Omit<Team, 'id'> & { memberIds?: string[] }): Promise<Team> => {
    await delay(600);
    const index = MOCK_TEAMS.findIndex(t => t.id === teamId);
    if (index === -1) throw new Error("Team not found");

    const originalTeam = MOCK_TEAMS[index];
    const updatedTeam = { ...originalTeam, ...data };

    if (data.memberIds) {
        const newMembers = MOCK_STUDENTS.filter(s => data.memberIds!.includes(s.id));
        updatedTeam.members = newMembers;
        if (newMembers.length > 0 && !newMembers.some(m => m.id === updatedTeam.leader.id)) {
            updatedTeam.leader = newMembers[0]; // Re-assign leader if old one is removed
        }
    }
    
    MOCK_TEAMS[index] = updatedTeam;
    saveToStorage('synergy_teams', MOCK_TEAMS);
    return updatedTeam;
};


export const deleteTeam = async (teamId: string): Promise<boolean> => {
    await delay(400);
    MOCK_TEAMS = MOCK_TEAMS.filter(t => t.id !== teamId);
    saveToStorage('synergy_teams', MOCK_TEAMS);
    return true;
};

export const getTasksForTeam = async (teamId: string): Promise<TeamTask[]> => {
    await delay(400);
    const teamTasks = MOCK_TASKS.filter(t => t.teamId === teamId);
    const students = await getStudents();
    return teamTasks.map(task => {
        const student = students.find(s => s.id === task.studentId);
        return {
            ...task,
            studentName: student?.name || 'Unknown',
            studentAvatarUrl: student?.avatarUrl || '',
        };
    }).sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

// Jobs
export const getJobs = async (companyName?: string): Promise<JobPosting[]> => {
    await delay(300);
    if (companyName) {
        return MOCK_JOBS.filter(job => job.companyName === companyName);
    }
    return MOCK_JOBS;
};

export const getJobById = async (id: string): Promise<JobPosting | null> => {
    await delay(200);
    return MOCK_JOBS.find(j => j.id === id) || null;
};

export const createJob = async (data: Omit<JobPosting, 'id' | 'postedDate' | 'matchCount' | 'status'>): Promise<JobPosting> => {
    await delay(500);
    const newJob: JobPosting = {
        id: `job_${Date.now()}`,
        title: data.title,
        companyName: data.companyName,
        description: data.description,
        status: 'Open',
        postedDate: new Date().toISOString(),
        matchCount: Math.floor(Math.random() * 10), // Simulate initial matches
    };
    MOCK_JOBS.unshift(newJob);
    saveToStorage('synergy_jobs', MOCK_JOBS);
    return newJob;
};

export const getJobMatchesForStudent = async (studentId: string): Promise<JobPosting[]> => {
    await delay(800);
    // This is a dummy implementation. A real one would use the student's skills.
    return MOCK_JOBS.filter(job => job.status === 'Open').slice(0, 3);
};


// Ops
export const getEnrollmentData = async () => {
    await delay(700);
    return [
        { name: 'Mar', newStudents: 25 }, { name: 'Apr', newStudents: 32 },
        { name: 'May', newStudents: 28 }, { name: 'Jun', newStudents: 45 },
        { name: 'Jul', newStudents: 41 }, { name: 'Aug', newStudents: 52 },
    ];
};

export const getTeamStatusData = async () => {
    await delay(700);
    return [
        { name: 'Planning', value: MOCK_TEAMS.filter(t => t.status === 'Planning').length },
        { name: 'In Progress', value: MOCK_TEAMS.filter(t => t.status === 'In Progress').length },
        { name: 'Completed', value: MOCK_TEAMS.filter(t => t.status === 'Completed').length },
    ];
};

// Users
export const getUsers = async (): Promise<User[]> => {
    await delay(300);
    return MOCK_USERS;
};
export const getUserById = async (id: string): Promise<User | null> => {
    await delay(200);
    return MOCK_USERS.find(u => u.id === id) || null;
};


export const updateUser = async (id: string, data: Partial<Omit<User, 'id'|'email'|'role'>>): Promise<User> => {
    await delay(500);
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    
    const updatedUser = { ...MOCK_USERS[index], ...data };
    MOCK_USERS[index] = updatedUser;
    saveToStorage('synergy_users', MOCK_USERS);
    return updatedUser;
};

export const updateUserRole = async (userId: string, newRole: UserRole): Promise<User | null> => {
    await delay(500);
    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index > -1) {
        MOCK_USERS[index].role = newRole;
        saveToStorage('synergy_users', MOCK_USERS);
        return MOCK_USERS[index];
    }
    return null;
};

export const deleteUser = async (userId: string): Promise<boolean> => {
    await delay(400);
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== userId);
    saveToStorage('synergy_users', MOCK_USERS);
    return true;
};

export const updateUserPassword = async (userId: string, newPass: string): Promise<boolean> => {
    await delay(600);
    // In a real app, this would update the password hash. Here we just simulate success.
    console.log(`Password for user ${userId} changed to ${newPass}`);
    return true;
};

// Notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    await delay(200);
    return MOCK_NOTIFICATIONS.filter(n => n.userId === userId);
};

export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
    await delay(100);
    const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
    if (index > -1) {
        MOCK_NOTIFICATIONS[index].isRead = true;
        saveToStorage('synergy_notifications', MOCK_NOTIFICATIONS);
        return true;
    }
    return false;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
    await delay(100);
    MOCK_NOTIFICATIONS.forEach(n => {
        if (n.userId === userId) {
            n.isRead = true;
        }
    });
    saveToStorage('synergy_notifications', MOCK_NOTIFICATIONS);
    return true;
};

export const getInterviewById = async (interviewId: string): Promise<Interview | null> => {
    await delay(300);
    const interview = MOCK_INTERVIEWS.find(i => i.id === interviewId);
    return interview || null;
};

export const respondToInterview = async (interviewId: string, status: InterviewStatus.ACCEPTED | InterviewStatus.DECLINED): Promise<Interview | null> => {
    await delay(500);
    const interviewIndex = MOCK_INTERVIEWS.findIndex(i => i.id === interviewId);
    if (interviewIndex > -1) {
        MOCK_INTERVIEWS[interviewIndex].status = status;
        saveToStorage('synergy_interviews', MOCK_INTERVIEWS);

        const interview = MOCK_INTERVIEWS[interviewIndex];
        const job = MOCK_JOBS.find(j => j.id === interview.jobId);
        const student = MOCK_STUDENTS.find(s => s.id === interview.candidateId);
        const companyUser = MOCK_USERS.find(u => u.role === UserRole.COMPANY_USER && u.companyName === interview.companyName);

        if (job && student && companyUser) {
             const newNotification: Notification = {
                id: `notif_${Date.now()}`,
                userId: companyUser.id,
                titleKey: status === InterviewStatus.ACCEPTED ? 'interviewAcceptedTitle' : 'interviewDeclinedTitle',
                messageKey: status === InterviewStatus.ACCEPTED ? 'interviewAcceptedMessage' : 'interviewDeclinedMessage',
                messageParams: { studentName: student.name, jobTitle: job.title },
                timestamp: new Date().toISOString(),
                isRead: false,
            };
            MOCK_NOTIFICATIONS.unshift(newNotification);
            saveToStorage('synergy_notifications', MOCK_NOTIFICATIONS);
        }

        return MOCK_INTERVIEWS[interviewIndex];
    }
    return null;
};

// Admin - Companies
export const getCompanies = async (): Promise<Company[]> => {
    await delay(300);
    return MOCK_COMPANIES;
};

export const createCompany = async (data: Omit<Company, 'id' | 'createdAt'>): Promise<Company> => {
    await delay(500);
    const newCompany: Company = {
        id: `comp_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
    };
    MOCK_COMPANIES.unshift(newCompany);
    saveToStorage('synergy_companies', MOCK_COMPANIES);

    // Automatic user account creation for the company
    const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === data.contactEmail.toLowerCase());
    if (!userExists) {
        const newUser: User = {
            id: `user_company_${Date.now()}`,
            email: data.contactEmail,
            name: `${data.name} Rep`, // Default name for the company user
            avatarUrl: `https://picsum.photos/seed/${data.name}/32/32`,
            role: UserRole.COMPANY_USER,
            companyName: data.name,
        };
        MOCK_USERS.push(newUser);
        saveToStorage('synergy_users', MOCK_USERS);
    }

    return newCompany;
};

export const updateCompany = async (id: string, data: Partial<Omit<Company, 'id'>>): Promise<Company> => {
    await delay(500);
    const index = MOCK_COMPANIES.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Company not found");
    
    const updatedCompany = { ...MOCK_COMPANIES[index], ...data };
    MOCK_COMPANIES[index] = updatedCompany;
    saveToStorage('synergy_companies', MOCK_COMPANIES);
    return updatedCompany;
};

export const deleteCompany = async (id: string): Promise<boolean> => {
    await delay(300);
    MOCK_COMPANIES = MOCK_COMPANIES.filter(c => c.id !== id);
    saveToStorage('synergy_companies', MOCK_COMPANIES);
    return true;
};

// Admin - Agents
export const getAgents = async (): Promise<User[]> => {
    await delay(300);
    return MOCK_USERS.filter(u => u.role === UserRole.AGENT);
};

export const createAgent = async (data: Omit<User, 'id' | 'role' | 'avatarUrl'>): Promise<User> => {
    await delay(500);
    const userExists = MOCK_USERS.some(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (userExists) {
        throw new Error("User with this email already exists.");
    }
    const newAgent: User = {
        id: `user_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        role: UserRole.AGENT,
        avatarUrl: `https://picsum.photos/seed/${data.name}/32/32`,
    };
    MOCK_USERS.unshift(newAgent);
    saveToStorage('synergy_users', MOCK_USERS);
    return newAgent;
};