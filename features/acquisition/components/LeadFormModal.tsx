


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { Lead, LeadStatus, LeadTier, LeadClassification } from '../../../types';
import { useI18n } from '../../../hooks/useI18n';

interface LeadFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    lead: Partial<Lead> | null;
}

const assignees = ['Alice', 'Bob', 'Charlie'];

function LeadFormModal({ isOpen, onClose, onSave, lead }: LeadFormModalProps) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        source: '',
        score: 0,
        status: LeadStatus.NEW,
        tier: LeadTier.COLD,
        assigneeName: 'Alice',
        classification: LeadClassification.STUDENT,
    });

    useEffect(() => {
        if (lead) {
            setFormData({
                name: lead.name || '',
                email: lead.email || '',
                source: lead.source || '',
                score: lead.score || 0,
                status: lead.status || LeadStatus.NEW,
                tier: lead.tier || LeadTier.COLD,
                assigneeName: lead.assignee?.name || 'Alice',
                classification: lead.classification || LeadClassification.STUDENT,
            });
        } else {
            // Reset for new lead
            setFormData({
                name: '',
                email: '',
                source: '',
                score: 0,
                status: LeadStatus.NEW,
                tier: LeadTier.COLD,
                assigneeName: 'Alice',
                classification: LeadClassification.STUDENT,
            });
        }
    }, [lead, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'score' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{lead ? 'Edit Lead' : 'Add New Lead'}</DialogTitle>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Input id="source" name="source" value={formData.source} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="score">Score</Label>
                            <Input id="score" name="score" type="number" value={formData.score} onChange={handleChange} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="classification">{t('leadClassification')}</Label>
                        <Select id="classification" name="classification" value={formData.classification} onChange={handleChange}>
                            {Object.values(LeadClassification).map(c => <option key={c} value={c}>{t(`classification${c.charAt(0)}${c.slice(1).toLowerCase()}`)}</option>)}
                        </Select>
                    </div>
                     <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                                {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="tier">Tier</Label>
                             <Select id="tier" name="tier" value={formData.tier} onChange={handleChange}>
                                {Object.values(LeadTier).map(t => <option key={t} value={t}>{t}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assigneeName">Assignee</Label>
                             <Select id="assigneeName" name="assigneeName" value={formData.assigneeName} onChange={handleChange}>
                                {assignees.map(a => <option key={a} value={a}>{a}</option>)}
                            </Select>
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default LeadFormModal;