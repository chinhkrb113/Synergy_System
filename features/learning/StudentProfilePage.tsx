import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/Card';
import { useI18n } from '../../hooks/useI18n';
import SkillRadarChart from './components/SkillRadarChart';
import StudentProgress from './components/StudentProgress';
import { Button } from '../../components/ui/Button';
import { Download } from 'lucide-react';
import { getStudentById, getStudentSkillMap } from '../../services/mockApi';
import { Student, SkillMap } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../contexts/AuthContext';
import MyTeamCard from './components/MyTeamCard';
import MyMatchedJobs from './components/MyMatchedJobs';

function StudentProfilePage(): React.ReactNode {
    const { t } = useI18n();
    const { studentId } = useParams<{ studentId: string }>();
    const { user } = useAuth();
    const [student, setStudent] = useState<Student | null>(null);
    const [skillMap, setSkillMap] = useState<SkillMap | null>(null);

    const isOwnProfile = user?.id === studentId;

    useEffect(() => {
        const fetchStudentData = async () => {
            if (studentId) {
                setStudent(null);
                setSkillMap(null);
                const studentData = await getStudentById(studentId);
                setStudent(studentData);
                const skillMapData = await getStudentSkillMap(studentId);
                setSkillMap(skillMapData);
            }
        };
        fetchStudentData();
    }, [studentId]);

    const renderHeader = () => (
        <div className="flex items-center justify-between">
            <div>
                {student ? (
                    <>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isOwnProfile ? `Welcome, ${student.name.split(' ')[0]}!` : student.name}
                        </h1>
                        <p className="text-muted-foreground">
                            {isOwnProfile ? "This is your personal dashboard." : t('studentProfileDesc')}
                        </p>
                    </>
                ) : (
                     <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-96" />
                    </div>
                )}
            </div>
             <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
            </Button>
        </div>
    );

    return (
        <div className="space-y-6">
            {renderHeader()}
            
            <div className="grid gap-6 lg:grid-cols-2">
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('skillMap')}</CardTitle>
                        {!isOwnProfile && <CardDescription>{t('dynamicSkillMapDesc')}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                       {skillMap ? <SkillRadarChart data={skillMap} studentName={student?.name || 'Student'} /> : <Skeleton className="h-[400px]" />}
                    </CardContent>
                </Card>
                 <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('taskProgress')}</CardTitle>
                        {!isOwnProfile && <CardDescription>Overview of assigned tasks and deadlines.</CardDescription>}
                    </CardHeader>
                    <CardContent>
                       {studentId ? <StudentProgress studentId={studentId} /> : <Skeleton className="h-[300px]" />}
                    </CardContent>
                </Card>
                
                {isOwnProfile && studentId && (
                    <>
                        <MyTeamCard studentId={studentId} />
                        <MyMatchedJobs studentId={studentId} />
                    </>
                )}
            </div>
        </div>
    );
}

export default StudentProfilePage;
