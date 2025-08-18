import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Company } from '../../../types';
import { useI18n } from '../../../hooks/useI18n';
import { Spinner } from '../../../components/ui/Spinner';

interface CompanyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Company, 'id' | 'createdAt'>) => void;
    company: Company | null;
}

function CompanyFormModal({ isOpen, onClose, onSave, company }: CompanyFormModalProps) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({ name: '', industry: '', contactEmail: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (company) {
                setFormData({ name: company.name, industry: company.industry, contactEmail: company.contactEmail });
            } else {
                setFormData({ name: '', industry: '', contactEmail: '' });
            }
        }
    }, [company, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate async save
        setTimeout(() => {
            onSave(formData);
            setIsSaving(false);
        }, 500);
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{company ? t('editCompany') : t('addCompany')}</DialogTitle>
                    <DialogDescription>
                        {company ? `Update the details for ${company.name}.` : 'Enter the details for the new company.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('companyName')}</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="industry">{t('industry')}</Label>
                        <Input id="industry" name="industry" value={formData.industry} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactEmail">{t('contactEmail')}</Label>
                        <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} required />
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving && <Spinner className="mr-2 h-4 w-4" />}
                        {t('save')}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default CompanyFormModal;
