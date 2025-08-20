import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { getLeadById, updateLead, createLead, getAgents } from '../../services/mockApi';
import { Lead, LeadStatus, LeadTier, LeadClassification, User } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { ArrowLeft, UserCircle2 } from 'lucide-react';

const initialFormData = {
    name: '',
    email: '',
    source: '',
    status: LeadStatus.NEW,
    tier: LeadTier.COLD,
    assigneeName: '',
    classification: LeadClassification.STUDENT,
    phone: '',
    dob: '',
    gender: undefined as Lead['gender'],
    contactAddress: '',
    nationalId: '',
    nationalIdPhotoUrl: '',
    idIssueDate: '',
    idIssuePlace: '',
    permanentAddress: '',
    assigneeAvatarUrl: '',
};

function EditLeadPage() {
    const { leadId } = useParams<{ leadId: string }>();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { toast } = useToast();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const isViewMode = pathname.endsWith('/view');
    const isNewMode = pathname.endsWith('/new');

    const [lead, setLead] = useState<Lead | null>(null);
    const [agents, setAgents] = useState<User[]>([]);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const agentData = await getAgents();
            setAgents(agentData);

            if (isNewMode) {
                setLoading(false);
                return;
            }

            if (leadId) {
                const data = await getLeadById(leadId);
                setLead(data);
                if (data) {
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        source: data.source || '',
                        status: data.status || LeadStatus.NEW,
                        tier: data.tier || LeadTier.COLD,
                        assigneeName: data.assignee?.name || '',
                        assigneeAvatarUrl: data.assignee?.avatarUrl || '',
                        classification: data.classification || LeadClassification.STUDENT,
                        phone: data.phone || '',
                        dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                        gender: data.gender || undefined,
                        contactAddress: data.contactAddress || '',
                        nationalId: data.nationalId || '',
                        nationalIdPhotoUrl: data.nationalIdPhotoUrl || '',
                        idIssueDate: data.idIssueDate ? new Date(data.idIssueDate).toISOString().split('T')[0] : '',
                        idIssuePlace: data.idIssuePlace || '',
                        permanentAddress: data.permanentAddress || '',
                    });
                }
                setLoading(false);
            }
        };
        fetchData();
    }, [leadId, isNewMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        if (name === 'assigneeName') {
            const selectedAgent = agents.find(agent => agent.name === value);
            setFormData(prev => ({ 
                ...prev, 
                assigneeName: value,
                assigneeAvatarUrl: selectedAgent ? selectedAgent.avatarUrl : '' 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleAvatarChangeClick = () => {
        if (isViewMode) return;
        avatarInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, assigneeAvatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            if (isNewMode) {
                await createLead(formData);
                 toast({
                    title: "Success!",
                    description: "Lead created successfully.",
                    variant: 'success'
                });
            } else {
                if (!leadId) return;
                await updateLead(leadId, formData);
                toast({
                    title: "Success!",
                    description: "Lead information has been updated.",
                    variant: 'success'
                });
            }
            navigate('/acquisition/leads');
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${isNewMode ? 'create' : 'update'} lead.`,
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="space-y-4 p-8"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>;
    }

    if (!isNewMode && !lead) {
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
                        <CardTitle>
                           {isNewMode ? 'Add New Lead' : isViewMode ? t('information') : `Edit Lead: ${lead?.name}`}
                        </CardTitle>
                        {isNewMode && <CardDescription>Create a new lead account.</CardDescription>}
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-8">
                             {/* --- Personal Information --- */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">{t('personalInformation')}</h3>
                                <div className="flex flex-col sm:flex-row items-center gap-6 pt-2 pb-6 border-b">
                                    <input type="file" ref={avatarInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                                    <div className="relative">
                                        {formData.assigneeAvatarUrl && !isNewMode ? (
                                            <img src={formData.assigneeAvatarUrl} alt="Assignee Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-muted"/>
                                        ) : isNewMode ? (
                                            <UserCircle2 className="w-24 h-24 text-muted-foreground" />
                                        ) : (
                                            <img src={lead?.assignee?.avatarUrl} alt="Assignee Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-muted"/>
                                        )}
                                    </div>
                                    <div className="flex-1 w-full sm:w-auto">
                                        <Button type="button" variant="outline" onClick={handleAvatarChangeClick} disabled={isViewMode}>
                                            {t('change')}
                                        </Button>
                                        <CardDescription className="mt-2 text-xs">
                                            Select an image for the assigned agent.
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{t('fullName')}</Label>
                                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{t('email')}</Label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isViewMode} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">{t('phone')}</Label>
                                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} disabled={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dob">{t('dob')}</Label>
                                        <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} disabled={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">{t('gender')}</Label>
                                        <Select id="gender" name="gender" value={formData.gender || ''} onChange={handleChange} disabled={isViewMode}>
                                            <option value="" disabled>Select Gender</option>
                                            <option value="Male">{t('male')}</option>
                                            <option value="Female">{t('female')}</option>
                                            <option value="Other">{t('other')}</option>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactAddress">{t('contactAddress')}</Label>
                                    <Input id="contactAddress" name="contactAddress" value={formData.contactAddress} onChange={handleChange} disabled={isViewMode} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="permanentAddress">{t('permanentAddress')}</Label>
                                    <Input id="permanentAddress" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} disabled={isViewMode} />
                                </div>
                            </div>
                            
                            {/* --- Identification Information --- */}
                             <div className="space-y-4">
                                <h3 className="text-xl font-semibold">{t('identificationInformation')}</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nationalId">{t('nationalId')}</Label>
                                        <Input id="nationalId" name="nationalId" value={formData.nationalId} onChange={handleChange} disabled={isViewMode} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="idIssueDate">{t('idIssueDate')}</Label>
                                        <Input id="idIssueDate" name="idIssueDate" type="date" value={formData.idIssueDate} onChange={handleChange} disabled={isViewMode} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="idIssuePlace">{t('idIssuePlace')}</Label>
                                    <Input id="idIssuePlace" name="idIssuePlace" value={formData.idIssuePlace} onChange={handleChange} disabled={isViewMode} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nationalIdPhotoUrl">{t('nationalIdPhoto')}</Label>
                                    <div className="flex items-center gap-4">
                                        <Input id="nationalIdPhotoUrl" name="nationalIdPhotoUrl" placeholder="Enter image URL" value={formData.nationalIdPhotoUrl} onChange={handleChange} disabled={isViewMode} />
                                        {formData.nationalIdPhotoUrl && <img src={formData.nationalIdPhotoUrl} alt="ID Preview" className="h-16 rounded-md object-cover"/>}
                                    </div>
                                </div>
                            </div>

                             {/* --- Lead Details --- */}
                            <div className="space-y-4 pt-6 border-t">
                                <h3 className="text-xl font-semibold">Lead Details</h3>
                                 <div className="space-y-2">
                                    <Label htmlFor="source">Source</Label>
                                    <Input id="source" name="source" value={formData.source} onChange={handleChange} disabled={isViewMode} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="classification">{t('leadClassification')}</Label>
                                    <Select id="classification" name="classification" value={formData.classification || ''} onChange={handleChange} disabled={isViewMode}>
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
                                        <Label htmlFor="assigneeName">Assignee</Label>
                                        <Select id="assigneeName" name="assigneeName" value={formData.assigneeName} onChange={handleChange} disabled={isViewMode}>
                                            <option value="">{t('unassigned')}</option>
                                            {agents.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select id="status" name="status" value={formData.status} onChange={handleChange} disabled={isViewMode}>
                                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tier">Tier</Label>
                                        <Select id="tier" name="tier" value={formData.tier} onChange={handleChange} disabled={isViewMode}>
                                            {Object.values(LeadTier).map(t => <option key={t} value={t}>{t}</option>)}
                                        </Select>
                                    </div>
                                </div>
                            </div>
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

export default EditLeadPage;
