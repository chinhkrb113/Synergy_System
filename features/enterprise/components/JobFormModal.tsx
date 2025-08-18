
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { JobPosting } from '../../../types';
import { useI18n } from '../../../hooks/useI18n';

interface JobFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<JobPosting, 'id' | 'postedDate' | 'matchCount' | 'status'>) => void;
    isCompanyUser: boolean;
}

function JobFormModal({ isOpen, onClose, onSave, isCompanyUser }: JobFormModalProps) {
    const { t } = useI18n();
    const [title, setTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, companyName, description });
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{t('postNewJob')}</DialogTitle>
                    <DialogDescription>{t('addNewJob')}</DialogDescription>
                </DialogHeader>
                <DialogContent className="space-y-4">
                     <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('jobTitle')}</Label>
                            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                         {!isCompanyUser && (
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name</Label>
                                <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                            </div>
                         )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t('jobDescription')}</Label>
                        <textarea
                            id="description"
                            className="w-full h-32 p-2 border rounded-md bg-muted text-sm"
                            placeholder="Describe the role, responsibilities, and qualifications..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
                    <Button type="submit" disabled={!title || (!isCompanyUser && !companyName) || !description}>{t('save')}</Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default JobFormModal;