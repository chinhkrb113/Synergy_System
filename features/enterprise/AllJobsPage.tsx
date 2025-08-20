

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { getJobs } from '../../services/mockApi';
import { JobPosting } from '../../types';
import { cn } from '../../lib/utils';
import JobDetailsModal from './components/JobDetailsModal';

const statusColorMap = {
    Open: 'bg-green-500',
    Interviewing: 'bg-blue-500',
    Closed: 'bg-gray-500',
};

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof JobPosting; direction: SortDirection };

function AllJobsPage() {
    const { t } = useI18n();
    const [jobs, setJobs] = useState<JobPosting[] | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });

    useEffect(() => {
        const fetchJobs = async () => {
            const data = await getJobs();
            setJobs(data);
        };
        fetchJobs();
    }, []);

    const sortedJobs = useMemo(() => {
        if (!jobs) return null;
        const sortableItems = [...jobs];
        sortableItems.sort((a, b) => {
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
            if (valA < valB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [jobs, sortConfig]);

    const requestSort = (key: keyof JobPosting) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortDirection = (key: keyof JobPosting) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };

    const handleViewDetails = (job: JobPosting) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('allJobsTitle')}</h1>
                <p className="text-muted-foreground">{t('allJobsDesc')}</p>
            </div>
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => requestSort('title')} isSorted={getSortDirection('title')}>{t('jobTitle')}</TableHead>
                                <TableHead onClick={() => requestSort('companyName')} isSorted={getSortDirection('companyName')}>{t('company')}</TableHead>
                                <TableHead onClick={() => requestSort('status')} isSorted={getSortDirection('status')}>{t('status')}</TableHead>
                                <TableHead onClick={() => requestSort('createdAt')} isSorted={getSortDirection('createdAt')}>{t('postedDate')}</TableHead>
                                <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedJobs ? sortedJobs.map(job => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-semibold">{job.title}</TableCell>
                                    <TableCell>{job.companyName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("h-2 w-2 rounded-full", statusColorMap[job.status])}></span>
                                            <span>{job.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(job)}>
                                            {t('viewDetails')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedJob && (
                <JobDetailsModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    job={selectedJob}
                />
            )}
        </div>
    );
}

export default AllJobsPage;
