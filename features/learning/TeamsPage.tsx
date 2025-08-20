
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../hooks/useI18n';
import { getTeams, deleteTeam } from '../../services/mockApi';
import { Team, TeamStatus } from '../../types';
import { PlusCircle, Search, ListFilter, XCircle } from 'lucide-react';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { TeamsTable } from './components/TeamsTable';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/Pagination';

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: string; direction: SortDirection };

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
};

const teamStatuses: TeamStatus[] = ['Planning', 'In Progress', 'Completed'];

function TeamsPage(): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [teams, setTeams] = useState<Team[] | null>(null);
    const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });
    
    // Filters and pagination state
    const [filters, setFilters] = useState({ search: '', status: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchTeams = async () => {
            const data = await getTeams();
            setTeams(data);
        };
        fetchTeams();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '' });
        setPage(0);
    };

    const filteredTeams = useMemo(() => {
        if (!teams) return [];
        const searchTerm = filters.search.toLowerCase();

        return teams.filter(team => {
            const searchMatch = searchTerm
                ? team.name.toLowerCase().includes(searchTerm) ||
                  team.project.toLowerCase().includes(searchTerm)
                : true;

            const statusMatch = filters.status ? team.status === filters.status : true;
            
            return searchMatch && statusMatch;
        });
    }, [teams, filters]);

    const sortedTeams = useMemo(() => {
        const sortableItems = [...filteredTeams];
        sortableItems.sort((a, b) => {
            const valA = sortConfig.key === 'members' ? a.members.length : getNestedValue(a, sortConfig.key);
            const valB = sortConfig.key === 'members' ? b.members.length : getNestedValue(b, sortConfig.key);
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [filteredTeams, sortConfig]);

     const paginatedTeams = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return sortedTeams.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedTeams, page, rowsPerPage]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddClick = () => {
        navigate('/learning/teams/new');
    };

    const handleViewClick = (team: Team) => {
        navigate(`/learning/teams/${team.id}`);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or project..."
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
                        {teamStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <TeamsTable 
                        teams={paginatedTeams}
                        onView={handleViewClick}
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteClick} 
                        requestSort={requestSort} 
                        sortConfig={sortConfig}
                    />
                </CardContent>
                 <Pagination
                    count={filteredTeams.length}
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