
import { KpiData, AnomalyAlert, Lead, LeadTier, LeadStatus, Student, StudentStatus, Task, TaskStatus, ParsedJd, MatchingCandidate, User, UserRole, Team, JobPosting, TeamStatus, SkillMap, Interview, TeamTask, UpdateTaskData } from '../types';
import { DollarSign, Users, Activity, Target } from 'lucide-react';
import React from 'react';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Persistence Layer using localStorage ---

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            // A simple way to reset data if needed for demos
            if (new URLSearchParams(window.location.search).has('reset_storage')) {
                 localStorage.removeItem(key);
                 // On first load after reset, save the default value
                 saveToStorage(key, defaultValue);
                 return defaultValue;
            }
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
    }
    // On first load, save the default value
    saveToStorage(key, defaultValue);
    return defaultValue;
};

const saveToStorage = <T>(key: string, value: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage for key "${key}":`, error);
    }
};


// --- Initial Mock Data (Seed Data) ---

const INITIAL_MOCK_USERS: User[] = [
  { id: 'user_admin', email: 'admin@example.com', name: 'Admin User', avatarUrl: 'https://picsum.photos/seed/admin/32/32', role: UserRole.ADMIN },
  { id: 'user_agent', email: 'agent@example.com', name: 'Agent Smith', avatarUrl: 'https://picsum.photos/seed/agent/32/32', role: UserRole.AGENT },
  { id: 'user_mentor', email: 'mentor@example.com', name: 'Mentor Mike', avatarUrl: 'https://picsum.photos/seed/mentor/32/32', role: UserRole.MENTOR, age: 35 },
  { id: 'student_4', email: 'student@example.com', name: 'Emma Williams', avatarUrl: `https://picsum.photos/seed/Emma Williams/32/32`, role: UserRole.STUDENT },
  { id: 'user_company', email: 'company@example.com', name: 'Recruiter Ray', avatarUrl: 'https://picsum.photos/seed/company/32/32', role: UserRole.COMPANY_USER },
];

const INITIAL_MOCK_LEADS: Lead[] = [
    { id: 'lead_1', name: 'John Doe', email: 'john.doe@example.com', source: 'Web', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, score: 95.5, tier: LeadTier.HOT, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_2', name: 'Jane Smith', email: 'jane.smith@example.com', source: 'Facebook', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, score: 82.1, tier: LeadTier.HOT, status: LeadStatus.WORKING, createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_3', name: 'Alex Johnson', email: 'alex.j@example.com', source: 'Referral', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, score: 75.0, tier: LeadTier.WARM, status: LeadStatus.QUALIFIED, createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_4', name: 'Emily Brown', email: 'emily.b@example.com', source: 'Zalo', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, score: 68.3, tier: LeadTier.WARM, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_5', name: 'Chris Williams', email: 'chris.w@example.com', source: 'ShopGPT', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, score: 45.7, tier: LeadTier.COLD, status: LeadStatus.UNQUALIFIED, createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_6', name: 'Katie Davis', email: 'katie.d@example.com', source: 'Web', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, score: 91.2, tier: LeadTier.HOT, status: LeadStatus.ENROLLED, createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_7', name: 'Michael Miller', email: 'michael.m@example.com', source: 'Facebook', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, score: 33.9, tier: LeadTier.COLD, status: LeadStatus.CLOSED, createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_8', name: 'Sarah Wilson', email: 'sarah.w@example.com', source: 'Referral', assignee: { name: 'Bob', avatarUrl: 'https://picsum.photos/seed/bob/32/32' }, score: 78.4, tier: LeadTier.WARM, status: LeadStatus.WORKING, createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_9', name: 'David Taylor', email: 'david.t@example.com', source: 'Web', assignee: { name: 'Alice', avatarUrl: 'https://picsum.photos/seed/alice/32/32' }, score: 62.5, tier: LeadTier.WARM, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'lead_10', name: 'Laura Martinez', email: 'laura.m@example.com', source: 'Zalo', assignee: { name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/charlie/32/32' }, score: 55.0, tier: LeadTier.COLD, status: LeadStatus.NEW, createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
];


let INITIAL_MOCK_STUDENTS: Student[] = [
    { id: 'student_1', name: 'Liam Garcia', email: 'liam.garcia@university.edu', avatarUrl: 'https://picsum.photos/seed/Liam Garcia/32/32', course: 'Full-Stack Development', progress: 85, status: StudentStatus.ACTIVE, joinDate: '2023-09-01T00:00:00.000Z', skills: ['React', 'TypeScript', 'Node.js', 'SQL'], skillMap: { 'React': 90, 'TypeScript': 85, 'Node.js': 88, 'SQL': 75 }, age: 22 },
    { id: 'student_2', name: 'Olivia Miller', email: 'olivia.miller@university.edu', avatarUrl: 'https://picsum.photos/seed/Olivia Miller/32/32', course: 'Full-Stack Development', progress: 92, status: StudentStatus.ACTIVE, joinDate: '2023-09-01T00:00:00.000Z', skills: ['React', 'JavaScript', 'HTML/CSS', 'Agile'], skillMap: { 'React': 95, 'JavaScript': 90, 'HTML/CSS': 92, 'Agile': 80 }, age: 24 },
    { id: 'student_3', name: 'Noah Davis', email: 'noah.davis@university.edu', avatarUrl: 'https://picsum.photos/seed/Noah Davis/32/32', course: 'Data Science', progress: 78, status: StudentStatus.ACTIVE, joinDate: '2023-10-15T00:00:00.000Z', skills: ['Python', 'SQL', 'Docker'], skillMap: { 'Python': 88, 'SQL': 85, 'Docker': 70 }, age: 23 },
    { id: 'student_4', name: 'Emma Williams', email: 'student@example.com', avatarUrl: `https://picsum.photos/seed/Emma Williams/32/32`, course: 'Data Science', progress: 65, status: StudentStatus.ACTIVE, joinDate: '2023-10-15T00:00:00.000Z', skills: ['Python', 'JavaScript', 'NoSQL'], skillMap: { 'Python': 80, 'JavaScript': 70, 'NoSQL': 60 }, age: 21 },
    { id: 'student_5', name: 'Oliver Rodriguez', email: 'oliver.rodriguez@university.edu', avatarUrl: 'https://picsum.photos/seed/Oliver Rodriguez/32/32', course: 'UI/UX Design', progress: 95, status: StudentStatus.ACTIVE, joinDate: '2023-11-01T00:00:00.000Z', skills: ['Figma', 'UX Research', 'Agile'], skillMap: { 'Figma': 92, 'UX Research': 85, 'Agile': 90 }, age: 25 },
    { id: 'student_6', name: 'Ava Martinez', email: 'ava.martinez@university.edu', avatarUrl: 'https://picsum.photos/seed/Ava Martinez/32/32', course: 'UI/UX Design', progress: 45, status: StudentStatus.PAUSED, joinDate: '2023-11-01T00:00:00.000Z', skills: ['Figma'], skillMap: { 'Figma': 65 }, age: 22 },
    { id: 'student_7', name: 'Elijah Hernandez', email: 'elijah.hernandez@university.edu', avatarUrl: 'https://picsum.photos/seed/Elijah Hernandez/32/32', course: 'DevOps Engineering', progress: 100, status: StudentStatus.GRADUATED, joinDate: '2023-05-01T00:00:00.000Z', skills: ['Docker', 'Kubernetes', 'AWS', 'Node.js'], skillMap: { 'Docker': 95, 'Kubernetes': 90, 'AWS': 88, 'Node.js': 80 }, age: 26 },
    { id: 'student_8', name: 'Charlotte Garcia', email: 'charlotte.garcia@university.edu', avatarUrl: 'https://picsum.photos/seed/Charlotte Garcia/32/32', course: 'Full-Stack Development', progress: 30, status: StudentStatus.ACTIVE, joinDate: '2024-02-01T00:00:00.000Z', skills: ['JavaScript', 'HTML/CSS'], skillMap: { 'JavaScript': 60, 'HTML/CSS': 70 }, age: 20 },
    { id: 'student_9', name: 'William Smith', email: 'william.smith@university.edu', avatarUrl: 'https://picsum.photos/seed/William Smith/32/32', course: 'Data Science', progress: 100, status: StudentStatus.GRADUATED, joinDate: '2023-06-01T00:00:00.000Z', skills: ['Python', 'SQL', 'AWS'], skillMap: { 'Python': 95, 'SQL': 92, 'AWS': 85 }, age: 27 },
    { id: 'student_10', name: 'Sophia Jones', email: 'sophia.jones@university.edu', avatarUrl: 'https://picsum.photos/seed/Sophia Jones/32/32', course: 'Full-Stack Development', progress: 15, status: StudentStatus.ACTIVE, joinDate: '2024-03-01T00:00:00.000Z', skills: ['HTML/CSS'], skillMap: { 'HTML/CSS': 50 }, age: 19 },
];


let INITIAL_MOCK_TEAMS: Team[] = [
    { id: 'team_1', name: 'Alpha Coders', mentor: 'Mentor Mike', leader: INITIAL_MOCK_STUDENTS[0], members: INITIAL_MOCK_STUDENTS.slice(0, 3), project: 'CRM Dashboard', projectDescription: 'Building the next-gen CRM with React and TypeScript.', status: 'In Progress' },
    { id: 'team_2', name: 'Data Wizards', mentor: 'Mentor Mike', leader: INITIAL_MOCK_STUDENTS[3], members: [INITIAL_MOCK_STUDENTS[3], INITIAL_MOCK_STUDENTS[8]], project: 'Lead Scoring AI', projectDescription: 'Using Python and Scikit-learn to predict lead quality.', status: 'Planning' },
    { id: 'team_3', name: 'Design Dynamos', mentor: 'Another Mentor', leader: INITIAL_MOCK_STUDENTS[4], members: [INITIAL_MOCK_STUDENTS[4], INITIAL_MOCK_STUDENTS[5]], project: 'Mobile App Redesign', projectDescription: 'A complete UX/UI overhaul for the company mobile app.', status: 'Completed' },
];

INITIAL_MOCK_TEAMS.forEach(team => {
    team.members.forEach(member => {
        const student = INITIAL_MOCK_STUDENTS.find(s => s.id === member.id);
        if(student) student.teamId = team.id;
    });
});

const ALL_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'NoSQL', 'Docker', 'Kubernetes', 'AWS', 'Figma', 'UX Research', 'Agile', 'JavaScript', 'HTML/CSS', 'DDD'];

let MOCK_TASKS: Task[] = Array.from({length: 50}, (_, i) => {
    const titles = [
        'Setup Project Environment', 'Component Design', 'API Integration', 'Unit Testing', 'Final Presentation',
        'Data Cleaning', 'Model Training', 'Feature Engineering', 'Result Visualization'
    ];
    const statuses = [TaskStatus.COMPLETED, TaskStatus.IN_PROGRESS, TaskStatus.PENDING];
    const status = statuses[i % statuses.length];
    const student = INITIAL_MOCK_STUDENTS.find(s => s.id === `student_${ (i % 10) + 1}`);
    return {
        id: `task_${i + 1}`,
        studentId: student!.id,
        teamId: student!.teamId,
        title: titles[i % titles.length],
        status: status,
        dueDate: new Date(Date.now() + (Math.random() - 0.5) * 30 * 24 * 60 * 60 * 1000).toISOString(),
        score: status === TaskStatus.COMPLETED ? Math.floor(Math.random() * 50) + 50 : undefined,
        relatedSkills: ALL_SKILLS.filter(() => Math.random() > 0.8).slice(0, 2),
    }
});


const MOCK_ALERTS: AnomalyAlert[] = [
    {
        id: 'alert_1',
        title: 'Unusual spike in unqualified leads from "ShopGPT"',
        description: 'Lead qualification rate from ShopGPT dropped by 30% in the last 24 hours.',
        severity: 'high',
        timestamp: new Date().toISOString(),
        acknowledged: false,
    },
     {
        id: 'alert_2',
        title: 'Payment gateway API latency increase',
        description: 'P95 latency for payment sessions has increased by 200ms.',
        severity: 'medium',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
    }
];

let INITIAL_MOCK_JOBS: JobPosting[] = [
    { id: 'job_1', title: 'Senior Frontend Engineer', companyName: 'TechCorp', status: 'Open', postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 0, description: 'Seeking a skilled frontend developer with experience in React, TypeScript, and Node.js. Must have strong understanding of modern web principles and design systems.' },
    { id: 'job_2', title: 'Data Scientist', companyName: 'DataDriven Inc.', status: 'Interviewing', postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 0, description: 'Join our data team to build predictive models and drive business insights with Python, SQL, and AWS. Experience with Docker is a plus.' },
    { id: 'job_3', title: 'UX/UI Designer', companyName: 'Creative Solutions', status: 'Open', postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 0, description: 'We are looking for a creative designer to craft beautiful and intuitive user experiences with Figma. A strong portfolio and knowledge of UX Research methodologies is required.' },
    { id: 'job_4', title: 'DevOps Engineer', companyName: 'CloudNine', status: 'Closed', postedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), matchCount: 0, description: 'Manage our cloud infrastructure on AWS using Docker and Kubernetes. Automation and CI/CD experience is essential.' },
];


let MOCK_INTERVIEWS: Interview[] = [];

// --- Live Data Store ---
let MOCK_LEADS = loadFromStorage('mock_leads', INITIAL_MOCK_LEADS);
let MOCK_STUDENTS = loadFromStorage('mock_students', INITIAL_MOCK_STUDENTS);
let MOCK_TEAMS = loadFromStorage('mock_teams', INITIAL_MOCK_TEAMS);
let MOCK_JOBS = loadFromStorage('mock_jobs', INITIAL_MOCK_JOBS);
let MOCK_USERS = loadFromStorage('mock_users', INITIAL_MOCK_USERS);


// --- API Functions ---

export async function loginUser(email: string): Promise<User | null> {
    await delay(500);
    const user = MOCK_USERS.find(u => u.email === email);
    return user || null;
}

export async function getUsers(): Promise<User[]> {
    await delay(500);
    return MOCK_USERS;
}

export async function getUserById(id: string): Promise<User | null> {
    await delay(300);
    return MOCK_USERS.find(u => u.id === id) || null;
}

export async function updateUser(userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User | null> {
    await delay(500);
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    const updatedUser = { ...MOCK_USERS[userIndex], ...userData };
    MOCK_USERS[userIndex] = updatedUser;
    saveToStorage('mock_users', MOCK_USERS);
    
    // If the updated user is also a student, sync their name.
    const student = MOCK_STUDENTS.find(s => s.id === userId);
    if (student && userData.name) {
        student.name = userData.name;
        saveToStorage('mock_students', MOCK_STUDENTS);
    }
    return updatedUser;
}


export async function updateUserRole(userId: string, role: UserRole): Promise<User | null> {
    await delay(500);
    const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    MOCK_USERS[userIndex].role = role;
    saveToStorage('mock_users', MOCK_USERS);
    return MOCK_USERS[userIndex];
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
    await delay(500);
    // In a real app, you'd hash the password and update the database.
    // For this mock, we'll just log it to show it works.
    console.log(`Password for user ${userId} updated to ${newPassword}`);
    return true;
}

export async function getKpiData(t): Promise<KpiData[]> {
    await delay(500);
    return [
        { title: t('totalRevenue'), value: '$45,231.89', change: '+20.1%', changeType: 'increase', icon: React.createElement(DollarSign) },
        { title: t('newLeads'), value: '+2,350', change: '+180.1%', changeType: 'increase', icon: React.createElement(Users) },
        { title: t('conversionRate'), value: '12.5%', change: '-2.4%', changeType: 'decrease', icon: React.createElement(Target) },
        { title: t('activeLearners'), value: '573', change: '+12 since last hour', changeType: 'increase', icon: React.createElement(Activity) },
    ];
}

const predictDropoutRisk = (): AnomalyAlert[] => {
    const riskyStudents = MOCK_STUDENTS.filter(s => s.progress < 20 && s.status === StudentStatus.ACTIVE || s.status === StudentStatus.PAUSED);

    return riskyStudents.map((student, i) => ({
        id: `alert_dropout_${student.id}`,
        title: `Dropout Risk: ${student.name}`,
        description: `Student has low progress (${student.progress}%) and is currently ${student.status}. Consider intervention.`,
        severity: student.status === StudentStatus.PAUSED ? 'high' : 'medium',
        timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
        link: `#/learning/students/${student.id}`
    }));
};

export async function getAnomalyAlerts(): Promise<AnomalyAlert[]> {
    await delay(800);
    const dropoutAlerts = predictDropoutRisk();
    return [...MOCK_ALERTS, ...dropoutAlerts];
}

export function getSalesData() {
    return [
        { name: 'Jan', revenue: 4000, profit: 2400 },
        { name: 'Feb', revenue: 3000, profit: 1398 },
        { name: 'Mar', revenue: 2000, profit: 9800 },
        { name: 'Apr', revenue: 2780, profit: 3908 },
        { name: 'May', revenue: 1890, profit: 4800 },
        { name: 'Jun', revenue: 2390, profit: 3800 },
        { name: 'Jul', revenue: 3490, profit: 4300 },
    ];
}

export function getLeadsBySourceData() {
    return [
        { name: 'Web', value: 400 },
        { name: 'Facebook', value: 300 },
        { name: 'Zalo', value: 200 },
        { name: 'Referral', value: 150 },
    ];
}


export async function getLeads(): Promise<Lead[]> {
    await delay(1000);
    return MOCK_LEADS.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'assignee'> & { assigneeName: string }): Promise<Lead> {
    await delay(500);
    const newLead: Lead = {
        ...leadData,
        id: `lead_${Date.now()}`,
        createdAt: new Date().toISOString(),
        assignee: {
            name: leadData.assigneeName,
            avatarUrl: `https://picsum.photos/seed/${leadData.assigneeName}/32/32`,
        },
    };
    MOCK_LEADS.unshift(newLead);
    saveToStorage('mock_leads', MOCK_LEADS);
    return newLead;
}

export async function updateLead(leadId: string, leadData: Partial<Omit<Lead, 'id' | 'createdAt'>> & { assigneeName?: string }): Promise<Lead | null> {
    await delay(500);
    const leadIndex = MOCK_LEADS.findIndex(l => l.id === leadId);
    if (leadIndex === -1) return null;

    const originalLead = MOCK_LEADS[leadIndex];
    const updatedLead = { ...originalLead, ...leadData };
    if (leadData.assigneeName) {
        updatedLead.assignee = { ...originalLead.assignee, name: leadData.assigneeName };
    }
    
    MOCK_LEADS[leadIndex] = updatedLead;
    saveToStorage('mock_leads', MOCK_LEADS);
    return updatedLead;
}

export async function deleteLead(leadId: string): Promise<boolean> {
    await delay(500);
    const initialLength = MOCK_LEADS.length;
    MOCK_LEADS = MOCK_LEADS.filter(l => l.id !== leadId);
    if (MOCK_LEADS.length < initialLength) {
        saveToStorage('mock_leads', MOCK_LEADS);
        return true;
    }
    return false;
}

export async function getStudents(): Promise<Student[]> {
    await delay(1000);
    return MOCK_STUDENTS.sort((a,b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime());
}

export async function createStudent(studentData: Omit<Student, 'id' | 'joinDate' | 'avatarUrl' | 'progress'>): Promise<Student> {
    await delay(500);
    const newStudent: Student = {
        ...studentData,
        id: `student_${Date.now()}`,
        joinDate: new Date().toISOString(),
        avatarUrl: `https://picsum.photos/seed/${studentData.name}/32/32`,
        progress: 0,
    };
    MOCK_STUDENTS.unshift(newStudent);
    saveToStorage('mock_students', MOCK_STUDENTS);

    // Also create a user account for the new student
    const existingUser = MOCK_USERS.find(u => u.email === newStudent.email);
    if (!existingUser) {
        const newUser: User = {
            id: newStudent.id, // Use student id for user id for consistency
            email: newStudent.email,
            name: newStudent.name,
            avatarUrl: newStudent.avatarUrl,
            role: UserRole.STUDENT,
        };
        MOCK_USERS.push(newUser);
        saveToStorage('mock_users', MOCK_USERS);
    }

    return newStudent;
}

export async function updateStudent(studentId: string, studentData: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
    await delay(500);
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return null;

    const updatedStudent = { ...MOCK_STUDENTS[studentIndex], ...studentData };
    MOCK_STUDENTS[studentIndex] = updatedStudent;
    saveToStorage('mock_students', MOCK_STUDENTS);
    
    // Also update the corresponding user's name if it changed
    const user = MOCK_USERS.find(u => u.id === studentId);
    if (user && studentData.name) {
        user.name = studentData.name;
        saveToStorage('mock_users', MOCK_USERS);
    }

    return updatedStudent;
}

export async function deleteStudent(studentId: string): Promise<boolean> {
    await delay(500);
    const studentIndex = MOCK_STUDENTS.findIndex(s => s.id === studentId);
    if (studentIndex === -1) return false;

    const studentToDelete = MOCK_STUDENTS[studentIndex];
    MOCK_STUDENTS.splice(studentIndex, 1);
    saveToStorage('mock_students', MOCK_STUDENTS);
    
    // Also delete the corresponding user account
    if (studentToDelete) {
        MOCK_USERS = MOCK_USERS.filter(u => u.email !== studentToDelete.email);
        saveToStorage('mock_users', MOCK_USERS);
    }

    // Also need to remove student from any teams
    MOCK_TEAMS.forEach(team => {
        team.members = team.members.filter(m => m.id !== studentId);
        if (team.leader && team.leader.id === studentId) {
            // @ts-ignore - leader can be undefined if team becomes empty
            team.leader = team.members[0] || undefined;
        }
    });
    saveToStorage('mock_teams', MOCK_TEAMS);
    return true;
}

export async function getStudentById(id: string): Promise<Student | null> {
    await delay(300);
    return MOCK_STUDENTS.find(s => s.id === id) || null;
}

export async function getTasksForStudent(studentId: string): Promise<Task[]> {
    await delay(700);
    return MOCK_TASKS
        .filter(task => task.studentId === studentId)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function createTask(taskData: Omit<Task, 'id' | 'status'>): Promise<Task> {
    await delay(500);
    const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}`,
        status: TaskStatus.PENDING,
    };
    MOCK_TASKS.unshift(newTask);
    // Note: No persistence for tasks in this mock API, it's fine for demo.
    return newTask;
}

export async function getTasksForTeam(teamId: string): Promise<TeamTask[]> {
    await delay(800);
    const teamTasks = MOCK_TASKS.filter(task => task.teamId === teamId);
    return teamTasks.map(task => {
        const student = MOCK_STUDENTS.find(s => s.id === task.studentId);
        return {
            ...task,
            studentName: student?.name || 'Unknown Student',
            studentAvatarUrl: student?.avatarUrl || '',
        };
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function updateTask(taskId: string, taskData: UpdateTaskData): Promise<Task | null> {
    await delay(500);
    const taskIndex = MOCK_TASKS.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;
    
    MOCK_TASKS[taskIndex] = { ...MOCK_TASKS[taskIndex], ...taskData };
    // Tasks are not persisted in this mock API, so this is an in-memory update.
    return MOCK_TASKS[taskIndex];
}


export async function getStudentSkillMap(studentId: string): Promise<SkillMap> {
    await delay(800);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student) return [];

    const studentTasks = MOCK_TASKS.filter(t => t.studentId === studentId && t.status === TaskStatus.COMPLETED && t.score && t.relatedSkills);
    
    const skillMap = student.skillMap ? {...student.skillMap} : {};

    studentTasks.forEach(task => {
        task.relatedSkills?.forEach(skill => {
            if (!skillMap[skill]) skillMap[skill] = 0;
            skillMap[skill] += (task.score! - 50) / 20; 
            if (skillMap[skill] > 100) skillMap[skill] = 100;
            if (skillMap[skill] < 0) skillMap[skill] = 0;
        });
    });

    return Object.entries(skillMap)
        .map(([skill, score]) => ({ skill, score: Math.round(score) }))
        .sort((a, b) => b.score - a.score);
}

export async function getMatchingStudents(parsedJd: ParsedJd): Promise<MatchingCandidate[]> {
    await delay(1500); 
    const requiredSkills = new Set(parsedJd.skills.map(s => s.toLowerCase()));
    if (requiredSkills.size === 0) return [];

    const candidates: MatchingCandidate[] = MOCK_STUDENTS
        .map(student => {
            const matchingSkills = student.skills.filter(skill => requiredSkills.has(skill.toLowerCase()));
            const matchScore = (matchingSkills.length / requiredSkills.size) * 100;

            if (matchScore > 0) {
                return {
                    ...student,
                    matchScore,
                    matchingSkills,
                };
            }
            return null;
        })
        .filter((candidate): candidate is MatchingCandidate => candidate !== null)
        .sort((a, b) => b.matchScore - a.matchScore);

    return candidates;
}

const hydrateTeam = (team: Team): Team => {
    return {
        ...team,
        leader: MOCK_STUDENTS.find(s => s.id === team.leader?.id) || team.leader,
        members: team.members.map(m => MOCK_STUDENTS.find(s => s.id === m.id) || m),
    };
};

export async function getTeams(): Promise<Team[]> {
    await delay(600);
    return MOCK_TEAMS.map(hydrateTeam);
}

export async function getTeamForStudent(studentId: string): Promise<Team | null> {
    await delay(400);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student || !student.teamId) {
        return null;
    }
    const team = MOCK_TEAMS.find(t => t.id === student.teamId);
    return team ? hydrateTeam(team) : null;
}

export async function getTeamsForStudent(studentId: string): Promise<Team[]> {
    await delay(500);
    const studentTeams = MOCK_TEAMS.filter(team => 
        team.members.some(member => member.id === studentId)
    );
    return studentTeams.map(hydrateTeam);
}

export async function getTeamsForMentor(mentorName: string): Promise<Team[]> {
    await delay(500);
    const mentorTeams = MOCK_TEAMS.filter(team => team.mentor === mentorName);
    return mentorTeams.map(hydrateTeam);
}


export async function getTeamById(teamId: string): Promise<Team | null> {
    await delay(300);
    const team = MOCK_TEAMS.find(t => t.id === teamId);
    return team ? hydrateTeam(team) : null;
}

export async function getJobMatchesForStudent(studentId: string): Promise<JobPosting[]> {
    await delay(1300);
    const student = MOCK_STUDENTS.find(s => s.id === studentId);
    if (!student || !student.skills || student.skills.length === 0) {
        return [];
    }

    const studentSkills = new Set(student.skills.map(s => s.toLowerCase()));
    
    const matchedJobs = MOCK_JOBS.filter(job => {
        if (job.status !== 'Open') return false;
        const jobText = `${job.title.toLowerCase()} ${job.description.toLowerCase()}`;
        for (const skill of studentSkills) {
            if (jobText.includes(skill)) {
                return true;
            }
        }
        return false;
    });

    return matchedJobs.slice(0, 5);
}

export async function suggestTeamMembers(projectDescription: string): Promise<Student[]> {
    await delay(1200);
    const unassignedStudents = MOCK_STUDENTS.filter(s => !s.teamId);
    return unassignedStudents.sort(() => 0.5 - Math.random()).slice(0, 5);
}

export async function createTeam(teamData: Omit<Team, 'id' | 'leader' | 'members'> & { memberIds: string[] }): Promise<Team> {
    await delay(500);
    const { memberIds, ...restOfTeamData } = teamData;
    const members = MOCK_STUDENTS.filter(s => memberIds.includes(s.id));
    const newTeam: Team = {
        ...restOfTeamData,
        id: `team_${Date.now()}`,
        leader: members[0], 
        members: members,
    };
    MOCK_TEAMS.push(newTeam);
    memberIds.forEach(id => {
        const student = MOCK_STUDENTS.find(s => s.id === id);
        if (student) student.teamId = newTeam.id;
    });
    saveToStorage('mock_teams', MOCK_TEAMS);
    saveToStorage('mock_students', MOCK_STUDENTS);
    return newTeam;
}

export async function updateTeam(teamId: string, teamData: Omit<Team, 'id' | 'leader' | 'members'> & { memberIds: string[] }): Promise<Team> {
    await delay(500);
    const teamIndex = MOCK_TEAMS.findIndex(t => t.id === teamId);
    if (teamIndex === -1) throw new Error("Team not found");

    const oldTeam = MOCK_TEAMS[teamIndex];
    const oldMemberIds = new Set(oldTeam.members.map(m => m.id));
    const newMemberIds = new Set(teamData.memberIds);

    oldMemberIds.forEach(id => {
        if (!newMemberIds.has(id)) {
            const student = MOCK_STUDENTS.find(s => s.id === id);
            if (student) student.teamId = undefined;
        }
    });

    newMemberIds.forEach(id => {
        const student = MOCK_STUDENTS.find(s => s.id === id);
        if (student) student.teamId = teamId;
    });

    const members = MOCK_STUDENTS.filter(s => newMemberIds.has(s.id));
    const updatedTeam: Team = {
        ...oldTeam,
        name: teamData.name,
        project: teamData.project,
        projectDescription: teamData.projectDescription,
        status: teamData.status,
        members: members,
        // @ts-ignore
        leader: members[0] || undefined, 
    };

    MOCK_TEAMS[teamIndex] = updatedTeam;
    saveToStorage('mock_teams', MOCK_TEAMS);
    saveToStorage('mock_students', MOCK_STUDENTS);
    return updatedTeam;
}

export async function deleteTeam(teamId: string): Promise<boolean> {
    await delay(500);
    const teamIndex = MOCK_TEAMS.findIndex(t => t.id === teamId);
    if (teamIndex === -1) return false;

    const teamToDelete = MOCK_TEAMS[teamIndex];
    teamToDelete.members.forEach(member => {
        const student = MOCK_STUDENTS.find(s => s.id === member.id);
        if (student) student.teamId = undefined;
    });

    MOCK_TEAMS.splice(teamIndex, 1);
    saveToStorage('mock_teams', MOCK_TEAMS);
    saveToStorage('mock_students', MOCK_STUDENTS);
    return true;
}


export async function getJobs(): Promise<JobPosting[]> {
    await delay(700);
    return MOCK_JOBS;
}

export async function getJobById(id: string): Promise<JobPosting | null> {
    await delay(300);
    return MOCK_JOBS.find(j => j.id === id) || null;
}

export async function createJob(jobData: Omit<JobPosting, 'id' | 'postedDate' | 'matchCount' | 'status'>): Promise<JobPosting> {
    await delay(500);
    const newJob: JobPosting = {
        ...jobData,
        id: `job_${Date.now()}`,
        postedDate: new Date().toISOString(),
        matchCount: 0,
        status: 'Open',
    };
    MOCK_JOBS.unshift(newJob);
    saveToStorage('mock_jobs', MOCK_JOBS);
    return newJob;
}

export async function getEnrollmentData() {
    await delay(900);
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        data.push({
            name: date.toLocaleString('default', { month: 'short' }),
            newStudents: Math.floor(Math.random() * (50 - 20 + 1)) + 20,
        });
    }
    return data;
}

export async function getTeamStatusData() {
    await delay(1100);
    const statusCounts = MOCK_TEAMS.reduce((acc, team) => {
        acc[team.status] = (acc[team.status] || 0) + 1;
        return acc;
    }, {} as Record<TeamStatus, number>);
    return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
}

export async function requestInterview(jobId: string, candidateId: string, companyName: string): Promise<Interview> {
    await delay(1000);
    
    const scheduledTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);

    const newInterview: Interview = {
        id: `interview_${Date.now()}`,
        jobId,
        candidateId,
        companyName,
        scheduledTime: scheduledTime.toISOString(),
    };
    MOCK_INTERVIEWS.push(newInterview);
    console.log("New Interview Scheduled:", newInterview);
    return newInterview;
}