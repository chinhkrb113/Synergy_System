import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/Dialog';
import { Button } from './ui/Button';
import { Skeleton } from './ui/Skeleton';
import { Spinner } from './ui/Spinner';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getInterviewById, respondToInterview } from '../services/mockApi';
import { Interview, InterviewStatus } from '../types';
import { Calendar, MapPin, Building, CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface InterviewDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    interviewId: string | null;
}

function InterviewDetailsModal({ isOpen, onClose, interviewId }: InterviewDetailsModalProps) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [interview, setInterview] = useState<Interview | null>(null);
    const [loading, setLoading] = useState(true);
    const [isResponding, setIsResponding] = useState(false);

    useEffect(() => {
        const fetchInterview = async () => {
            if (isOpen && interviewId) {
                setLoading(true);
                setInterview(null);
                const data = await getInterviewById(interviewId);
                setInterview(data);
                setLoading(false);
            }
        };
        fetchInterview();
    }, [isOpen, interviewId]);
    
    const handleResponse = async (status: InterviewStatus.ACCEPTED | InterviewStatus.DECLINED) => {
        if (!interview) return;
        setIsResponding(true);
        try {
            const updatedInterview = await respondToInterview(interview.id, status);
            if (updatedInterview) {
                setInterview(updatedInterview);
            }
            toast({ title: t('interviewResponseSuccess'), variant: 'success' });
        } catch (error) {
             toast({ title: t('interviewResponseError'), variant: 'destructive' });
        } finally {
            setIsResponding(false);
        }
    };
    
    const renderStatusFooter = () => {
        if (!interview || isResponding) {
             return (
                <DialogFooter>
                    <Button disabled variant="ghost" onClick={onClose}>{t('cancel')}</Button>
                    <Button disabled className="w-24">
                        <Spinner className="h-4 w-4" />
                    </Button>
                </DialogFooter>
            );
        }
        
        switch (interview.status) {
            case InterviewStatus.PENDING:
                return (
                    <DialogFooter>
                        <Button variant="destructive" className="w-28" onClick={() => handleResponse(InterviewStatus.DECLINED)}>{t('decline')}</Button>
                        <Button className="w-28" onClick={() => handleResponse(InterviewStatus.ACCEPTED)}>{t('accept')}</Button>
                    </DialogFooter>
                );
            case InterviewStatus.ACCEPTED:
                 return (
                    <DialogFooter>
                        <p className="text-sm font-semibold text-green-600 flex items-center gap-2 mr-auto">
                           <CheckCircle className="h-4 w-4" /> {t('interviewAccepted')}
                        </p>
                        <Button variant="ghost" onClick={onClose}>Close</Button>
                    </DialogFooter>
                );
            case InterviewStatus.DECLINED:
                 return (
                     <DialogFooter>
                        <p className="text-sm font-semibold text-red-600 flex items-center gap-2 mr-auto">
                            <XCircle className="h-4 w-4" /> {t('interviewDeclined')}
                        </p>
                         <Button variant="ghost" onClick={onClose}>Close</Button>
                    </DialogFooter>
                );
            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>{t('interviewDetails')}</DialogTitle>
                <DialogDescription>{t('youAreInvited')}</DialogDescription>
            </DialogHeader>
            <DialogContent>
                {loading || !interview ? (
                     <div className="space-y-4">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                    </div>
                ) : (
                    <div className="space-y-4 text-sm">
                        <div className="font-semibold text-lg text-primary">{interview.jobTitle}</div>
                         <div className="flex items-center gap-3">
                           <Building className="h-4 w-4 text-muted-foreground" />
                           <span>{interview.companyName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <Calendar className="h-4 w-4 text-muted-foreground" />
                           <span>{new Date(interview.scheduledTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</span>
                        </div>
                         <div className="flex items-center gap-3">
                           <MapPin className="h-4 w-4 text-muted-foreground" />
                           <span>{interview.location}</span>
                        </div>
                         {interview.status === InterviewStatus.PENDING && (
                            <div className="flex items-center gap-3 pt-2 mt-2 border-t">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{t('pendingResponse')}</span>
                            </div>
                         )}
                    </div>
                )}
            </DialogContent>
            {renderStatusFooter()}
        </Dialog>
    );
}

export default InterviewDetailsModal;
