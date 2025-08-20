

import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { StudentsTable } from './components/StudentsTable';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { Download, PlusCircle, Search, ListFilter, BookOpen, XCircle } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { getStudents, deleteStudent, analyzeStudentScore } from '../../services/mockApi';
import { Student, StudentStatus } from '../../types';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Pagination } from '../../components/Pagination';

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof Student; direction: SortDirection };

function StudentListPage(): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[] | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'descending' });
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const { toast } = useToast();

    // New states for filtering and pagination
    const [filters, setFilters] = useState({ search: '', status: '', course: '' });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
        setPage(0); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({ search: '', status: '', course: '' });
        setPage(0);
    };

    const courses = useMemo(() => {
        if (!students) return [];
        return [...new Set(students.map(s => s.course))].sort();
    }, [students]);

    const filteredStudents = useMemo(() => {
        if (!students) return [];
        const searchTerm = filters.search.toLowerCase();

        return students.filter(student => {
            const searchMatch = searchTerm
                ? student.name.toLowerCase().includes(searchTerm) ||
                  student.email.toLowerCase().includes(searchTerm)
                : true;

            const statusMatch = filters.status ? student.status === filters.status : true;
            const courseMatch = filters.course ? student.course === filters.course : true;
            
            return searchMatch && statusMatch && courseMatch;
        });
    }, [students, filters]);

    const sortedStudents = useMemo(() => {
        if (!filteredStudents) return null;
        const sortableItems = [...filteredStudents];
        sortableItems.sort((a, b) => {
            const valA = a[sortConfig.key];
            const valB = b[sortConfig.key];
            if (valA < valB) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (valA > valB) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [filteredStudents, sortConfig]);
    
    const paginatedStudents = useMemo(() => {
        if (!sortedStudents) return null;
        const startIndex = page * rowsPerPage;
        return sortedStudents.slice(startIndex, startIndex + rowsPerPage);
    }, [sortedStudents, page, rowsPerPage]);

    const requestSort = (key: keyof Student) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleAddClick = () => {
        navigate('/learning/students/new');
    };

    const handleEditClick = (student: Student) => {
        navigate(`/learning/students/${student.id}/edit`);
    };

    const handleDeleteClick = (studentId: string) => {
        setStudentToDelete(studentId);
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

    const handleAnalyzeScore = async (studentId: string) => {
        setAnalyzingId(studentId);
        try {
            const updatedStudent = await analyzeStudentScore(studentId);
            setStudents(prev => prev!.map(s => s.id === studentId ? updatedStudent : s));
            toast({ title: t('studentScoreAnalyzedSuccess'), variant: 'success' });
        } catch (error: any) {
            toast({ title: t('studentScoreAnalyzedError'), description: t(error.message) || 'An unknown error occurred.', variant: 'destructive' });
        } finally {
            setAnalyzingId(null);
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
            
            {/* Filter Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="relative lg:col-span-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="pl-8 w-full"
                    />
                </div>
                <div className="relative">
                    <ListFilter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select name="status" value={filters.status} onChange={handleFilterChange} className="pl-8">
                        <option value="">All Statuses</option>
                        {Object.values(StudentStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                 <div className="relative">
                    <BookOpen className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Select name="course" value={filters.course} onChange={handleFilterChange} className="pl-8">
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                </div>
                <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear
                </Button>
            </div>

            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <StudentsTable 
                        students={paginatedStudents} 
                        onEdit={handleEditClick} 
                        onDelete={handleDeleteClick} 
                        requestSort={requestSort} 
                        sortConfig={sortConfig}
                        onAnalyze={handleAnalyzeScore}
                        analyzingId={analyzingId}
                    />
                </CardContent>
                 <Pagination
                    count={filteredStudents.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={setPage}
                    onRowsPerPageChange={(value) => {
                        setRowsPerPage(value);
                        setPage(0);
                    }}
                />
            </Card>

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