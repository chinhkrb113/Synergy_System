import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { PlusCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '../../services/mockApi';
import { Company } from '../../types';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useToast } from '../../hooks/useToast';
import CompaniesTable from './components/CompaniesTable';
import CompanyFormModal from './components/CompanyFormModal';

function CompaniesPage() {
    const { t } = useI18n();
    const { toast } = useToast();
    const [companies, setCompanies] = useState<Company[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            const data = await getCompanies();
            setCompanies(data);
        };
        fetchCompanies();
    }, []);

    const handleAddClick = () => {
        setEditingCompany(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (company: Company) => {
        setEditingCompany(company);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (company: Company) => {
        setCompanyToDelete(company);
    };

    const confirmDelete = async () => {
        if (companyToDelete) {
            await deleteCompany(companyToDelete.id);
            setCompanies(prev => prev!.filter(c => c.id !== companyToDelete.id));
            toast({ title: 'Success', description: `Company "${companyToDelete.name}" deleted.`, variant: 'success' });
            setCompanyToDelete(null);
        }
    };

    const handleSaveCompany = async (data: Omit<Company, 'id' | 'createdAt'>) => {
        if (editingCompany) {
            // Update
            const updated = await updateCompany(editingCompany.id, data);
            setCompanies(prev => prev!.map(c => c.id === updated.id ? updated : c));
            toast({ title: 'Success', description: `Company "${updated.name}" updated.`, variant: 'success' });
        } else {
            // Create
            const newCompany = await createCompany(data);
            setCompanies(prev => [newCompany, ...prev!]);
            toast({ title: 'Success', description: `Company "${newCompany.name}" created.`, variant: 'success' });
        }
        setIsModalOpen(false);
        setEditingCompany(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('companies')}</h1>
                    <p className="text-muted-foreground">{t('manageCompanies')}</p>
                </div>
                <Button onClick={handleAddClick}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('addCompany')}
                </Button>
            </div>
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <CompaniesTable companies={companies} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                </CardContent>
            </Card>

            <CompanyFormModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCompany}
                company={editingCompany}
            />
            
            <AlertDialog
                isOpen={!!companyToDelete}
                onClose={() => setCompanyToDelete(null)}
                onConfirm={confirmDelete}
                title={t('areYouSure')}
                description={t('deleteCompanyWarning', { companyName: companyToDelete?.name || '' })}
            />
        </div>
    );
}

export default CompaniesPage;
