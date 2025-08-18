


import React from 'react';
import { Lead, LeadTier, LeadStatus, LeadClassification } from '../../../types';
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

const tierVariantMap: Record<LeadTier, 'hot' | 'warm' | 'cold'> = {
    [LeadTier.HOT]: 'hot',
    [LeadTier.WARM]: 'warm',
    [LeadTier.COLD]: 'cold',
};

const statusColorMap: Record<LeadStatus, string> = {
    [LeadStatus.NEW]: 'bg-blue-500',
    [LeadStatus.WORKING]: 'bg-yellow-500',
    [LeadStatus.QUALIFIED]: 'bg-green-500',
    [LeadStatus.UNQUALIFIED]: 'bg-gray-500',
    [LeadStatus.ENROLLED]: 'bg-purple-500',
    [LeadStatus.CLOSED]: 'bg-red-500',
};

const classificationColorMap: Record<LeadClassification, string> = {
    [LeadClassification.STUDENT]: 'bg-green-500',
    [LeadClassification.INTERN]: 'bg-blue-500',
    [LeadClassification.ENTERPRISE]: 'bg-purple-500',
    [LeadClassification.LECTURER]: 'bg-yellow-600',
    [LeadClassification.UNIVERSITY]: 'bg-indigo-500',
    [LeadClassification.PARTNER]: 'bg-pink-500',
};

type SortConfig = { key: string; direction: 'ascending' | 'descending' };

interface LeadsTableProps {
    leads: Lead[] | null;
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
    requestSort: (key: string) => void;
    sortConfig: SortConfig;
}

function LeadsTable({ leads, onEdit, onDelete, requestSort, sortConfig }: LeadsTableProps): React.ReactNode {
    const { t } = useI18n();

    const getClassificationText = (classification?: LeadClassification) => {
        if (!classification) return '';
        const key = `classification${classification.charAt(0)}${classification.slice(1).toLowerCase()}`;
        return t(key);
    };

    const getSortDirection = (key: string) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead onClick={() => requestSort('name')} isSorted={getSortDirection('name')}>{t('name')}</TableHead>
                    <TableHead onClick={() => requestSort('status')} isSorted={getSortDirection('status')}>{t('status')}</TableHead>
                    <TableHead onClick={() => requestSort('classification')} isSorted={getSortDirection('classification')}>{t('classification')}</TableHead>
                    <TableHead className="text-right" onClick={() => requestSort('score')} isSorted={getSortDirection('score')}>{t('score')}</TableHead>
                    <TableHead onClick={() => requestSort('tier')} isSorted={getSortDirection('tier')}>{t('tier')}</TableHead>
                    <TableHead onClick={() => requestSort('source')} isSorted={getSortDirection('source')}>{t('source')}</TableHead>
                    <TableHead onClick={() => requestSort('assignee.name')} isSorted={getSortDirection('assignee.name')}>{t('assignee')}</TableHead>
                    <TableHead onClick={() => requestSort('createdAt')} isSorted={getSortDirection('createdAt')}>{t('created')}</TableHead>
                    <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leads ? (
                    leads.map(lead => (
                        <TableRow key={lead.id}>
                            <TableCell className="font-medium">
                                <div className="font-semibold">{lead.name}</div>
                                <div className="text-xs text-muted-foreground">{lead.email}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className={cn("h-2 w-2 rounded-full", statusColorMap[lead.status])}></span>
                                    <span>{lead.status}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {lead.classification ? (
                                    <Badge className={`${classificationColorMap[lead.classification]} text-white hover:${classificationColorMap[lead.classification]}`}>
                                        {getClassificationText(lead.classification)}
                                    </Badge>
                                ) : (
                                    <span className="text-muted-foreground">-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">{lead.score.toFixed(2)}</TableCell>
                            <TableCell><Badge variant={tierVariantMap[lead.tier]}>{lead.tier}</Badge></TableCell>
                            <TableCell>{lead.source}</TableCell>
                            <TableCell>
                                {lead.assignee ? (
                                    <div className="flex items-center gap-2">
                                        <img src={lead.assignee.avatarUrl} alt={lead.assignee.name} className="h-8 w-8 rounded-full" />
                                        <span>{lead.assignee.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground italic">{t('unassigned')}</span>
                                )}
                            </TableCell>
                            <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(lead)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(lead.id)}>Delete</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 10 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-36" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

export default LeadsTable;
