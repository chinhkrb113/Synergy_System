

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { getLeadById, updateLead } from '../../services/mockApi';
import { Lead, LeadStatus, LeadTier, LeadClassification } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { ArrowLeft } from 'lucide-react';

const assignees = ['Alice', 'Bob', 'Charlie'];

function EditLeadPage() {
    const { leadId } = useParams<{ leadId: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { toast } = useToast();

    const [lead, setLead] = useState<Lead | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: '',
        score: 0,
        status: LeadStatus.NEW,
        tier: LeadTier.COLD,
        assigneeName: 'Alice',
        classification: undefined as LeadClassification | undefined,
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        const fetchLead = async () => {
            if (leadId) {
                setLoading(true);
                const data = await getLeadById(leadId);
                setLead(data);
                if (data) {
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        source: data.source || '',
                        score: data.score || 0,
                        status: data.status || LeadStatus.NEW,
                        tier: data.tier || LeadTier.COLD,
                        assigneeName: data.assignee?.name || 'Alice',
                        classification: data.classification,
                    });
                }
                setLoading(false);
            }
        };
        fetchLead();
    }, [leadId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'score' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadId) return;

        setIsSaving(true);
        try {
            await updateLead(leadId, formData);
            toast({
                title: "Success!",
                description: "Lead information has been updated.",
                variant: 'success'
            });
            navigate('/acquisition/leads');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update lead.",
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="space-y-4 p-8"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>;
    }

    if (!lead) {
        return <div className="p-8">Lead not found.</div>
    }

    return (
        <div className="space-y-6">
            <Link to="/acquisition/leads" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Leads
            </Link>
             <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Edit Lead: {lead.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Input id="source" name="source" value={formData.source} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="score">Score</Label>
                                <Input id="score" name="score" type="number" step="0.1" value={formData.score} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="classification">{t('leadClassification')}</Label>
                            <Select
                                id="classification"
                                name="classification"
                                value={formData.classification || ''}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Classification --</option>
                                {Object.values(LeadClassification).map(c => (
                                    <option key={c} value={c}>
                                        {t(`classification${c.charAt(0)}${c.slice(1).toLowerCase()}`)}
                                    </option>
                                ))}
                            </Select>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                                    {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </Select>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tier">Tier</Label>
                                 <Select id="tier" name="tier" value={formData.tier} onChange={handleChange}>
                                    {Object.values(LeadTier).map(t => <option key={t} value={t}>{t}</option>)}
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="assigneeName">Assignee</Label>
                                 <Select id="assigneeName" name="assigneeName" value={formData.assigneeName} onChange={handleChange}>
                                    {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>{t('cancel')}</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Spinner className="mr-2 h-4 w-4" />}
                            {t('save')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default EditLeadPage;