import React from 'react';
import { User } from '../../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';

interface AgentsTableProps {
    agents: User[] | null;
    onEdit: (agent: User) => void;
    onDelete: (agent: User) => void;
}

function AgentsTable({ agents, onEdit, onDelete }: AgentsTableProps) {
    const { t } = useI18n();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('email')}</TableHead>
                    <TableHead>{t('phone')}</TableHead>
                    <TableHead>{t('address')}</TableHead>
                    <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {agents ? (
                    agents.map(agent => (
                        <TableRow key={agent.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <img src={agent.avatarUrl} alt={agent.name} className="h-10 w-10 rounded-full" />
                                    <span className="font-medium">{agent.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{agent.email}</TableCell>
                            <TableCell>{agent.phone || '-'}</TableCell>
                            <TableCell>{agent.address || '-'}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(agent)}>{t('edit')}</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(agent)}>{t('delete')}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></div></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

export default AgentsTable;
