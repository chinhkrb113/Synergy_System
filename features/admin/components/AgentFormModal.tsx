import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { User } from '../../../types';
import { useI18n } from '../../../hooks/useI18n';
import { Spinner } from '../../../components/ui/Spinner';

interface AgentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<User, 'id' | 'role' | 'avatarUrl'>) => void;
    agent: User | null;
}

function AgentFormModal({ isOpen, onClose, onSave, agent }: AgentFormModalProps) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (agent) {
                setFormData({ name: agent.name, email: agent.email, phone: agent.phone || '', address: agent.address || '' });
            } else {
                setFormData({ name: '', email: '', phone: '', address: '' });
            }
        }
    }, [agent, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{agent ? t('editAgent') : t('addAgent')}</DialogTitle>
                    <DialogDescription>
                        {agent ? `Update profile for ${agent.name}.` : 'Create a new agent account.'}
                    </DialogDescription>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('name')}</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={!!agent} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">{t('address')}</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleChange} />
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

export default AgentFormModal;
