

import React from 'react';
import { Lead, LeadTier, LeadStatus, UserRole } from '../../../types';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Eye, FilePenLine, Trash2, Sparkles, BarChart } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';
import { Spinner } from '../../../components/ui/Spinner';

const tierVariantMap: Record<LeadTier, 'hot' | 'warm' | 'cold'> = {
    [LeadTier.HOT]: 'hot',
    [LeadTier.WARM]: 'warm',
    [LeadTier.COLD]: 'cold',
};

const statusColorMap: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: 'bg-blue-500',
    [LeadStatus.WORKING]: 'bg-yellow-500',
    [LeadStatus.QUALIFIED]: 'bg-green-500',
    [LeadStatus.UNQUALIFIED]: 'bg-gray-500',
    [LeadStatus.ENROLLED]: 'bg-purple-500',
    [LeadStatus.CLOSED]: 'bg-red-500',
};

type SortConfig = { key: string; direction: 'ascending' | 'descending' };

interface LeadsTableProps {
    leads: Lead[] | null;
    onView: (lead: Lead) => void;
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    requestSort: (key: string) => void;
    sortConfig: SortConfig;
    onAnalyze: (leadId: string) => void;
    analyzingId: string | null;
    onShowAnalysis: (lead: Lead) => void;
}

export function LeadsTable({ 
    leads, 
    onView, 
    onEdit, 
    onDelete, 
    requestSort, 
    sortConfig, 
    onAnalyze, 
    analyzingId,
    onShowAnalysis
}: LeadsTableProps): React.ReactNode {
    const { t } = useI18n();
    const { user } = useAuth();
    const isAdminOrAgent = user?.role === UserRole.ADMIN || user?.role === UserRole.AGENT;

    const getSortDirection = (key: string) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => requestSort('name')} isSorted={getSortDirection('name')}>{t('name')}</TableHead>
                    <TableHead onClick={() => requestSort('status')} isSorted={getSortDirection('status')}>{t('status')}</TableHead>
                    <TableHead onClick={() => requestSort('tier')} isSorted={getSortDirection('tier')}>{t('tier')}</TableHead>
                    <TableHead onClick={() => requestSort('score')} isSorted={getSortDirection('score')}>{t('score')}</TableHead>
                    <TableHead onClick={() => requestSort('source')} isSorted={getSortDirection('source')}>{t('source')}</TableHead>
                    <TableHead onClick={() => requestSort('assignee.name')} isSorted={getSortDirection('assignee.name')}>{t('assignee')}</TableHead>
                    <TableHead onClick={() => requestSort('createdAt')} isSorted={getSortDirection('createdAt')}>{t('created')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leads ? (
                    leads.map(lead => (
                        <TableRow key={lead.id}>
                            <TableCell>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-muted-foreground">{lead.email}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", statusColorMap[lead.status])}></span>
                                    <span>{lead.status}</span>
                                </div>
                            </TableCell>
                             <TableCell><Badge variant={tierVariantMap[lead.tier]}>{lead.tier}</Badge></TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{lead.score ?? '-'}</span>
                                    {lead.aiAnalysis && (
                                        <button onClick={() => onShowAnalysis(lead)} title="View AI Analysis">
                                            <BarChart className="h-4 w-4 text-purple-400 cursor-pointer" />
                                        </button>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>{lead.source}</TableCell>
                            <TableCell>
                                {lead.assignee ? (
                                    <div className="flex items-center gap-2">
                                        <img src={lead.assignee.avatarUrl} alt={lead.assignee.name} className="h-6 w-6 rounded-full" />
                                        <span>{lead.assignee.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">{t('unassigned')}</span>
                                )}
                            </TableCell>
                            <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-0">
                                    <Button variant="ghost" size="icon" title={t('view')} onClick={() => onView(lead)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title={t('edit')} onClick={() => onEdit(lead)}>
                                        <FilePenLine className="h-4 w-4" />
                                    </Button>
                                    {isAdminOrAgent && (
                                        <Button variant="ghost" size="icon" title={t('analyzeWithAI')} onClick={() => onAnalyze(lead.id)} disabled={analyzingId === lead.id}>
                                            {analyzingId === lead.id ? <Spinner className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title={t('delete')} onClick={() => onDelete(lead.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
