


import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import LeadsTable from './components/LeadsTable';
import LeadFormModal from './components/LeadFormModal';
import { Download, PlusCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getLeads, createLead, deleteLead } from '../../services/mockApi';
import { Lead, UserRole } from '../../types';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useAuth } from '../../contexts/AuthContext';

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: string; direction: SortDirection };

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((o, k) => (o || {})[k], obj);
};

function LeadsPage(): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [leads, setLeads] = useState<Lead[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });

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
    
    const sortedLeads = useMemo(() => {
        if (!leads) return null;
        const sortableItems = [...leads];
        sortableItems.sort((a, b) => {
            const valA = getNestedValue(a, sortConfig.key);
            const valB = getNestedValue(b, sortConfig.key);
            if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [leads, sortConfig]);

    const requestSort = (key: string) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleEditClick = (lead: Lead) => {
        navigate(`/acquisition/leads/${lead.id}/edit`);
    };

    const handleDeleteClick = (leadId: string) => {
        setLeadToDelete(leadId);
    };

    const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'assignee'> & { assigneeName: string }) => {
        setIsModalOpen(false);
        const newLead = await createLead(leadData);
        setLeads(prevLeads => [newLead, ...prevLeads!]);
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
            
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <LeadsTable leads={sortedLeads} onEdit={handleEditClick} onDelete={handleDeleteClick} requestSort={requestSort} sortConfig={sortConfig} />
                </CardContent>
            </Card>

            <LeadFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLead}
                lead={null}
            />

            <AlertDialog
                isOpen={!!leadToDelete}
                onClose={() => setLeadToDelete(null)}
                onConfirm={confirmDelete}
                title="Are you sure?"
                description="This action cannot be undone. This will permanently delete the lead."
            />
        </div>
    );
}

export default LeadsPage;