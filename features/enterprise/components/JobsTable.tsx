
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JobPosting, UserRole } from '../../../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { FilePenLine, Trash2, Eye } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';

const statusColorMap: Record<JobPosting['status'], string> = {
    Open: 'bg-green-500',
    Interviewing: 'bg-blue-500',
    Closed: 'bg-gray-500',
};

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof JobPosting; direction: SortDirection };

interface JobsTableProps {
    jobs: JobPosting[] | null;
    sortConfig: SortConfig;
    requestSort: (key: keyof JobPosting) => void;
    onView: (job: JobPosting) => void;
    onEdit: (job: JobPosting) => void;
    onDelete: (job: JobPosting) => void;
}

function JobsTable({ jobs, sortConfig, requestSort, onView, onEdit, onDelete }: JobsTableProps) {
    const { t } = useI18n();
    const { user } = useAuth();
    const navigate = useNavigate();

    const getSortDirection = (key: keyof JobPosting) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => requestSort('title')} isSorted={getSortDirection('title')}>Job Title</TableHead>
                    {user?.role !== UserRole.COMPANY_USER && <TableHead onClick={() => requestSort('companyName')} isSorted={getSortDirection('companyName')}>Company</TableHead>}
                    <TableHead onClick={() => requestSort('status')} isSorted={getSortDirection('status')}>Status</TableHead>
                    <TableHead onClick={() => requestSort('matchCount')} isSorted={getSortDirection('matchCount')}>Matched</TableHead>
                    <TableHead onClick={() => requestSort('createdAt')} isSorted={getSortDirection('createdAt')}>{t('created')}</TableHead>
                    <TableHead onClick={() => requestSort('updatedAt')} isSorted={getSortDirection('updatedAt')}>{t('updated')}</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {jobs ? jobs.map(job => (
                    <TableRow key={job.id}>
                        <TableCell className="font-semibold">{job.title}</TableCell>
                        {user?.role !== UserRole.COMPANY_USER && <TableCell>{job.companyName}</TableCell>}
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <span className={cn("h-2 w-2 rounded-full", statusColorMap[job.status])}></span>
                                <span>{job.status}</span>
                            </div>
                        </TableCell>
                        <TableCell>{job.matchCount} Candidates</TableCell>
                        <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-0">
                                 <Button variant="ghost" size="icon" title={t('view')} onClick={() => onView(job)}>
                                    <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title={t('edit')} onClick={() => onEdit(job)}>
                                    <FilePenLine className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title={t('delete')} onClick={() => onDelete(job)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                 <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => navigate(`/enterprise/jobs/${job.id}/matches`)}
                                >
                                    {t('viewMatches')}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                )) : Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        {user?.role !== UserRole.COMPANY_USER && <TableCell><Skeleton className="h-5 w-32" /></TableCell>}
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-40 ml-auto" /></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export default JobsTable;
