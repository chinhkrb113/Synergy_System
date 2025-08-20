import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircle, Search, XCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getAgents, deleteUser } from '../../services/mockApi';
import { User } from '../../types';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useToast } from '../../hooks/useToast';
import AgentsTable from './components/AgentsTable';
import { Input } from '../../components/ui/Input';
import { Pagination } from '../../components/Pagination';


type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof User; direction: SortDirection };

function AgentsPage() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [agents, setAgents] = useState<User[] | null>(null);
    const [agentToDelete, setAgentToDelete] = useState<User | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });
    
    // Filters and pagination state
    const [filters, setFilters] = useState({ search: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    

    useEffect(() => {
        const fetchAgents = async () => {
            const data = await getAgents();
            setAgents(data);
        };
        fetchAgents();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters({ search: e.target.value });
        setPage(0);
    };

    const clearFilters = () => {
        setFilters({ search: '' });
        setPage(0);
    };

    const filteredAgents = useMemo(() => {
        if (!agents) return [];
        const searchTerm = filters.search.toLowerCase();

        return agents.filter(agent =>
            agent.name.toLowerCase().includes(searchTerm) ||
            agent.email.toLowerCase().includes(searchTerm)
        );
    }, [agents, filters]);

    const sortedAgents = useMemo(() => {
        const sortableItems = [...filteredAgents];
        sortableItems.sort((a, b) => {
            const valA = a[sortConfig.key] || '';
            const valB = b[sortConfig.key] || '';
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [filteredAgents, sortConfig]);

    const paginatedAgents = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return sortedAgents.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedAgents, page, rowsPerPage]);

    const requestSort = (key: keyof User) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddClick = () => {
        navigate('/admin/agents/new');
    };
    
    const handleViewClick = (agent: User) => {
        navigate(`/admin/agents/${agent.id}/view`);
    };

    const handleEditClick = (agent: User) => {
        navigate(`/admin/agents/${agent.id}/edit`);
    };

    const handleDeleteClick = (agent: User) => {
        setAgentToDelete(agent);
    };

    const confirmDelete = async () => {
        if (agentToDelete) {
            await deleteUser(agentToDelete.id);
            setAgents(prev => prev!.filter(a => a.id !== agentToDelete.id));
            toast({ title: 'Success', description: `Agent "${agentToDelete.name}" deleted.`, variant: 'success' });
            setAgentToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('agents')}</h1>
                    <p className="text-muted-foreground">{t('manageAgents')}</p>
                </div>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('addAgent')}
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="pl-8 w-full"
                    />
                </div>
                <Button variant="ghost" onClick={clearFilters}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <AgentsTable 
                        agents={paginatedAgents} 
                        onView={handleViewClick}
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteClick}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                    />
                </CardContent>
                 <Pagination
                    count={filteredAgents.length}
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
                isOpen={!!agentToDelete}
                onClose={() => setAgentToDelete(null)}
                onConfirm={confirmDelete}
                title={t('areYouSure')}
                description={t('deleteUserWarning', { userName: agentToDelete?.name || '' })}
            />
        </div>
    );
}

export default AgentsPage;