


import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LeadsTable } from './components/LeadsTable';
import LeadAiAnalysisModal from './components/LeadAiAnalysisModal';
import { Download, PlusCircle, XCircle, Search, ListFilter, Signal, Globe } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getLeads, deleteLead, analyzeLead } from '../../services/mockApi';
import { Lead, UserRole, LeadStatus, LeadTier } from '../../types';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/Pagination';


type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: string; direction: SortDirection };

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
};

function LeadsPage(): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [leads, setLeads] = useState<Lead[] | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [analysisModalLead, setAnalysisModalLead] = useState<Lead | null>(null);

    // New states for filtering and pagination
    const [filters, setFilters] = useState({ search: '', status: '', tier: '', source: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const isAgent = user?.role === UserRole.AGENT;
    const title = isAgent ? t('myLeads') : t('allLeads');
    const description = isAgent ? t('myLeadsDesc') : 'Manage and track all potential customers.';

    useEffect(() => {
        const fetchLeads = async () => {
            const agentName = user?.role === UserRole.AGENT ? user.name : undefined;
            const data = await getLeads(agentName);
            setLeads(data);
        };
        fetchLeads();
    }, [user]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '', tier: '', source: '' });
        setPage(0);
    };

    const sources = useMemo(() => {
        if (!leads) return [];
        return [...new Set(leads.map(lead => lead.source))].sort();
    }, [leads]);
    
    const filteredLeads = useMemo(() => {
        if (!leads) return [];
        const searchTerm = filters.search.toLowerCase();

        return leads.filter(lead => {
            const searchMatch = searchTerm
                ? lead.name.toLowerCase().includes(searchTerm) ||
                  lead.email.toLowerCase().includes(searchTerm) ||
                  (lead.assignee && lead.assignee.name.toLowerCase().includes(searchTerm))
                : true;

            const statusMatch = filters.status ? lead.status === filters.status : true;
            const tierMatch = filters.tier ? lead.tier === filters.tier : true;
            const sourceMatch = filters.source ? lead.source === filters.source : true;
            
            return searchMatch && statusMatch && tierMatch && sourceMatch;
        });
    }, [leads, filters]);

    const sortedLeads = useMemo(() => {
        const sortableItems = [...filteredLeads];
        sortableItems.sort((a, b) => {
            const valA = getNestedValue(a, sortConfig.key);
            const valB = getNestedValue(b, sortConfig.key);
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [filteredLeads, sortConfig]);

    const paginatedLeads = useMemo(() => {
        const startIndex = page * rowsPerPage;
        return sortedLeads.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedLeads, page, rowsPerPage]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddClick = () => {
        navigate('/acquisition/leads/new');
    };

    const handleEditClick = (lead: Lead) => {
        navigate(`/acquisition/leads/${lead.id}/edit`);
    };

    const handleViewClick = (lead: Lead) => {
        navigate(`/acquisition/leads/${lead.id}/view`);
    };

    const handleDeleteClick = (leadId: string) => {
        setLeadToDelete(leadId);
    };
    
    const confirmDelete = async () => {
        if (leadToDelete) {
            const success = await deleteLead(leadToDelete);
            if (success) {
                setLeads(prevLeads => prevLeads!.filter(lead => lead.id !== leadToDelete));
            }
            setLeadToDelete(null);
        }
    };

     const handleAnalyze = async (leadId: string) => {
        setAnalyzingId(leadId);
        try {
            const updatedLead = await analyzeLead(leadId);
            setLeads(prev => prev!.map(l => l.id === leadId ? updatedLead : l));
            setAnalysisModalLead(updatedLead);
            toast({ title: t('leadAnalyzedSuccess'), variant: 'success' });
        } catch (error) {
            toast({ title: t('leadAnalyzedError'), variant: 'destructive' });
        } finally {
            setAnalyzingId(null);
        }
    };

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="text-muted-foreground">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        {t('exportCsv')}
                    </Button>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or assignee..."
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
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                 <div className="relative">
                    <Signal className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select name="tier" value={filters.tier} onChange={handleFilterChange} className="pl-8">
                        <option value="">All Tiers</option>
                        {Object.values(LeadTier).map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                </div>
                 <div className="relative">
                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select name="source" value={filters.source} onChange={handleFilterChange} className="pl-8">
                        <option value="">All Sources</option>
                        {sources.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>
            
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <LeadsTable 
                        leads={paginatedLeads} 
                        onView={handleViewClick}
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteClick} 
                        requestSort={requestSort} 
                        sortConfig={sortConfig}
                        onAnalyze={handleAnalyze}
                        analyzingId={analyzingId}
                        onShowAnalysis={setAnalysisModalLead}
                    />
                </CardContent>
                 <Pagination
                    count={filteredLeads.length}
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
                isOpen={!!leadToDelete}
                onClose={() => setLeadToDelete(null)}
                onConfirm={confirmDelete}
                title="Are you sure?"
                description="This action cannot be undone. This will permanently delete the lead."
            />
            
             {analysisModalLead && (
                <LeadAiAnalysisModal
                    isOpen={!!analysisModalLead}
                    onClose={() => setAnalysisModalLead(null)}
                    lead={analysisModalLead}
                />
            )}
        </div>
    );
}

export default LeadsPage;