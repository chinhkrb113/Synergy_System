
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Badge } from '../../../components/ui/Badge';
import { useI18n } from '../../../hooks/useI18n';
import { getTasksForStudent } from '../../../services/mockApi';
import { Task, TaskStatus } from '../../../types';
import { CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface TeamTasksListProps {
    teamId: string;
    studentId: string;
}

const statusMap: Record<TaskStatus, { icon: React.ElementType, color: string, variant: 'success' | 'warning' | 'secondary' }> = {
    [TaskStatus.COMPLETED]: { icon: CheckCircle2, color: 'text-green-500', variant: 'success' },
    [TaskStatus.IN_PROGRESS]: { icon: Clock, color: 'text-blue-500', variant: 'secondary' },
    [TaskStatus.PENDING]: { icon: AlertCircle, color: 'text-amber-500', variant: 'warning' },
};


function TeamTasksList({ teamId, studentId }: TeamTasksListProps) {
    const { t } = useI18n();
    const [tasks, setTasks] = useState<Task[] | null>(null);

    useEffect(() => {
        const fetchAndFilterTasks = async () => {
            const allTasks = await getTasksForStudent(studentId);
            const teamTasks = allTasks.filter(task => task.teamId === teamId);
            setTasks(teamTasks);
        };
        fetchAndFilterTasks();
    }, [teamId, studentId]);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('teamTasks')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks ? (
                            tasks.length > 0 ? tasks.map(task => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusMap[task.status].variant}>{task.status}</Badge>
                                    </TableCell>
                                    <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                                        No tasks assigned for this team project yet.
                                    </TableCell>
                                </TableRow>
                            )
                        ) : (
                            Array.from({ length: 3 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default TeamTasksList;