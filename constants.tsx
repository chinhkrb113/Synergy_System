
import React from 'react';
import { NavItem, UserRole } from './types';
import { LayoutDashboard, Users, GraduationCap, Briefcase, Settings, Building, Group, BarChart3 } from 'lucide-react';

export const USER_ROLES: UserRole[] = Object.values(UserRole);

export const NAV_ITEMS: NavItem[] = [
  { path: '/', labelKey: 'dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.AGENT, UserRole.MENTOR] },
  { path: '/acquisition/leads', labelKey: 'leads', icon: Users, roles: [UserRole.ADMIN, UserRole.AGENT] },
  { path: '/learning/students', labelKey: 'students', icon: GraduationCap, roles: [UserRole.ADMIN, UserRole.MENTOR, UserRole.STUDENT] },
  { path: '/learning/teams', labelKey: 'teams', icon: Group, roles: [UserRole.ADMIN] },
  { path: '/learning/my-teams', labelKey: 'myTeams', icon: Group, roles: [UserRole.STUDENT, UserRole.MENTOR] },
  { path: '/enterprise/jobs', labelKey: 'jobs', icon: Building, roles: [UserRole.ADMIN, UserRole.COMPANY_USER] },
  { path: '/enterprise/jd-parser', labelKey: 'jdParser', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.MENTOR, UserRole.COMPANY_USER] },
  { path: '/ops/dashboard', labelKey: 'opsDashboard', icon: BarChart3, roles: [UserRole.ADMIN] },
  { path: '/ops/settings', labelKey: 'settings', icon: Settings, roles: [UserRole.ADMIN] },
];