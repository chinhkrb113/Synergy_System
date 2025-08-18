
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';
import { getStudentById, updateStudent } from '../../services/mockApi';
import { Student, StudentStatus } from '../../types';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { ArrowLeft } from 'lucide-react';

const courses = ['Full-Stack Development', 'Data Science', 'UI/UX Design', 'DevOps Engineering'];

function EditStudentPage() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const { t } = useI18n();
    const { toast } = useToast();

    const [student, setStudent] = useState<Student | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: courses[0],
        status: StudentStatus.ACTIVE,
        skills: '',
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        const fetchStudent = async () => {
            if (studentId) {
                setLoading(true);
                const data = await getStudentById(studentId);
                setStudent(data);
                if (data) {
                    setFormData({
                        name: data.name || '',
                        email: data.email || '',
                course: data.course || courses[0],
                status: data.status || StudentStatus.ACTIVE,
                skills: data.skills?.join(', ') || '',
                    });
                }
                setLoading(false);
            }
        };
        fetchStudent();
    }, [studentId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId) return;

        setIsSaving(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
            await updateStudent(studentId, { ...formData, skills: skillsArray });
            toast({
                title: "Success!",
                description: "Student information has been updated.",
                variant: 'success'
            });
            navigate('/learning/students');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update student.",
                variant: 'destructive'
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="space-y-4 p-8"><Skeleton className="h-8 w-64" /><Skeleton className="h-96 w-full" /></div>;
    }

    if (!student) {
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
                        <CardTitle>Edit Student: {student.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
