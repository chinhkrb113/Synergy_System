
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { useI18n } from '../../hooks/useI18n';
import { getStudents } from '../../services/mockApi';
import { Student } from '../../types';
import StudentsDirectoryTable from './components/StudentsDirectoryTable';

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof Student; direction: SortDirection };

function StudentDirectoryPage(): React.ReactNode {
    const { t } = useI18n();
    const [students, setStudents] = useState<Student[] | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'joinDate', direction: 'descending' });

    useEffect(() => {
        const fetchStudents = async () => {
            const data = await getStudents();
            setStudents(data);
        };
        fetchStudents();
    }, []);

    const sortedStudents = useMemo(() => {
        if (!students) return null;
        const sortableItems = [...students];
        sortableItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [students, sortConfig]);

    const requestSort = (key: keyof Student) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('studentDirectory')}</h1>
                    <p className="text-muted-foreground">{t('studentDirectoryDesc')}</p>
                </div>
            </div>
            
            <Card className="shadow-lg">
                <CardContent className="pt-6">
                    <StudentsDirectoryTable students={sortedStudents} requestSort={requestSort} sortConfig={sortConfig} />
                </CardContent>
            </Card>
        </div>
    );
}

export default StudentDirectoryPage;