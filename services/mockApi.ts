
import { KpiData, AnomalyAlert, Lead, LeadTier, LeadStatus, Student, StudentStatus, Task, TaskStatus, ParsedJd, MatchingCandidate, User, UserRole, Team, JobPosting, TeamStatus, SkillMap, Interview, TeamTask, UpdateTaskData, LeadClassification, Notification, InterviewStatus, Company } from '../types';
import { DollarSign, Users, Activity, Target, Flame } from 'lucide-react';
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

// --- MOCK DATA ---

const INITIAL_MOCK_USERS: User[] = [
  { id: 'user_admin', email: 'admin@example.com', name: 'Admin User', avatarUrl: 'https://picsum.photos/seed/admin/32/32', role: UserRole.ADMIN, contactAddress: '123 Admin Ave', phone: '555-0101', nationalId: '001088001234', createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'user_agent_1', email: 'agent@example.com', name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/agent/32/32', role: UserRole.AGENT, contactAddress: '456 Agent St', phone: '555-0102', nationalId: '001088005678', createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'user_agent_2', email: 'alice@example.com', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32', role: UserRole.AGENT, contactAddress: '789 Agent Blvd', phone: '555-0104', nationalId: '001088001122', createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'user_agent_3', email: 'bob@example.com', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32', role: UserRole.AGENT, contactAddress: '101 Agent Circle', phone: '555-0105', nationalId: '001088003344', createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'user_agent_4', email: 'charlie@example.com', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32', role: UserRole.AGENT, contactAddress: '212 Agent Way', phone: '555-0106', nationalId: '001088005566', createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'user_mentor', email: 'mentor@example.com', name: 'Mentor Mike', avatarUrl: 'https://picsum.photos/seed/mentor/32/32', role: UserRole.MENTOR, dob: '1989-05-20', gender: 'Male', contactAddress: '789 Mentor Blvd', phone: '555-0103', nationalId: '001088009012', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'user_student', email: 'student@example.com', name: 'Student Sam', avatarUrl: 'https://picsum.photos/seed/student/32/32', role: UserRole.STUDENT, dob: '2002-01-10', gender: 'Male', contactAddress: '123 Scholar Rd', phone: '555-0107', nationalId: '001088007788', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
  { id: 'user_company', email: 'company@example.com', name: 'Recruiter Ray', avatarUrl: 'https://picsum.photos/seed/company/32/32', role: UserRole.COMPANY_USER, companyName: 'Innovate Inc.', contactAddress: '456 Corp Plaza', phone: '555-0108', nationalId: '001088009900', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
];
let MOCK_USERS = loadFromStorage<User[]>('MOCK_USERS', INITIAL_MOCK_USERS);

const INITIAL_MOCK_COMPANIES: Company[] = [
  { id: 'comp_1', name: 'Innovate Inc.', industry: 'Technology', contactEmail: 'hr@innovate.com', createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'comp_2', name: 'Data Driven LLC', industry: 'Data Analytics', contactEmail: 'contact@datadriven.com', createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'comp_3', name: 'Creative Solutions', industry: 'Marketing', contactEmail: 'info@creatives.com', createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString() },
];
let MOCK_COMPANIES = loadFromStorage<Company[]>('MOCK_COMPANIES', INITIAL_MOCK_COMPANIES);

const studentSam = { id: 'user_student', name: 'Student Sam', email: 'student@example.com', avatarUrl: 'https://picsum.photos/seed/student/32/32', course: 'Full-Stack Development', progress: 75, status: StudentStatus.ACTIVE, createdAt: new Date('2023-10-01').toISOString(), skills: ['React', 'Node.js', 'SQL', 'Teamwork'], teamIds: ['team_alpha'], skillMap: { 'React': 80, 'Node.js': 70, 'SQL': 60, 'Teamwork': 85 }, score: 85, aiAssessed: true, phone: '555-0107', contactAddress: '123 Scholar Rd' };
const studentJane = { id: 'stud_2', name: 'Jane Doe', email: 'jane.doe@example.com', avatarUrl: 'https://picsum.photos/seed/jane/32/32', course: 'Data Science', progress: 90, status: StudentStatus.ACTIVE, createdAt: new Date('2023-09-15').toISOString(), skills: ['Python', 'Pandas', 'Machine Learning', 'Communication'], teamIds: ['team_alpha'], skillMap: { 'Python': 90, 'Pandas': 85, 'Machine Learning': 75, 'Communication': 95 }, score: 91, aiAssessed: true, phone: '555-0108', contactAddress: '456 Data Dr' };
const studentJohn = { id: 'stud_3', name: 'John Smith', email: 'john.smith@example.com', avatarUrl: 'https://picsum.photos/seed/john/32/32', course: 'UI/UX Design', progress: 50, status: StudentStatus.PAUSED, createdAt: new Date('2023-11-01').toISOString(), skills: ['Figma', 'User Research', 'Prototyping'], teamIds: ['team_beta'], skillMap: { 'Figma': 60, 'User Research': 70, 'Prototyping': 55 }, score: 65, aiAssessed: false, phone: '555-0109', contactAddress: '789 Design Way' };
const INITIAL_MOCK_STUDENTS: Student[] = [studentSam, studentJane, studentJohn];
let MOCK_STUDENTS = loadFromStorage<Student[]>('MOCK_STUDENTS', INITIAL_MOCK_STUDENTS);

const INITIAL_MOCK_LEADS: Lead[] = [
    { id: 'lead_1', name: 'Alex Johnson', email: 'alex.j@example.net', source: 'Website', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, tier: LeadTier.HOT, status: LeadStatus.WORKING, score: 92, createdAt: new Date().toISOString(), classification: LeadClassification.STUDENT, aiAnalysis: { score: 0.92, topFeatures: [{ feature: "Visited pricing page 5 times", impact: 'positive'}, { feature: "Works in tech industry", impact: 'positive'}, { feature: "Located in non-target region", impact: 'negative'}]} },
    { id: 'lead_2', name: 'Maria Garcia', email: 'maria.g@example.net', source: 'Referral', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, tier: LeadTier.WARM, status: LeadStatus.NEW, score: 75, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_3', name: 'Unassigned Lead', email: 'unassigned@example.net', source: 'Organic', tier: LeadTier.COLD, status: LeadStatus.NEW, score: 40, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.INTERN },
    { id: 'lead_4', name: 'David Chen', email: 'david.c@example.com', source: 'Paid Ads', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, tier: LeadTier.HOT, status: LeadStatus.QUALIFIED, score: 95, createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.ENTERPRISE },
    { id: 'lead_5', name: 'Emily White', email: 'emily.w@example.com', source: 'Facebook', assignee: { name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/agent/32/32' }, tier: LeadTier.WARM, status: LeadStatus.WORKING, score: 82, createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_6', name: 'Frank Miller', email: 'frank.m@example.com', source: 'Zalo', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, tier: LeadTier.COLD, status: LeadStatus.UNQUALIFIED, score: 35, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.PARTNER },
    { id: 'lead_7', name: 'Grace Lee', email: 'grace.l@example.com', source: 'Website', tier: LeadTier.WARM, status: LeadStatus.NEW, score: 68, createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.UNIVERSITY },
    { id: 'lead_8', name: 'Henry Wilson', email: 'henry.w@example.com', source: 'Referral', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, tier: LeadTier.HOT, status: LeadStatus.ENROLLED, score: 98, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT, updatedAt: new Date().toISOString() },
    { id: 'lead_9', name: 'Isabella Martinez', email: 'isabella.m@example.com', source: 'Organic', assignee: { name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/agent/32/32' }, tier: LeadTier.COLD, status: LeadStatus.CLOSED, score: 20, createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.INTERN },
    { id: 'lead_10', name: 'Jack Taylor', email: 'jack.t@example.com', source: 'Facebook', tier: LeadTier.WARM, status: LeadStatus.NEW, score: 71, createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_11', name: 'Katherine Brown', email: 'katherine.b@example.com', source: 'Website', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, tier: LeadTier.HOT, status: LeadStatus.WORKING, score: 88, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.LECTURER },
    { id: 'lead_12', name: 'Liam Garcia', email: 'liam.g@example.com', source: 'Zalo', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, tier: LeadTier.WARM, status: LeadStatus.QUALIFIED, score: 78, createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT, updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_13', name: 'Mia Rodriguez', email: 'mia.r@example.com', source: 'Paid Ads', tier: LeadTier.COLD, status: LeadStatus.NEW, score: 45, createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.PARTNER },
    { id: 'lead_14', name: 'Noah Hernandez', email: 'noah.h@example.com', source: 'Referral', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, tier: LeadTier.HOT, status: LeadStatus.WORKING, score: 91, createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.ENTERPRISE },
    { id: 'lead_15', name: 'Olivia Lopez', email: 'olivia.l@example.com', source: 'Website', assignee: { name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/agent/32/32' }, tier: LeadTier.WARM, status: LeadStatus.NEW, score: 65, createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_16', name: 'Peter Gonzalez', email: 'peter.g@example.com', source: 'Organic', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, tier: LeadTier.COLD, status: LeadStatus.WORKING, score: 55, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.INTERN, updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_17', name: 'Quinn Perez', email: 'quinn.p@example.com', source: 'Facebook', tier: LeadTier.HOT, status: LeadStatus.NEW, score: 85, createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.UNIVERSITY },
    { id: 'lead_18', name: 'Rachel Scott', email: 'rachel.s@example.com', source: 'Zalo', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, tier: LeadTier.WARM, status: LeadStatus.QUALIFIED, score: 80, createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.STUDENT },
    { id: 'lead_19', name: 'Sophia King', email: 'sophia.k@example.com', source: 'Website', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, tier: LeadTier.HOT, status: LeadStatus.WORKING, score: 93, createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.ENTERPRISE },
    { id: 'lead_20', name: 'Thomas Green', email: 'thomas.g@example.com', source: 'Referral', tier: LeadTier.WARM, status: LeadStatus.NEW, score: 72, createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(), classification: LeadClassification.LECTURER },
];
let MOCK_LEADS = loadFromStorage<Lead[]>('MOCK_LEADS', INITIAL_MOCK_LEADS);

const INITIAL_MOCK_TASKS: Task[] = [
    { id: 'task_1', studentId: 'user_student', teamId: 'team_alpha', title: 'Setup React Frontend', status: TaskStatus.COMPLETED, dueDate: new Date('2024-05-10').toISOString(), score: 95, relatedSkills: ['React'] },
    { id: 'task_2', studentId: 'user_student', teamId: 'team_alpha', title: 'Build API Endpoints', status: TaskStatus.IN_PROGRESS, dueDate: new Date('2024-05-25').toISOString(), score: 80, relatedSkills: ['Node.js'] },
    { id: 'task_3', studentId: 'stud_2', teamId: 'team_alpha', title: 'Data Cleaning Script', status: TaskStatus.COMPLETED, dueDate: new Date('2024-05-12').toISOString() },
];
let MOCK_TASKS = loadFromStorage<Task[]>('MOCK_TASKS', INITIAL_MOCK_TASKS);

const INITIAL_MOCK_TEAMS: Team[] = [
    { id: 'team_alpha', name: 'Alpha Coders', mentor: 'Mentor Mike', leader: studentSam, members: [studentSam, studentJane], project: 'CRM Dashboard', projectDescription: 'Build a new CRM dashboard using React and Node.js.', status: 'In Progress', createdAt: new Date('2024-04-01').toISOString() },
    { id: 'team_beta', name: 'Beta Builders', mentor: 'Mentor Mike', leader: studentJohn, members: [studentJohn], project: 'E-commerce Website', projectDescription: 'Design and prototype a modern e-commerce website.', status: 'Planning', createdAt: new Date('2024-04-15').toISOString() },
];
let MOCK_TEAMS = loadFromStorage<Team[]>('MOCK_TEAMS', INITIAL_MOCK_TEAMS);

const INITIAL_MOCK_JOBS: JobPosting[] = [
    { id: 'job_1', title: 'Senior Frontend Developer', companyName: 'Innovate Inc.', status: 'Open', createdAt: new Date('2024-05-01').toISOString(), updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 5, description: 'Looking for an experienced React developer to join our team.' },
    { id: 'job_2', title: 'Data Scientist', companyName: 'Data Driven LLC', status: 'Interviewing', createdAt: new Date('2024-04-20').toISOString(), matchCount: 2, description: 'Seeking a data scientist with expertise in machine learning and Python.' },
];
let MOCK_JOBS = loadFromStorage<JobPosting[]>('MOCK_JOBS', INITIAL_MOCK_JOBS);

const INITIAL_MOCK_INTERVIEWS: Interview[] = [
    { id: 'int_1', jobId: 'job_1', jobTitle: 'Senior Frontend Developer', candidateId: 'user_student', candidateName: 'Student Sam', companyName: 'Innovate Inc.', scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), location: 'Online via Meet', status: InterviewStatus.PENDING, interviewer: 'Recruiter Ray' },
    { id: 'int_2', jobId: 'job_2', jobTitle: 'Data Scientist', candidateId: 'stud_2', candidateName: 'Jane Doe', companyName: 'Data Driven LLC', scheduledTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), location: 'Company HQ', status: InterviewStatus.ACCEPTED, interviewer: 'Dr. Evelyn Reed' },
    { id: 'int_3', jobId: 'job_1', jobTitle: 'Senior Frontend Developer', candidateId: 'stud_3', candidateName: 'John Smith', companyName: 'Innovate Inc.', scheduledTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), location: 'Online via Meet', status: InterviewStatus.DECLINED, interviewer: 'Recruiter Ray', declineReason: 'Nhà có việc' },
];
let MOCK_INTERVIEWS = loadFromStorage<Interview[]>('MOCK_INTERVIEWS', INITIAL_MOCK_INTERVIEWS);

const INITIAL_MOCK_NOTIFICATIONS: Notification[] = [
    { id: 'notif_1', userId: 'user_student', titleKey: 'interviewRequestTitle', messageKey: 'interviewRequestMessage', messageParams: { companyName: 'Innovate Inc.', jobTitle: 'Senior Frontend Developer'}, timestamp: new Date().toISOString(), isRead: false, interviewId: 'int_1' },
];
let MOCK_NOTIFICATIONS = loadFromStorage<Notification[]>('MOCK_NOTIFICATIONS', INITIAL_MOCK_NOTIFICATIONS);

// --- API Functions ---

// Dashboard
export const getKpiData = async (t): Promise<KpiData[]> => {
    await delay(500);
    return [
        { title: t('totalRevenue'), value: '$45,231.89', change: '+20.1%', changeType: 'increase', icon: React.createElement(DollarSign, {className: "h-4 w-4"}) },
        { title: t('hotLeads'), value: '25', change: '+18.7%', changeType: 'increase', icon: React.createElement(Flame, {className: "h-4 w-4"}) },
        { title: t('conversionRate'), value: '12.5%', change: '-2.3%', changeType: 'decrease', icon: React.createElement(Target, {className: "h-4 w-4"}) },
        { title: t('activeLearners'), value: '1,234', change: '+5.2%', changeType: 'increase', icon: React.createElement(Users, {className: "h-4 w-4"}) },
    ];
};

export const getAnomalyAlerts = async (): Promise<AnomalyAlert[]> => {
    await delay(800);
    return [
      { id: 'alert1', title: 'Unusual Spike in Unqualified Leads', description: 'Lead disqualification rate increased by 35% in the last 24 hours from "Organic" source.', severity: 'high', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false, link: "/acquisition/leads" },
      { id: 'alert2', title: 'Student Drop-off Rate Increase', description: 'Student drop-off in "Data Science" course is up 15% week-over-week.', severity: 'medium', timestamp: new Date(Date.now() - 86400000).toISOString(), acknowledged: false, link: "/learning/students" },
    ];
};

export const getSalesData = () => ([
    { name: 'Jan', revenue: 4000, profit: 2400 }, { name: 'Feb', revenue: 3000, profit: 1398 },
    { name: 'Mar', revenue: 5000, profit: 9800 }, { name: 'Apr', revenue: 2780, profit: 3908 },
    { name: 'May', revenue: 1890, profit: 4800 }, { name: 'Jun', revenue: 2390, profit: 3800 },
]);

export const getLeadsBySourceData = () => ([
    { name: 'Website', value: 400 }, { name: 'Referral', value: 300 },
    { name: 'Organic', value: 200 }, { name: 'Paid Ads', value: 278 },
]);

// Leads
export const getLeads = async (agentName?: string): Promise<Lead[]> => {
    await delay(300);
    if (agentName) {
        return MOCK_LEADS.filter(lead => lead.assignee?.name === agentName);
    }
    return [...MOCK_LEADS];
};
export const getLeadById = async (leadId: string): Promise<Lead | null> => {
    await delay(100);
    return MOCK_LEADS.find(l => l.id === leadId) || null;
}
export const createLead = async (data: any): Promise<Lead> => {
    await delay(500);
    const assigneeUser = MOCK_USERS.find(u => u.name === data.assigneeName);
    const newLead: Lead = {
        id: `lead_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        source: data.source,
        tier: data.tier,
        status: data.status,
        classification: data.classification,
        assignee: assigneeUser ? { name: assigneeUser.name, avatarUrl: assigneeUser.avatarUrl } : undefined,
        createdAt: new Date().toISOString(),
        dob: data.dob,
        gender: data.gender,
        contactAddress: data.contactAddress,
        permanentAddress: data.permanentAddress,
        nationalId: data.nationalId,
        nationalIdPhotoUrl: data.nationalIdPhotoUrl,
        idIssueDate: data.idIssueDate,
        idIssuePlace: data.idIssuePlace,
    };
    MOCK_LEADS.unshift(newLead);
    saveToStorage('MOCK_LEADS', MOCK_LEADS);
    return newLead;
};
export const updateLead = async (leadId: string, updates: any): Promise<Lead | null> => {
    await delay(300);
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === leadId);
    if(leadIndex === -1) return null;

    let assigneeUser = MOCK_USERS.find(u => u.role === UserRole.AGENT && u.name === updates.assigneeName);

    // Sync assignee avatar change back to the user object if it was changed in the form
    if (assigneeUser && updates.assigneeAvatarUrl && updates.assigneeAvatarUrl !== assigneeUser.avatarUrl) {
        const userIndex = MOCK_USERS.findIndex(u => u.id === assigneeUser!.id);
        if (userIndex !== -1) {
            MOCK_USERS[userIndex].avatarUrl = updates.assigneeAvatarUrl;
            saveToStorage('MOCK_USERS', MOCK_USERS);
            // Refresh local variable
            assigneeUser = MOCK_USERS[userIndex];
        }
    }

    const updatedLead = { 
        ...MOCK_LEADS[leadIndex],
        ...updates,
        assignee: assigneeUser ? { name: assigneeUser.name, avatarUrl: assigneeUser.avatarUrl } : undefined,
        updatedAt: new Date().toISOString(),
     };
    MOCK_LEADS[leadIndex] = updatedLead;
    saveToStorage('MOCK_LEADS', MOCK_LEADS);
    return updatedLead;
};
export const deleteLead = async (leadId: string): Promise<boolean> => {
    await delay(300);
    const initialLength = MOCK_LEADS.length;
    MOCK_LEADS = MOCK_LEADS.filter(l => l.id !== leadId);
    saveToStorage('MOCK_LEADS', MOCK_LEADS);
    return MOCK_LEADS.length < initialLength;
};
export const analyzeLead = async (leadId: string): Promise<Lead> => {
    await delay(1500);
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === leadId);
    if (leadIndex === -1) throw new Error("Lead not found");
    
    MOCK_LEADS[leadIndex].aiAnalysis = {
        score: Math.random(),
        topFeatures: [
            { feature: "Frequent website visits", impact: 'positive'},
            { feature: "Downloaded brochure", impact: 'positive'},
            { feature: "Short time on site", impact: 'negative'},
        ]
    };
    saveToStorage('MOCK_LEADS', MOCK_LEADS);
    return MOCK_LEADS[leadIndex];
};
export const getUnassignedLeads = async (): Promise<Lead[]> => {
    await delay(300);
    return MOCK_LEADS.filter(l => !l.assignee);
};
export const claimLead = async (leadId: string, user: User): Promise<Lead> => {
    await delay(500);
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === leadId);
    if (leadIndex === -1) throw new Error("Lead not found");

    MOCK_LEADS[leadIndex].assignee = { name: user.name, avatarUrl: user.avatarUrl };
    MOCK_LEADS[leadIndex].status = LeadStatus.WORKING;
    saveToStorage('MOCK_LEADS', MOCK_LEADS);
    return MOCK_LEADS[leadIndex];
};


// Students
export const getStudents = async (): Promise<Student[]> => {
    await delay(300);
    return [...MOCK_STUDENTS];
};
export const getStudentById = async (studentId: string): Promise<Student | null> => {
    await delay(100);
    if (MOCK_USERS.find(u => u.id === studentId)) {
        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        return student ? student : { ...studentSam, id: studentId, name: MOCK_USERS.find(u=>u.id === studentId)!.name }; // fallback
    }
    return MOCK_STUDENTS.find(s => s.id === studentId) || null;
};
export const getStudentSkillMap = async (studentId: string): Promise<SkillMap> => {
    await delay(400);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student?.skillMap) return [{skill: 'N/A', score: 0}];
    return Object.entries(student.skillMap).map(([skill, score]) => ({ skill, score }));
};
export const deleteStudent = async (studentId: string): Promise<boolean> => {
    await delay(300);
    const initialLength = MOCK_STUDENTS.length;
    MOCK_STUDENTS = MOCK_STUDENTS.filter(s => s.id !== studentId);
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return MOCK_STUDENTS.length < initialLength;
};
export const analyzeStudentScore = async (studentId: string): Promise<Student> => {
    await delay(1500);
    const studentIndex = MOCK_STUDENTS.findIndex(l => l.id === studentId);
    if (studentIndex === -1) throw new Error("Student not found");
    
    MOCK_STUDENTS[studentIndex].aiAssessed = true;
    MOCK_STUDENTS[studentIndex].score = Math.floor(Math.random() * (98 - 70 + 1)) + 70; // Random score between 70-98
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return MOCK_STUDENTS[studentIndex];
};
export const createStudent = async (data: any): Promise<Student> => {
    await delay(500);
    const newStudent: Student = {
        id: `stud_${Date.now()}`,
        name: data.name,
        email: data.email,
        course: data.course,
        status: data.status,
        skills: data.skills,
        avatarUrl: `https://picsum.photos/seed/${data.name}/32/32`,
        progress: 0,
        createdAt: new Date().toISOString(),
    };
    MOCK_STUDENTS.unshift(newStudent);
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return newStudent;
};
export const updateStudent = async (studentId: string, updates: Partial<Student>): Promise<Student | null> => {
    await delay(300);
    const index = MOCK_STUDENTS.findIndex(s => s.id === studentId);
    if(index === -1) return null;
    const updatedStudent = { ...MOCK_STUDENTS[index], ...updates, updatedAt: new Date().toISOString() };
    MOCK_STUDENTS[index] = updatedStudent;
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return updatedStudent;
};
export const updateStudentSkills = async (studentId: string, skills: { skill: string, score: number }[]): Promise<Student> => {
    await delay(500);
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
    if (studentIndex === -1) throw new Error("Student not found");
    
    const skillMap = skills.reduce((acc, s) => ({ ...acc, [s.skill]: s.score }), {});
    MOCK_STUDENTS[studentIndex].skillMap = skillMap;
    MOCK_STUDENTS[studentIndex].skills = skills.map(s => s.skill);
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return MOCK_STUDENTS[studentIndex];
};

// Tasks
export const getTasksForStudent = async (studentId: string): Promise<Task[]> => {
    await delay(200);
    return MOCK_TASKS.filter(t => t.studentId === studentId);
};
export const getTasksForTeam = async (teamId: string): Promise<TeamTask[]> => {
    await delay(300);
    return MOCK_TASKS
        .filter(t => t.teamId === teamId)
        .map(task => {
            const student = MOCK_STUDENTS.find(s => s.id === task.studentId);
            return {
                ...task,
                studentName: student?.name || 'Unknown',
                studentAvatarUrl: student?.avatarUrl || '',
            }
        });
};
export const createTask = async (data: Partial<Task>): Promise<Task> => {
    await delay(400);
    const newTask: Task = {
        id: `task_${Date.now()}_${Math.random()}`,
        studentId: data.studentId!,
        teamId: data.teamId,
        title: data.title!,
        dueDate: data.dueDate!,
        status: TaskStatus.PENDING,
    };
    MOCK_TASKS.push(newTask);
    saveToStorage('MOCK_TASKS', MOCK_TASKS);
    return newTask;
};
export const updateTask = async (taskId: string, data: UpdateTaskData): Promise<Task> => {
    await delay(200);
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex === -1) throw new Error("Task not found");
    MOCK_TASKS[taskIndex] = { ...MOCK_TASKS[taskIndex], ...data };
    saveToStorage('MOCK_TASKS', MOCK_TASKS);
    return MOCK_TASKS[taskIndex];
};
export const getTeamTaskById = async (taskId: string): Promise<TeamTask | null> => {
    await delay(100);
    const task = MOCK_TASKS.find(t => t.id === taskId);
    if (!task) return null;
    const student = MOCK_STUDENTS.find(s => s.id === task.studentId);
    return {
        ...task,
        studentName: student?.name || 'Unknown',
        studentAvatarUrl: student?.avatarUrl || '',
    };
};

// Teams
export const getTeams = async (): Promise<Team[]> => {
    await delay(300);
    return [...MOCK_TEAMS];
};
export const getTeamById = async (teamId: string): Promise<Team | null> => {
    await delay(100);
    return MOCK_TEAMS.find(t => t.id === teamId) || null;
};
export const deleteTeam = async (teamId: string): Promise<boolean> => {
    await delay(300);
    const team = MOCK_TEAMS.find(t => t.id === teamId);
    if (team) {
        team.members.forEach(member => {
            const student = MOCK_STUDENTS.find(s => s.id === member.id);
            if(student) student.teamIds = student.teamIds?.filter(id => id !== teamId);
        });
    }
    const initialLength = MOCK_TEAMS.length;
    MOCK_TEAMS = MOCK_TEAMS.filter(t => t.id !== teamId);
    saveToStorage('MOCK_TEAMS', MOCK_TEAMS);
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return MOCK_TEAMS.length < initialLength;
};
export const getTeamForStudent = async (studentId: string): Promise<Team | null> => {
    await delay(200);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student || !student.teamIds || student.teamIds.length === 0) return null;
    return MOCK_TEAMS.find(t => t.id === student.teamIds![0]) || null;
};
export const getTeamsForStudent = async (studentId: string): Promise<Team[]> => {
    await delay(200);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student || !student.teamIds) return [];
    return MOCK_TEAMS.filter(t => student.teamIds!.includes(t.id));
};
export const getTeamsForMentor = async (mentorName: string): Promise<Team[]> => {
    await delay(200);
    return MOCK_TEAMS.filter(t => t.mentor === mentorName);
};
export const createTeam = async (data: any): Promise<Team> => {
    await delay(500);
    const members = MOCK_STUDENTS.filter(s => data.memberIds.includes(s.id));
    const newTeam: Team = {
        id: `team_${Date.now()}`,
        name: data.name,
        project: data.project,
        projectDescription: data.projectDescription,
        status: data.status,
        mentor: data.mentor,
        leader: members[0],
        members,
        createdAt: new Date().toISOString(),
    };
    MOCK_TEAMS.push(newTeam);
    data.memberIds.forEach(id => {
        const student = MOCK_STUDENTS.find(s => s.id === id);
        if (student) student.teamIds = [...(student.teamIds || []), newTeam.id];
    });
    saveToStorage('MOCK_TEAMS', MOCK_TEAMS);
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return newTeam;
};
export const updateTeam = async (teamId: string, updates: any): Promise<Team | null> => {
    await delay(300);
    const teamIndex = MOCK_TEAMS.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return null;
    
    const originalMembers = MOCK_TEAMS[teamIndex].members.map(m => m.id);
    const newMembers = MOCK_STUDENTS.filter(s => updates.memberIds.includes(s.id));

    const updatedTeam = { 
        ...MOCK_TEAMS[teamIndex],
        ...updates,
        members: newMembers,
        updatedAt: new Date().toISOString(),
    };
    MOCK_TEAMS[teamIndex] = updatedTeam;

    // Update student team associations
    const removedMemberIds = originalMembers.filter(id => !updates.memberIds.includes(id));
    const addedMemberIds = updates.memberIds.filter(id => !originalMembers.includes(id));

    removedMemberIds.forEach(id => {
        const student = MOCK_STUDENTS.find(s => s.id === id);
        if(student) student.teamIds = student.teamIds?.filter(tid => tid !== teamId);
    });
    addedMemberIds.forEach(id => {
        const student = MOCK_STUDENTS.find(s => s.id === id);
        if(student) student.teamIds = [...(student.teamIds || []), teamId];
    });

    saveToStorage('MOCK_TEAMS', MOCK_TEAMS);
    saveToStorage('MOCK_STUDENTS', MOCK_STUDENTS);
    return updatedTeam;
};

// Enterprise / Jobs
export const getMatchingStudents = async (jd: ParsedJd): Promise<MatchingCandidate[]> => {
    await delay(1500);
    return MOCK_STUDENTS.map(student => {
        const matchingSkills = student.skills.filter(s => jd.skills.includes(s));
        const matchScore = (matchingSkills.length / jd.skills.length) * 100;
        return { ...student, matchScore, matchingSkills };
    }).filter(c => c.matchScore > 30)
      .sort((a,b) => b.matchScore - a.matchScore);
};

export const requestInterview = async (jobId: string, candidateId: string, companyName: string, scheduledTime: string, location: string): Promise<Interview> => {
    await delay(1000);
    const job = MOCK_JOBS.find(j => j.id === jobId);
    const candidate = MOCK_STUDENTS.find(s => s.id === candidateId);
    if(!job || !candidate) throw new Error("Job or Candidate not found");

    const newInterview: Interview = {
        id: `int_${Date.now()}`,
        jobId,
        jobTitle: job.title,
        candidateId,
        candidateName: candidate.name,
        companyName,
        scheduledTime,
        location,
        status: InterviewStatus.PENDING,
        interviewer: MOCK_USERS.find(u => u.role === UserRole.COMPANY_USER && u.companyName === companyName)?.name || "Hiring Manager",
    };
    MOCK_INTERVIEWS.push(newInterview);
    
    // Create notification for student
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
    MOCK_NOTIFICATIONS.push(newNotification);

    saveToStorage('MOCK_INTERVIEWS', MOCK_INTERVIEWS);
    saveToStorage('MOCK_NOTIFICATIONS', MOCK_NOTIFICATIONS);
    return newInterview;
};

export const getJobs = async(companyName?: string): Promise<JobPosting[]> => {
    await delay(300);
    if(companyName) {
        return MOCK_JOBS.filter(j => j.companyName === companyName);
    }
    return [...MOCK_JOBS];
};
export const getJobById = async (jobId: string): Promise<JobPosting | null> => {
    await delay(100);
    return MOCK_JOBS.find(j => j.id === jobId) || null;
};
export const deleteJob = async (jobId: string): Promise<boolean> => {
    await delay(300);
    const initialLength = MOCK_JOBS.length;
    MOCK_JOBS = MOCK_JOBS.filter(j => j.id !== jobId);
    saveToStorage('MOCK_JOBS', MOCK_JOBS);
    return MOCK_JOBS.length < initialLength;
};
export const getJobMatchesForStudent = async (studentId: string): Promise<JobPosting[]> => {
    await delay(500);
    // Dummy logic: return first 2 jobs
    return MOCK_JOBS.slice(0, 2);
};
export const createJob = async (data: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt' | 'matchCount' | 'status'>): Promise<JobPosting> => {
    await delay(500);
    const newJob: JobPosting = {
        id: `job_${Date.now()}`,
        ...data,
        status: 'Open',
        createdAt: new Date().toISOString(),
        matchCount: Math.floor(Math.random() * 10),
    };
    MOCK_JOBS.unshift(newJob);
    saveToStorage('MOCK_JOBS', MOCK_JOBS);
    return newJob;
};
export const updateJob = async (jobId: string, updates: Partial<JobPosting>): Promise<JobPosting | null> => {
    await delay(300);
    const index = MOCK_JOBS.findIndex(j => j.id === jobId);
    if(index === -1) return null;
    const updatedJob = { ...MOCK_JOBS[index], ...updates, updatedAt: new Date().toISOString() };
    MOCK_JOBS[index] = updatedJob;
    saveToStorage('MOCK_JOBS', MOCK_JOBS);
    return updatedJob;
};


// Ops
export const getEnrollmentData = async () => {
    await delay(600);
    return [
        { name: 'Jan', newStudents: 30 }, { name: 'Feb', newStudents: 45 },
        { name: 'Mar', newStudents: 60 }, { name: 'Apr', newStudents: 55 },
        { name: 'May', newStudents: 75 }, { name: 'Jun', newStudents: 90 },
    ];
};
export const getTeamStatusData = async () => {
    await delay(600);
    return [
        { name: 'Planning', value: 3 },
        { name: 'In Progress', value: 8 },
        { name: 'Completed', value: 5 },
    ];
};

// Users
export const getUsers = async (): Promise<User[]> => {
    await delay(200);
    return MOCK_USERS;
};
export const getAgents = async (): Promise<User[]> => {
    await delay(200);
    return MOCK_USERS.filter(u => u.role === UserRole.AGENT);
};
export const getUserById = async (userId: string): Promise<User | null> => {
    await delay(100);
    return MOCK_USERS.find(u => u.id === userId) || null;
};
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
    await delay(300);
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;
    const updatedUser = { ...MOCK_USERS[userIndex], ...updates, updatedAt: new Date().toISOString() };
    MOCK_USERS[userIndex] = updatedUser;
    saveToStorage('MOCK_USERS', MOCK_USERS);
    return updatedUser;
};
export const createUser = async (data: any): Promise<User> => {
    await delay(500);
    if (MOCK_USERS.some(u => u.email === data.email)) {
        throw new Error("User with this email already exists.");
    }
    const newUser: User = {
        id: `user_${Date.now()}`,
        avatarUrl: `https://picsum.photos/seed/${data.name}/32/32`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    MOCK_USERS.push(newUser);
    saveToStorage('MOCK_USERS', MOCK_USERS);
    return newUser;
};
export const createAgent = async (data: any): Promise<User> => {
    return createUser({ ...data, role: UserRole.AGENT });
};
export const loginUser = async (email: string): Promise<User | null> => {
    await delay(500);
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user || null;
};
export const updateUserPassword = async (userId: string, newPass: string): Promise<boolean> => {
    console.log(`Password for user ${userId} changed to ${newPass}`);
    await delay(500);
    return true;
};
export const deleteUser = async (userId: string): Promise<boolean> => {
    await delay(300);
    const initialLength = MOCK_USERS.length;
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== userId);
    saveToStorage('MOCK_USERS', MOCK_USERS);
    return MOCK_USERS.length < initialLength;
};
export const updateUserRole = async (userId: string, role: UserRole): Promise<User | null> => {
     await delay(200);
     const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
     if (userIndex === -1) return null;
     MOCK_USERS[userIndex].role = role;
     MOCK_USERS[userIndex].updatedAt = new Date().toISOString();
     saveToStorage('MOCK_USERS', MOCK_USERS);
     return MOCK_USERS[userIndex];
};

// Companies
export const getCompanies = async (): Promise<Company[]> => {
    await delay(200);
    return [...MOCK_COMPANIES];
}
export const getCompanyById = async (companyId: string): Promise<Company | null> => {
    await delay(100);
    return MOCK_COMPANIES.find(c => c.id === companyId) || null;
}
export const createCompany = async (data: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>): Promise<Company> => {
    await delay(400);
    const newCompany: Company = {
        id: `comp_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
    };
    MOCK_COMPANIES.push(newCompany);
    saveToStorage('MOCK_COMPANIES', MOCK_COMPANIES);
    return newCompany;
};
export const updateCompany = async (companyId: string, updates: Partial<Company>): Promise<Company | null> => {
    await delay(300);
    const index = MOCK_COMPANIES.findIndex(c => c.id === companyId);
    if (index === -1) return null;
    MOCK_COMPANIES[index] = { ...MOCK_COMPANIES[index], ...updates, updatedAt: new Date().toISOString() };
    saveToStorage('MOCK_COMPANIES', MOCK_COMPANIES);
    return MOCK_COMPANIES[index];
};
export const deleteCompany = async (companyId: string): Promise<boolean> => {
    await delay(300);
    const initialLength = MOCK_COMPANIES.length;
    MOCK_COMPANIES = MOCK_COMPANIES.filter(c => c.id !== companyId);
    saveToStorage('MOCK_COMPANIES', MOCK_COMPANIES);
    return MOCK_COMPANIES.length < initialLength;
};

// Notifications
export const getNotifications = async (userId: string): Promise<Notification[]> => {
    await delay(200);
    return MOCK_NOTIFICATIONS.filter(n => n.userId === userId).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
    await delay(50);
    const notif = MOCK_NOTIFICATIONS.find(n => n.id === notificationId);
    if(notif) {
        notif.isRead = true;
        saveToStorage('MOCK_NOTIFICATIONS', MOCK_NOTIFICATIONS);
        return true;
    }
    return false;
};

// Interviews
export const getInterviewById = async (interviewId: string): Promise<Interview | null> => {
    await delay(200);
    return MOCK_INTERVIEWS.find(i => i.id === interviewId) || null;
};
export const respondToInterview = async (interviewId: string, status: InterviewStatus.ACCEPTED | InterviewStatus.DECLINED, reason?: string): Promise<Interview | null> => {
    await delay(500);
    const index = MOCK_INTERVIEWS.findIndex(i => i.id === interviewId);
    if (index === -1) return null;
    MOCK_INTERVIEWS[index].status = status;
    if (status === InterviewStatus.DECLINED) {
        MOCK_INTERVIEWS[index].declineReason = reason;
    }
    saveToStorage('MOCK_INTERVIEWS', MOCK_INTERVIEWS);

    const interview = MOCK_INTERVIEWS[index];
    // Create notification for company user
    const companyUser = MOCK_USERS.find(u => u.role === UserRole.COMPANY_USER && u.companyName === interview.companyName);
    if (companyUser) {
        const newNotification: Notification = {
            id: `notif_${Date.now()}`,
            userId: companyUser.id,
            titleKey: status === InterviewStatus.ACCEPTED ? 'interviewAcceptedTitle' : 'interviewDeclinedTitle',
            messageKey: status === InterviewStatus.ACCEPTED ? 'interviewAcceptedMessage' : 'interviewDeclinedMessage',
            messageParams: { studentName: interview.candidateName, jobTitle: interview.jobTitle },
            timestamp: new Date().toISOString(),
            isRead: false,
            link: '/enterprise/interview-list',
        };
        MOCK_NOTIFICATIONS.push(newNotification);
        saveToStorage('MOCK_NOTIFICATIONS', MOCK_NOTIFICATIONS);
    }
    return MOCK_INTERVIEWS[index];
};
export const updateInterview = async (interviewId: string, updates: Partial<Interview>): Promise<Interview | null> => {
    await delay(300);
    const index = MOCK_INTERVIEWS.findIndex(i => i.id === interviewId);
    if (index === -1) return null;
    MOCK_INTERVIEWS[index] = { ...MOCK_INTERVIEWS[index], ...updates };
    saveToStorage('MOCK_INTERVIEWS', MOCK_INTERVIEWS);
    return MOCK_INTERVIEWS[index];
};
export const getInterviewsForCompany = async (companyName: string): Promise<Interview[]> => {
    await delay(400);
    return MOCK_INTERVIEWS.filter(i => i.companyName === companyName);
};
