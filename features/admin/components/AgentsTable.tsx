
import React from 'react';
import { User } from '../../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { FilePenLine, Trash2, Eye } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';

type SortConfig = { key: keyof User; direction: 'ascending' | 'descending' };

interface AgentsTableProps {
    agents: User[] | null;
    onView: (agent: User) => void;
    onEdit: (agent: User) => void;
    onDelete: (agent: User) => void;
    sortConfig: SortConfig;
    requestSort: (key: keyof User) => void;
}

function AgentsTable({ agents, onView, onEdit, onDelete, sortConfig, requestSort }: AgentsTableProps) {
    const { t } = useI18n();
    
    const getSortDirection = (key: keyof User) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => requestSort('name')} isSorted={getSortDirection('name')}>{t('name')}</TableHead>
                    <TableHead onClick={() => requestSort('email')} isSorted={getSortDirection('email')}>{t('email')}</TableHead>
                    <TableHead onClick={() => requestSort('phone')} isSorted={getSortDirection('phone')}>{t('phone')}</TableHead>
                    <TableHead onClick={() => requestSort('createdAt')} isSorted={getSortDirection('createdAt')}>{t('created')}</TableHead>
                    <TableHead onClick={() => requestSort('updatedAt')} isSorted={getSortDirection('updatedAt')}>{t('updated')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {agents ? (
                    agents.map(agent => (
                        <TableRow key={agent.id}>
                            <TableCell>
                                <span className="font-medium">{agent.name}</span>
                            </TableCell>
                            <TableCell>{agent.email}</TableCell>
                            <TableCell>{agent.phone || '-'}</TableCell>
                            <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{agent.updatedAt ? new Date(agent.updatedAt).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-0">
                                    <Button variant="ghost" size="icon" title={t('view')} onClick={() => onView(agent)}>
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title={t('edit')} onClick={() => onEdit(agent)}>
                                        <FilePenLine className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title={t('delete')} onClick={() => onDelete(agent)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

export default AgentsTable;
