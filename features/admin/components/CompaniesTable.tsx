import React from 'react';
import { Company } from '../../../types';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../../../components/ui/Table';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { useI18n } from '../../../hooks/useI18n';

interface CompaniesTableProps {
    companies: Company[] | null;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

function CompaniesTable({ companies, onEdit, onDelete }: CompaniesTableProps) {
    const { t } = useI18n();

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t('companyName')}</TableHead>
                    <TableHead>{t('industry')}</TableHead>
                    <TableHead>{t('contactEmail')}</TableHead>
                    <TableHead>{t('created')}</TableHead>
                    <TableHead><span className="sr-only">{t('actions')}</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companies ? (
                    companies.map(company => (
                        <TableRow key={company.id}>
                            <TableCell className="font-medium">{company.name}</TableCell>
                            <TableCell>{company.industry}</TableCell>
                            <TableCell>{company.contactEmail}</TableCell>
                            <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(company)}>{t('edit')}</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive" onClick={() => onDelete(company)}>{t('delete')}</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}

export default CompaniesTable;
