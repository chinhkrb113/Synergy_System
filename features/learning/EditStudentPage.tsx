import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { getStudentById, updateStudent, createStudent } from '../../services/mockApi';
import { Student, StudentStatus } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { ArrowLeft, UserCircle2 } from 'lucide-react';

const courses = ['Full-Stack Development', 'Data Science', 'UI/UX Design', 'DevOps Engineering'];

const initialFormData = {
    name: '',
    email: '',
    course: courses[0],
    status: StudentStatus.ACTIVE,
    skills: '',
    avatarUrl: '',
};


function EditStudentPage() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { toast } = useToast();
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const isNewMode = !studentId;

    const [student, setStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(!isNewMode);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        if (isNewMode) {
            setLoading(false);
            return;
        }

        const fetchStudent = async () => {
            if (studentId) {
                const data = await getStudentById(studentId);
                setStudent(data);
                if (data) {
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                        course: data.course || courses[0],
                        status: data.status || StudentStatus.ACTIVE,
                        skills: data.skills?.join(', ') || '',
                        avatarUrl: data.avatarUrl || '',
                    });
                }
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId, isNewMode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarChangeClick = () => {
        avatarInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            const dataToSave = { ...formData, skills: skillsArray };

            if (isNewMode) {
                await createStudent(dataToSave);
                toast({
                    title: "Success!",
                    description: "Student created successfully.",
                    variant: 'success'
                });
            } else {
                if (!studentId) return;
                await updateStudent(studentId, dataToSave);
                toast({
                    title: "Success!",
                    description: "Student information has been updated.",
                    variant: 'success'
                });
            }
            navigate('/learning/students');
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${isNewMode ? 'create' : 'update'} student.`,
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="space-y-4 p-8"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>;
    }

    if (!isNewMode && !student) {
        return <div className="p-8">Student not found.</div>
    }

    return (
        <div className="space-y-6">
            <Link to="/learning/students" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Students
            </Link>
             <form onSubmit={handleSubmit}>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{isNewMode ? t('addStudent') : `${t('editStudent')}: ${student?.name}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2 pb-4 border-b">
                            <input type="file" ref={avatarInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                            <div className="relative">
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-muted"/>
                                ) : (
                                    <UserCircle2 className="w-24 h-24 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 w-full sm:w-auto">
                                <Button type="button" variant="outline" onClick={handleAvatarChangeClick}>
                                    {t('change')}
                                </Button>
                                <CardDescription className="mt-2 text-xs">
                                    Select an image from your device.
                                </CardDescription>
                            </div>
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </CardContent>
                     <CardFooter className="border-t px-6 py-4 flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>{t('cancel')}</Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving && <Spinner className="mr-2 h-4 w-4" />}
                            {t('save')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default EditStudentPage;