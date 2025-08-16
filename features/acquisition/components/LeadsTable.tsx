
import React from 'react';
import { Lead, LeadTier, LeadStatus } from '../../../types';
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

interface LeadsTableProps {
    leads: Lead[] | null;
    onEdit: (lead: Lead) => void;
    onDelete: (leadId: string) => void;
}

function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps): React.ReactNode {
    const { t } = useI18n();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('name')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead className="text-right">{t('score')}</TableHead>
                    <TableHead>{t('tier')}</TableHead>
                    <TableHead>{t('source')}</TableHead>
                    <TableHead>{t('assignee')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
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
                            <TableCell className="text-right">{lead.score.toFixed(2)}</TableCell>
                            <TableCell><Badge variant={tierVariantMap[lead.tier]}>{lead.tier}</Badge></TableCell>
                            <TableCell>{lead.source}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <img src={lead.assignee.avatarUrl} alt={lead.assignee.name} className="h-8 w-8 rounded-full" />
                                    <span>{lead.assignee.name}</span>
                                </div>
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