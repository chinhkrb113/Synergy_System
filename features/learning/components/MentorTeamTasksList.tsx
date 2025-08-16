
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';
import { TeamTask, TaskStatus } from '../../../types';

interface MentorTeamTasksListProps {
    tasks: TeamTask[];
    onEditTask: (task: TeamTask) => void;
}

const statusVariantMap: Record<TaskStatus, 'success' | 'secondary' | 'warning'> = {
    [TaskStatus.COMPLETED]: 'success',
    [TaskStatus.IN_PROGRESS]: 'secondary',
    [TaskStatus.PENDING]: 'warning',
};

function MentorTeamTasksList({ tasks, onEditTask }: MentorTeamTasksListProps) {
    const { t } = useI18n();

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('teamTasks')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('taskTitle')}</TableHead>
                            <TableHead>{t('assignedTo')}</TableHead>
                            <TableHead>{t('status')}</TableHead>
                            <TableHead>{t('dueDate')}</TableHead>
                            <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.length > 0 ? tasks.map(task => (
                            <TableRow key={task.id}>
                                <TableCell className="font-medium">{task.title}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <img src={task.studentAvatarUrl} alt={task.studentName} className="h-8 w-8 rounded-full" />
                                        <span>{task.studentName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariantMap[task.status]}>{task.status}</Badge>
                                </TableCell>
                                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEditTask(task)}>
                                                {t('edit')}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No tasks assigned to this team yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default MentorTeamTasksList;
