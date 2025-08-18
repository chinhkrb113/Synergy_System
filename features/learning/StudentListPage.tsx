
import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { StudentsTable } from './components/StudentsTable';
import StudentFormModal from './components/StudentFormModal';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { Download, PlusCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getStudents, createStudent, deleteStudent } from '../../services/mockApi';
import { Student } from '../../types';

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof Student; direction: SortDirection };

function StudentListPage(): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'joinDate', direction: 'descending' });

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    const sortedStudents = useMemo(() => {
        if (!students) return null;
        const sortableItems = [...students];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [students, sortConfig]);

    const requestSort = (key: keyof Student) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    const handleEditClick = (student: Student) => {
        navigate(`/learning/students/${student.id}/edit`);
    };

    const handleDeleteClick = (studentId: string) => {
        setStudentToDelete(studentId);
    };

    const handleSaveStudent = async (studentData: Omit<Student, 'id' | 'joinDate' | 'avatarUrl' | 'progress'>) => {
        setIsModalOpen(false);
        const newStudent = await createStudent(studentData);
        setStudents(prevStudents => [newStudent, ...prevStudents!]);
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
                    <StudentsTable students={sortedStudents} onEdit={handleEditClick} onDelete={handleDeleteClick} requestSort={requestSort} sortConfig={sortConfig} />
                </CardContent>
            </Card>

            <StudentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveStudent}
                student={null}
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