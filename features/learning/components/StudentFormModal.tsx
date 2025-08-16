
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { Student, StudentStatus } from '../../../types';
import { useI18n } from '../../../hooks/useI18n';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Student, 'id' | 'joinDate' | 'avatarUrl' | 'progress'>) => void;
    student: Partial<Student> | null;
}

const courses = ['Full-Stack Development', 'Data Science', 'UI/UX Design', 'DevOps Engineering'];

function StudentFormModal({ isOpen, onClose, onSave, student }: StudentFormModalProps) {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: courses[0],
        status: StudentStatus.ACTIVE,
        skills: '',
    });

    useEffect(() => {
        if (student) {
            setFormData({
                name: student.name || '',
                email: student.email || '',
                course: student.course || courses[0],
                status: student.status || StudentStatus.ACTIVE,
                skills: student.skills?.join(', ') || '',
            });
        } else {
            // Reset for new student
            setFormData({
                name: '',
                email: '',
                course: courses[0],
                status: StudentStatus.ACTIVE,
                skills: '',
            });
        }
    }, [student, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
        onSave({
            name: formData.name,
            email: formData.email,
            course: formData.course,
            status: formData.status,
            skills: skillsArray,
        });
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>{student ? t('editStudent') : t('addStudent')}</DialogTitle>
                </DialogHeader>
                <DialogContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('name')}</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="skills">{t('skills')}</Label>
                        <Input
                            id="skills"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            placeholder={t('skillsPlaceholder')}
                        />
                         <p className="text-xs text-muted-foreground">{t('skillsHelperText')}</p>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="course">{t('course')}</Label>
                            <Select id="course" name="course" value={formData.course} onChange={handleChange}>
                                {courses.map(c => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">{t('status')}</Label>
                            <Select id="status" name="status" value={formData.status} onChange={handleChange}>
                                {Object.values(StudentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </div>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>{t('cancel')}</Button>
                    <Button type="submit">{t('save')}</Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default StudentFormModal;