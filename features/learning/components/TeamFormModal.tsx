
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Student, Team, TeamStatus } from '../../../types';
import { useI18n } from '../../../hooks/useI18n';
import { suggestTeamMembers } from '../../../services/mockApi';
import { Spinner } from '../../../components/ui/Spinner';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Select } from '../../../components/ui/Select';

interface TeamFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Team, 'id'|'leader'|'members'> & { memberIds: string[], id?: string }) => void;
    team?: Team | null;
}

const teamStatuses: TeamStatus[] = ['Planning', 'In Progress', 'Completed'];

function TeamFormModal({ isOpen, onClose, onSave, team }: TeamFormModalProps) {
    const { t } = useI18n();
    const [teamName, setTeamName] = useState('');
    const [project, setProject] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [status, setStatus] = useState<TeamStatus>('Planning');
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestedMembers, setSuggestedMembers] = useState<Student[]>([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isOpen) {
            if (team) {
                setTeamName(team.name);
                setProject(team.project);
                setProjectDescription(team.projectDescription);
                setStatus(team.status);
                setSelectedMemberIds(new Set(team.members.map(m => m.id)));
                setSuggestedMembers([]); 
            } else {
                setTeamName('');
                setProject('');
                setProjectDescription('');
                setStatus('Planning');
                setSuggestedMembers([]);
                setSelectedMemberIds(new Set());
            }
        }
    }, [team, isOpen]);

    const handleSuggest = async () => {
        if (!projectDescription) return;
        setIsSuggesting(true);
        const members = await suggestTeamMembers(projectDescription);
        setSuggestedMembers(members);
        setIsSuggesting(false);
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
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: team?.id,
            name: teamName,
            project: project,
            projectDescription: projectDescription,
            status: status,
            mentor: 'Mentor Mike', // Hardcoded for now
            memberIds: Array.from(selectedMemberIds),
        });
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{team ? t('editTeam') : t('createTeam')}</DialogTitle>
                    <DialogDescription>{team ? `Editing team: ${team.name}`: t('addNewTeam')}</DialogDescription>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="teamName">{t('teamName')}</Label>
                            <Input id="teamName" value={teamName} onChange={e => setTeamName(e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="project">Project Name</Label>
                            <Input id="project" value={project} onChange={e => setProject(e.target.value)} required />
                        </div>
                    </div>
                     <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" name="status" value={status} onChange={e => setStatus(e.target.value as TeamStatus)}>
                                {teamStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </div>
                    <div className="space-y-2">
                        <Label htmlFor="projectDescription">{t('projectDescription')}</Label>
                        <textarea
                            id="projectDescription"
                            className="w-full h-24 p-2 border rounded-md bg-muted text-sm"
                            placeholder={t('projectDescriptionPlaceholder')}
                            value={projectDescription}
                            onChange={e => setProjectDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <Button type="button" variant="outline" onClick={handleSuggest} disabled={isSuggesting || !projectDescription}>
                            {isSuggesting && <Spinner className="mr-2 h-4 w-4" />}
                            {isSuggesting ? t('suggesting') : t('suggestMembers')}
                        </Button>
                    </div>
                    {(isSuggesting || suggestedMembers.length > 0 || (team && team.members.length > 0)) && (
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm">{t('suggestedMembers')}</h4>
                            <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border p-2">
                                {isSuggesting ? (
                                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                                ) : (
                                    (suggestedMembers.length > 0 ? suggestedMembers : team?.members || []).map(student => (
                                        <div key={student.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted">
                                            <input 
                                                type="checkbox"
                                                id={`student-${student.id}`}
                                                checked={selectedMemberIds.has(student.id)}
                                                onChange={() => handleMemberToggle(student.id)}
                                                className="h-4 w-4"
                                            />
                                            <label htmlFor={`student-${student.id}`} className="flex items-center gap-2 cursor-pointer flex-1">
                                                <img src={student.avatarUrl} alt={student.name} className="h-8 w-8 rounded-full" />
                                                <div>
                                                    <p className="font-medium text-sm">{student.name}</p>
                                                    <p className="text-xs text-muted-foreground">{student.skills.slice(0, 3).join(', ')}</p>
                                                </div>
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
                    <Button type="submit" disabled={!teamName || !project || selectedMemberIds.size === 0}>{t('save')}</Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default TeamFormModal;
