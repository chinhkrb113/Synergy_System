
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import LeadsTable from './components/LeadsTable';
import LeadFormModal from './components/LeadFormModal';
import { Download, PlusCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getLeads, createLead, updateLead, deleteLead } from '../../services/mockApi';
import { Lead } from '../../types';
import { AlertDialog } from '../../components/ui/AlertDialog';

function LeadsPage(): React.ReactNode {
    const { t } = useI18n();
    const [leads, setLeads] = useState<Lead[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);
    const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            const data = await getLeads();
            setLeads(data);
        };
        fetchLeads();
    }, []);

    const handleAddClick = () => {
        setEditingLead(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (lead: Lead) => {
        setEditingLead(lead);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (leadId: string) => {
        setLeadToDelete(leadId);
    };

    const handleSaveLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'assignee'> & { assigneeName: string }) => {
        setIsModalOpen(false);
        if (editingLead && 'id' in editingLead) {
            // Edit existing lead
            const updated = await updateLead(editingLead.id!, leadData);
            if (updated) {
                 setLeads(prevLeads => prevLeads!.map(l => l.id === updated.id ? updated : l));
            }
        } else {
            // Add new lead
            const newLead = await createLead(leadData);
            setLeads(prevLeads => [newLead, ...prevLeads!]);
        }
        setEditingLead(null);
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
                    <h1 className="text-3xl font-bold tracking-tight">{t('allLeads')}</h1>
                    <p className="text-muted-foreground">Manage and track all potential customers.</p>
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
                    <LeadsTable leads={leads} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                </CardContent>
            </Card>

            <LeadFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveLead}
                lead={editingLead}
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