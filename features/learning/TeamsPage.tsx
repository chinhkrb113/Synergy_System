
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import { useI18n } from '../../hooks/useI18n';
import { getTeams, createTeam, deleteTeam } from '../../services/mockApi';
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

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: string; direction: SortDirection };

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
};

function TeamsPage(): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        const fetchTeams = async () => {
            const data = await getTeams();
            setTeams(data);
        };
        fetchTeams();
    }, []);

    const sortedTeams = useMemo(() => {
        if (!teams) return null;
        const sortableItems = [...teams];
        sortableItems.sort((a, b) => {
            const valA = sortConfig.key === 'members.length' ? a.members.length : getNestedValue(a, sortConfig.key);
            const valB = sortConfig.key === 'members.length' ? b.members.length : getNestedValue(b, sortConfig.key);
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [teams, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortDirection = (key: string) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleEditClick = (team: Team) => {
        navigate(`/learning/teams/${team.id}/edit`);
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

    const handleSaveTeam = async (teamData: Omit<Team, 'id'|'leader'|'members'> & { memberIds: string[] }) => {
        const newTeam = await createTeam(teamData);
        setTeams(prev => prev ? [newTeam, ...prev] : [newTeam]);
        setIsModalOpen(false);
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
                                <TableHead onClick={() => requestSort('name')} isSorted={getSortDirection('name')}>Team Name</TableHead>
                                <TableHead onClick={() => requestSort('project')} isSorted={getSortDirection('project')}>Project</TableHead>
                                <TableHead onClick={() => requestSort('status')} isSorted={getSortDirection('status')}>Status</TableHead>
                                <TableHead onClick={() => requestSort('members.length')} isSorted={getSortDirection('members.length')}>Members</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedTeams ? sortedTeams.map(team => (
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
                                            <span className="ml-2 text-sm text-muted-foreground">({team.members.length})</span>
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
                team={null}
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