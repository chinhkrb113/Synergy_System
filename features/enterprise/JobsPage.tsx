import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { getJobs, deleteJob } from '../../services/mockApi';
import { JobPosting, UserRole } from '../../types';
import { PlusCircle, Search, ListFilter, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/Pagination';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useToast } from '../../hooks/useToast';
import JobsTable from './components/JobsTable';

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof JobPosting; direction: SortDirection };

const jobStatuses: JobPosting['status'][] = ['Open', 'Interviewing', 'Closed'];

function JobsPage(): React.ReactNode {
    const { t } = useI18n();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [jobs, setJobs] = useState<JobPosting[] | null>(null);
    const [jobToDelete, setJobToDelete] = useState<JobPosting | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });
    
    // Filters and pagination state
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchJobs = async () => {
            const companyName = user?.role === UserRole.COMPANY_USER ? user.companyName : undefined;
            const data = await getJobs(companyName);
            setJobs(data);
        };
        fetchJobs();
    }, [user]);

     const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '' });
        setPage(0);
    };

    const filteredJobs = useMemo(() => {
        if (!jobs) return [];
        const searchTerm = filters.search.toLowerCase();
        return jobs.filter(job => {
            const searchMatch = searchTerm
                ? job.title.toLowerCase().includes(searchTerm) ||
                  (user?.role !== UserRole.COMPANY_USER && job.companyName.toLowerCase().includes(searchTerm))
                : true;
            const statusMatch = filters.status ? job.status === filters.status : true;
            return searchMatch && statusMatch;
        });
    }, [jobs, filters, user]);

    const sortedJobs = useMemo(() => {
        const sortableItems = [...filteredJobs];
        sortableItems.sort((a, b) => {
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [filteredJobs, sortConfig]);

    const paginatedJobs = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return sortedJobs.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedJobs, page, rowsPerPage]);

    const requestSort = (key: keyof JobPosting) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleViewClick = (job: JobPosting) => {
        navigate(`/enterprise/jobs/${job.id}/view`);
    };

    const handleEditClick = (job: JobPosting) => {
        navigate(`/enterprise/jobs/${job.id}/edit`);
    };

    const handleDeleteClick = (job: JobPosting) => {
        setJobToDelete(job);
    };

    const confirmDelete = async () => {
        if (jobToDelete) {
            await deleteJob(jobToDelete.id);
            setJobs(prev => prev!.filter(j => j.id !== jobToDelete.id));
            toast({ title: 'Success', description: `Job posting "${jobToDelete.title}" deleted.`, variant: 'success' });
            setJobToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('allJobs')}</h1>
                    <p className="text-muted-foreground">{t('manageJobs')}</p>
                </div>
                <Button onClick={() => navigate('/enterprise/jobs/new')}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('postNewJob')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or company..."
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="pl-8 w-full"
                    />
                </div>
                <div className="relative">
                    <ListFilter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select name="status" value={filters.status} onChange={handleFilterChange} className="pl-8">
                        <option value="">All Statuses</option>
                        {jobStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardContent className="pt-6">
                   <JobsTable
                        jobs={paginatedJobs}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                        onView={handleViewClick}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                   />
                </CardContent>
                <Pagination
                    count={filteredJobs.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={(value) => {
                        setRowsPerPage(value);
                        setPage(0);
                    }}
                />
            </Card>

            <AlertDialog
                isOpen={!!jobToDelete}
                onClose={() => setJobToDelete(null)}
                onConfirm={confirmDelete}
                title={t('areYouSure')}
                description={`This will permanently delete the job posting: "${jobToDelete?.title}".`}
            />
        </div>
    );
}

export default JobsPage;