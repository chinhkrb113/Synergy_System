import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { Textarea } from '../../components/ui/Textarea';
import { getJobById, updateJob, createJob } from '../../services/mockApi';
import { JobPosting, UserRole } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Select } from '../../components/ui/Select';

const initialFormData = {
    title: '',
    companyName: '',
    description: '',
    status: 'Open' as JobPosting['status'],
};

const jobStatuses: JobPosting['status'][] = ['Open', 'Interviewing', 'Closed'];

function EditJobPage() {
    const { jobId } = useParams<{ jobId: string }>();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { t } = useI18n();
    const { toast } = useToast();
    const { user } = useAuth();

    const isNewMode = !jobId;
    const isViewMode = pathname.endsWith('/view');
    const isCompanyUser = user?.role === UserRole.COMPANY_USER;

    const [job, setJob] = useState<JobPosting | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(!isNewMode);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        if (isNewMode) {
            if (isCompanyUser) {
                setFormData(prev => ({ ...prev, companyName: user.companyName! }));
            }
            setLoading(false);
            return;
        }

        const fetchJob = async () => {
            if (jobId) {
                const data = await getJobById(jobId);
                setJob(data);
                if (data) {
                    setFormData({
                        title: data.title,
                        companyName: data.companyName,
                        description: data.description,
                        status: data.status,
                    });
                }
                setLoading(false);
            }
        };
        fetchJob();
    }, [jobId, isNewMode, isCompanyUser, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isNewMode) {
                const { status, ...createData } = formData;
                await createJob(createData as any);
                toast({ title: "Success!", description: "Job posted successfully.", variant: 'success' });
            } else {
                if (!jobId) return;
                await updateJob(jobId, formData);
                toast({ title: "Success!", description: "Job posting updated.", variant: 'success' });
            }
            navigate('/enterprise/jobs');
        } catch (error) {
            toast({ title: "Error", description: `Failed to ${isNewMode ? 'create' : 'update'} job.`, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="space-y-4 p-8"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>;
    }

    if (!isNewMode && !job) {
        return <div className="p-8">Job posting not found.</div>
    }

    return (
        <div className="space-y-6">
            <Link to="/enterprise/jobs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Job Postings
            </Link>
             <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{isNewMode ? t('postNewJob') : isViewMode ? `${t('view')} Job Posting` : `${t('edit')} Job Posting`}</CardTitle>
                        <CardDescription>
                            {isNewMode ? 'Fill out the details for the new job opening.' : isViewMode ? `Viewing details for "${job?.title}".` : `Update details for "${job?.title}".`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="title">{t('jobTitle')}</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleChange} required disabled={isViewMode} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">{t('company')}</Label>
                                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required disabled={isCompanyUser || isViewMode} />
                            </div>
                        </div>
                        
                         {!isNewMode && (
                            <div className="space-y-2">
                                <Label htmlFor="status">{t('status')}</Label>
                                <Select id="status" name="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                                    {jobStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </Select>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">{t('jobDescription')}</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="min-h-[200px]"
                                disabled={isViewMode}
                            />
                        </div>
                    </CardContent>
                    {!isViewMode && (
                        <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>{t('cancel')}</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Spinner className="mr-2 h-4 w-4" />}
                                {t('save')}
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </form>
        </div>
    );
}

export default EditJobPage;