
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchingCandidate, JobPosting } from '../../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../../components/ui/Table';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useI18n } from '../../../hooks/useI18n';
import { useToast } from '../../../hooks/useToast';
import { requestInterview } from '../../../services/mockApi';
import { Spinner } from '../../../components/ui/Spinner';

const ProgressBar = ({ value }: { value: number }) => (
    <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
);

interface MatchingResultsProps {
    candidates: MatchingCandidate[];
    job?: JobPosting | null;
}

function MatchingResults({ candidates, job }: MatchingResultsProps) {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [requestingId, setRequestingId] = useState<string | null>(null);

    const handleRequestInterview = async (candidate: MatchingCandidate) => {
        if (!job) return;
        setRequestingId(candidate.id);
        try {
            await requestInterview(job.id, candidate.id, job.companyName);
            toast({
                title: "Success!",
                description: t('interviewScheduledSuccess', { candidateName: candidate.name }),
                variant: 'success'
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to schedule interview. Please try again.",
                variant: 'destructive'
            });
        } finally {
            setRequestingId(null);
        }
    };

    if (candidates.length === 0) {
        return (
            <Card className="shadow-lg mt-6 animate-in fade-in-50 duration-500">
                <CardHeader>
                    <CardTitle>{t('matchingCandidates')}</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8 text-muted-foreground">
                    <p>{t('noCandidatesFound')}</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="shadow-lg mt-6 animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle>{t('matchingCandidates')}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('name')}</TableHead>
                            <TableHead className="w-[150px]">{t('matchScore')}</TableHead>
                            <TableHead>{t('matchingSkills')}</TableHead>
                            <TableHead className="text-right"><span className="sr-only">{t('actions')}</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {candidates.map(candidate => {
                            const isRequesting = requestingId === candidate.id;
                            return (
                                <TableRow key={candidate.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img src={candidate.avatarUrl} alt={candidate.name} className="h-10 w-10 rounded-full" />
                                            <div>
                                                <div className="font-medium">{candidate.name}</div>
                                                <div className="text-sm text-muted-foreground">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ProgressBar value={candidate.matchScore} />
                                            <span className="text-sm font-medium">{Math.round(candidate.matchScore)}%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {candidate.matchingSkills.map(skill => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button variant="outline" size="sm" onClick={() => navigate(`/learning/students/${candidate.id}`)}>
                                                {t('viewProfile')}
                                            </Button>
                                            <Button size="sm" onClick={() => handleRequestInterview(candidate)} disabled={isRequesting}>
                                                {isRequesting && <Spinner className="mr-2 h-4 w-4" />}
                                                {isRequesting ? t('requestingInterview') : t('requestInterview')}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default MatchingResults;