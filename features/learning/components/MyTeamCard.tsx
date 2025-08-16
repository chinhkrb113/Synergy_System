import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useI18n } from '../../../hooks/useI18n';
import { getTeamForStudent } from '../../../services/mockApi';
import { Team } from '../../../types';
import { Users, User, Briefcase } from 'lucide-react';

interface MyTeamCardProps {
    studentId: string;
}

function MyTeamCard({ studentId }: MyTeamCardProps) {
    const { t } = useI18n();
    const [team, setTeam] = useState<Team | null | undefined>(undefined); // undefined for loading

    useEffect(() => {
        const fetchTeam = async () => {
            const teamData = await getTeamForStudent(studentId);
            setTeam(teamData);
        };
        fetchTeam();
    }, [studentId]);

    if (team === undefined) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>{t('myTeam')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!team) {
        return (
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>{t('myTeam')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-10 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12" />
                    <p className="mt-4">{t('noTeamAssigned')}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('myTeam')}: <span className="text-primary">{team.name}</span></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-start space-x-3">
                    <Briefcase className="h-5 w-5 mt-1 text-muted-foreground" />
                    <div>
                        <p className="text-sm font-semibold">{t('myProject')}</p>
                        <p className="text-lg font-bold">{team.project}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                     <div>
                        <p className="text-sm font-semibold">{t('mentor')}</p>
                        <p>{team.mentor}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-semibold mb-2">{t('teammates')}</p>
                     <div className="flex items-center">
                        {team.members.map((member, index) => (
                            <img 
                                key={member.id} 
                                src={member.avatarUrl} 
                                alt={member.name} 
                                className="h-10 w-10 rounded-full border-2 border-background"
                                style={{ marginLeft: index > 0 ? '-12px' : 0, zIndex: team.members.length - index }}
                                title={member.name}
                            />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default MyTeamCard;
