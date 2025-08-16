
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Student, StudentStatus } from '../../../types';
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';
import { cn } from '../../../lib/utils';

const statusColorMap: Record<StudentStatus, string> = {
    [StudentStatus.ACTIVE]: 'bg-green-500',
    [StudentStatus.PAUSED]: 'bg-yellow-500',
    [StudentStatus.GRADUATED]: 'bg-blue-500',
};

interface StudentsTableProps {
    students: Student[] | null;
    onEdit: (student: Student) => void;
    onDelete: (studentId: string) => void;
}

const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-muted rounded-full h-2.5">
        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

export function StudentsTable({ students, onEdit, onDelete }: StudentsTableProps): React.ReactNode {
    const { t } = useI18n();
    const navigate = useNavigate();

    const handleViewProfile = (studentId: string) => {
        navigate(`/learning/students/${studentId}`);
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('course')}</TableHead>
                    <TableHead>{t('progress')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('joinDate')}</TableHead>
                    <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students ? (
                    students.map(student => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <img src={student.avatarUrl} alt={student.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <div className="font-medium">{student.name}</div>
                                        <div className="text-sm text-muted-foreground">{student.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{student.course}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <ProgressBar value={student.progress} />
                                    <span className="text-sm font-medium">{student.progress}%</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", statusColorMap[student.status])}></span>
                                    <span>{student.status}</span>
                                </div>
                            </TableCell>
                            <TableCell>{new Date(student.joinDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleViewProfile(student.id)}>{t('viewProfile')}</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onEdit(student)}>{t('edit')}</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(student.id)}>{t('delete')}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                           <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-40" /></div></div></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}