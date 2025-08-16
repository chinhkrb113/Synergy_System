
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../services/mockApi';
import { Team, TeamStatus } from '../../types';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import TeamFormModal from './components/TeamFormModal';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { AlertDialog } from '../../components/ui/AlertDialog';

const statusColorMap: Record<TeamStatus, string> = {
    'Planning': 'bg-yellow-500',
    'In Progress': 'bg-blue-500',
    'Completed': 'bg-green-500',
};

function TeamsPage(): React.ReactNode {
    const { t } = useI18n();
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

    useEffect(() => {
        const fetchTeams = async () => {
            const data = await getTeams();
            setTeams(data);
        };
        fetchTeams();
    }, []);

    const handleAddClick = () => {
        setEditingTeam(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (team: Team) => {
        setEditingTeam(team);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (team: Team) => {
        setTeamToDelete(team);
    };

    const confirmDelete = async () => {
        if (teamToDelete) {
            await deleteTeam(teamToDelete.id);
            setTeams(prev => prev!.filter(t => t.id !== teamToDelete.id));
            setTeamToDelete(null);
        }
    };

    const handleSaveTeam = async (teamData: Omit<Team, 'id'|'leader'|'members'> & { memberIds: string[], id?: string }) => {
        if (teamData.id) {
            const updated = await updateTeam(teamData.id, teamData);
            setTeams(prev => prev!.map(t => t.id === updated.id ? updated : t));
        } else {
            const newTeam = await createTeam(teamData);
            setTeams(prev => prev ? [newTeam, ...prev] : [newTeam]);
        }
        setIsModalOpen(false);
        setEditingTeam(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('allTeams')}</h1>
                    <p className="text-muted-foreground">{t('manageTeams')}</p>
                </div>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('createTeam')}
                </Button>
            </div>
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Team Name</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Members</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams ? teams.map(team => (
                                <TableRow key={team.id}>
                                    <TableCell className="font-semibold">{team.name}</TableCell>
                                    <TableCell>{team.project}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${statusColorMap[team.status]}`}></span>
                                            <span>{team.status}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            {team.members.slice(0, 5).map((member, index) => (
                                                <img 
                                                    key={member.id} 
                                                    src={member.avatarUrl} 
                                                    alt={member.name} 
                                                    className="h-8 w-8 rounded-full border-2 border-background"
                                                    style={{ marginLeft: index > 0 ? '-10px' : 0, zIndex: team.members.length - index }}
                                                    title={member.name}
                                                />
                                            ))}
                                             {team.members.length > 5 && (
                                                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-semibold" style={{ marginLeft: '-10px', zIndex: 0 }}>
                                                    +{team.members.length - 5}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(team)}>{t('edit')}</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(team)}>{t('delete')}</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <TeamFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTeam}
                team={editingTeam}
            />
            
            <AlertDialog
                isOpen={!!teamToDelete}
                onClose={() => setTeamToDelete(null)}
                onConfirm={confirmDelete}
                title={t('areYouSure')}
                description={t('deleteTeamWarning')}
            />
        </div>
    );
}

export default TeamsPage;
