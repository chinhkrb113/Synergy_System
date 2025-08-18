

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { getTeamById, updateTeam, getStudents } from '../../services/mockApi';
import { Team, TeamStatus, Student } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { ArrowLeft } from 'lucide-react';

const teamStatuses: TeamStatus[] = ['Planning', 'In Progress', 'Completed'];

function EditTeamPage() {
    const { teamId } = useParams<{ teamId: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { toast } = useToast();

    const [team, setTeam] = useState<Team | null>(null);
    const [allStudents, setAllStudents] = useState<Student[] | null>(null);
    const [formData, setFormData] = useState({ name: '', project: '', projectDescription: '', status: 'Planning' as TeamStatus });
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());
    
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            if (teamId) {
                setLoading(true);
                const [teamData, studentsData] = await Promise.all([
                    getTeamById(teamId),
                    getStudents()
                ]);
                
                setTeam(teamData);
                
                if (teamData) {
                    setFormData({
                        name: teamData.name,
                        project: teamData.project,
                        projectDescription: teamData.projectDescription,
                        status: teamData.status,
                    });
                    setSelectedMemberIds(new Set(teamData.members.map(m => m.id)));
                    setAllStudents(studentsData);
                }
                
                setLoading(false);
            }
        };
        fetchData();
    }, [teamId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberToggle = (studentId: string) => {
        setSelectedMemberIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(studentId)) {
                newSet.delete(studentId);
            } else {
                newSet.add(studentId);
            }
            return newSet;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamId || !team) return;

        setIsSaving(true);
        try {
            await updateTeam(teamId, {
                ...team,
                ...formData,
                memberIds: Array.from(selectedMemberIds),
            });
            toast({ title: "Success", description: "Team updated successfully.", variant: 'success' });
            navigate(`/learning/teams/${teamId}`);
        } catch (error) {
            toast({ title: "Error", description: "Failed to update team.", variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="space-y-4 p-8"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>;
    }

    if (!team) {
        return <div className="p-8">Team not found.</div>
    }

    return (
        <div className="space-y-6">
            <Link to={`/learning/teams/${teamId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Team Details
            </Link>
             <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('editTeam')}: {team.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Team Details Form */}
                        <div className="space-y-4 p-4 border rounded-md">
                            <h3 className="font-semibold">Team Details</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('teamName')}</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project">Project Name</Label>
                                    <Input id="project" name="project" value={formData.project} onChange={handleChange} required />
                                </div>
                            </div>
                             <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                                        {teamStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectDescription">{t('projectDescription')}</Label>
                                <textarea
                                    id="projectDescription"
                                    name="projectDescription"
                                    className="w-full h-24 p-2 border rounded-md bg-muted text-sm"
                                    placeholder={t('projectDescriptionPlaceholder')}
                                    value={formData.projectDescription}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Member Management */}
                        <div className="space-y-2 p-4 border rounded-md">
                            <h3 className="font-semibold">{t('manageMembers')}</h3>
                            <CardDescription>Add or remove students from "{team.name}".</CardDescription>
                            <div className="max-h-80 overflow-y-auto space-y-2 rounded-md border p-2 mt-2">
                                {allStudents ? (
                                    allStudents.map(student => (
                                        <div key={student.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                                            <input
                                                type="checkbox"
                                                id={`student-member-${student.id}`}
                                                checked={selectedMemberIds.has(student.id)}
                                                onChange={() => handleMemberToggle(student.id)}
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor={`student-member-${student.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                                                <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-sm">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.course}</p>
                                                </div>
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                                )}
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

export default EditTeamPage;