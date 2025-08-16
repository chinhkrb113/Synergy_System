
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { getJobs, createJob } from '../../services/mockApi';
import { JobPosting } from '../../types';
import { PlusCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import JobFormModal from './components/JobFormModal';

const statusColorMap = {
    Open: 'bg-green-500',
    Interviewing: 'bg-blue-500',
    Closed: 'bg-gray-500',
};

function JobsPage(): React.ReactNode {
    const { t } = useI18n();
    const [jobs, setJobs] = useState<JobPosting[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            const data = await getJobs();
            setJobs(data);
        };
        fetchJobs();
    }, []);

    const handleSaveJob = async (jobData: Omit<JobPosting, 'id' | 'postedDate' | 'matchCount' | 'status'>) => {
        const newJob = await createJob(jobData);
        setJobs(prev => prev ? [newJob, ...prev] : [newJob]);
        setIsModalOpen(false);
        // Navigate to matches page immediately after creating a job
        navigate(`/enterprise/jobs/${newJob.id}/matches`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('allJobs')}</h1>
                    <p className="text-muted-foreground">{t('manageJobs')}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('postNewJob')}
                </Button>
            </div>
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Job Title</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Matched</TableHead>
                                <TableHead>Posted Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {jobs ? jobs.map(job => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-semibold">{job.title}</TableCell>
                                    <TableCell>{job.companyName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn("h-2 w-2 rounded-full", statusColorMap[job.status])}></span>
                                            <span>{job.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{job.matchCount} Candidates</TableCell>
                                    <TableCell>{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => navigate(`/enterprise/jobs/${job.id}/matches`)}
                                        >
                                            {t('viewMatches')}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-28 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <JobFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveJob}
            />
        </div>
    );
}

export default JobsPage;
