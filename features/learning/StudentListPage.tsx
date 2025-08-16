
import React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { StudentsTable } from './components/StudentsTable';
import StudentFormModal from './components/StudentFormModal';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { Download, PlusCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../services/mockApi';
import { Student } from '../../types';

function StudentListPage(): React.ReactNode {
    const { t } = useI18n();
    const [students, setStudents] = useState<Student[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Partial<Student> | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    const handleAddClick = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (studentId: string) => {
        setStudentToDelete(studentId);
    };

    const handleSaveStudent = async (studentData: Omit<Student, 'id' | 'joinDate' | 'avatarUrl' | 'progress'>) => {
        setIsModalOpen(false);
        if (editingStudent && 'id' in editingStudent) {
            // Edit existing student
            const updated = await updateStudent(editingStudent.id!, studentData);
            if (updated) {
                 setStudents(prevStudents => prevStudents!.map(s => s.id === updated.id ? updated : s));
            }
        } else {
            // Add new student
            const newStudent = await createStudent(studentData);
            setStudents(prevStudents => [newStudent, ...prevStudents!]);
        }
        setEditingStudent(null);
    };

    const confirmDelete = async () => {
        if (studentToDelete) {
            const success = await deleteStudent(studentToDelete);
            if (success) {
                setStudents(prevStudents => prevStudents!.filter(student => student.id !== studentToDelete));
            }
            setStudentToDelete(null);
        }
    };
    
    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('allStudents')}</h1>
                    <p className="text-muted-foreground">Browse, manage, and track all enrolled learners.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        {t('exportCsv')}
                    </Button>
                    <Button onClick={handleAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('addStudent')}
                    </Button>
                </div>
            </div>
            
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <StudentsTable students={students} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                </CardContent>
            </Card>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStudent}
                student={editingStudent}
            />

            <AlertDialog
                isOpen={!!studentToDelete}
                onClose={() => setStudentToDelete(null)}
                onConfirm={confirmDelete}
                title={t('areYouSure')}
                description={t('deleteStudentWarning')}
            />
        </div>
    );
}

export default StudentListPage;