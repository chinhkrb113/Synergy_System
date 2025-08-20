
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, StudentStatus, UserRole } from '../../../types';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Eye, FilePenLine, Trash2, Sparkles } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../contexts/AuthContext';

const statusColorMap: Record<StudentStatus, string> = {
    [StudentStatus.ACTIVE]: 'bg-green-500',
    [StudentStatus.PAUSED]: 'bg-yellow-500',
    [StudentStatus.GRADUATED]: 'bg-blue-500',
};

type SortConfig = { key: keyof Student; direction: 'ascending' | 'descending' };

interface StudentsTableProps {
    students: Student[] | null;
    onEdit: (student: Student) => void;
    onDelete: (studentId: string) => void;
    requestSort: (key: keyof Student) => void;
    sortConfig: SortConfig;
    onAnalyze: (studentId: string) => void;
    analyzingId: string | null;
}

export function StudentsTable({ students, onEdit, onDelete, requestSort, sortConfig, onAnalyze, analyzingId }: StudentsTableProps): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === UserRole.ADMIN;


    const handleViewProfile = (studentId: string) => {
        navigate(`/learning/students/${studentId}`);
    };

    const getSortDirection = (key: keyof Student) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => requestSort('name')} isSorted={getSortDirection('name')}>{t('name')}</TableHead>
                    <TableHead onClick={() => requestSort('email')} isSorted={getSortDirection('email')}>{t('email')}</TableHead>
                    <TableHead onClick={() => requestSort('course')} isSorted={getSortDirection('course')}>{t('course')}</TableHead>
                    <TableHead onClick={() => requestSort('score')} isSorted={getSortDirection('score')}>{t('score')}</TableHead>
                    <TableHead onClick={() => requestSort('status')} isSorted={getSortDirection('status')}>{t('status')}</TableHead>
                    <TableHead onClick={() => requestSort('createdAt')} isSorted={getSortDirection('createdAt')}>{t('created')}</TableHead>
                    <TableHead onClick={() => requestSort('updatedAt')} isSorted={getSortDirection('updatedAt')}>{t('updated')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students ? (
                    students.map(student => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <div className="font-medium">{student.name}</div>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>{student.course}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{student.score ?? '-'}</span>
                                    {student.aiAssessed && (
                                        <span title="Score assessed by AI">
                                            <Sparkles className="h-4 w-4 text-purple-400" />
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", statusColorMap[student.status])}></span>
                                    <span>{student.status}</span>
                                </div>
                            </TableCell>
                            <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{student.updatedAt ? new Date(student.updatedAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-0">
                                    <Button variant="ghost" size="icon" title={t('viewProfile')} onClick={() => handleViewProfile(student.id)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title={t('edit')} onClick={() => onEdit(student)}>
                                        <FilePenLine className="h-4 w-4" />
                                    </Button>
                                    {isAdmin && (
                                        <Button variant="ghost" size="icon" title={t('analyzeScoreWithAI')} onClick={() => onAnalyze(student.id)} disabled={analyzingId === student.id}>
                                            <Sparkles className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title={t('delete')} onClick={() => onDelete(student.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                           <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
