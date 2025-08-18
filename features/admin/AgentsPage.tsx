import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getAgents, createAgent, updateUser, deleteUser } from '../../services/mockApi';
import { User } from '../../types';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useToast } from '../../hooks/useToast';
import AgentsTable from './components/AgentsTable';
import AgentFormModal from './components/AgentFormModal';

function AgentsPage() {
    const { t } = useI18n();
    const { toast } = useToast();
    const [agents, setAgents] = useState<User[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<User | null>(null);
    const [agentToDelete, setAgentToDelete] = useState<User | null>(null);

    const fetchAgents = async () => {
        const data = await getAgents();
        setAgents(data);
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleAddClick = () => {
        setEditingAgent(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (agent: User) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
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

    const handleSaveAgent = async (data: Omit<User, 'id' | 'role' | 'avatarUrl'>) => {
        try {
            if (editingAgent) {
                // Update
                const updated = await updateUser(editingAgent.id, data);
                setAgents(prev => prev!.map(a => a.id === updated.id ? updated : a));
                toast({ title: 'Success', description: `Agent "${updated.name}" updated.`, variant: 'success' });
            } else {
                // Create
                const newAgent = await createAgent(data);
                setAgents(prev => [newAgent, ...prev!]);
                toast({ title: 'Success', description: `Agent "${newAgent.name}" created.`, variant: 'success' });
            }
            setIsModalOpen(false);
            setEditingAgent(null);
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
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
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <AgentsTable agents={agents} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                </CardContent>
            </Card>

            <AgentFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAgent}
                agent={editingAgent}
            />
            
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
