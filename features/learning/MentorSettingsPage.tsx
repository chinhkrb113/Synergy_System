

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';
import { useToast } from '../../hooks/useToast';
import { getUserById, updateUser, updateUserPassword } from '../../services/mockApi';
import { User } from '../../types';
import { Skeleton } from '../../components/ui/Skeleton';
import { Spinner } from '../../components/ui/Spinner';

function MentorSettingsPage() {
    const { user, login } = useAuth(); // Using login to refresh user context
    const { t } = useI18n();
    const { toast } = useToast();
    const [mentor, setMentor] = useState<User | null>(null);
    const [isSavingInfo, setIsSavingInfo] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);

    const [formData, setFormData] = useState({ name: '', age: '', phone: '', address: '', nationalId: '' });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const fetchMentor = async () => {
            if (user) {
                const data = await getUserById(user.id);
                setMentor(data);
                if (data) {
                    setFormData({ 
                        name: data.name, 
                        age: String(data.age || ''),
                        phone: data.phone || '',
                        address: data.address || '',
                        nationalId: data.nationalId || '',
                    });
                }
            }
        };
        fetchMentor();
    }, [user]);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleInfoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mentor) return;
        setIsSavingInfo(true);
        const updatedUser = await updateUser(mentor.id, { 
            name: formData.name, 
            age: Number(formData.age),
            phone: formData.phone,
            address: formData.address,
            nationalId: formData.nationalId,
        });
        if (updatedUser) {
            // Re-login to update the user object in AuthContext
            await login(updatedUser.email);
        }
        setIsSavingInfo(false);
        toast({
            title: "Success",
            description: "Your personal information has been updated.",
            variant: "success",
        });
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            toast({
                title: "Error",
                description: "New passwords do not match.",
                variant: "destructive",
            });
            return;
        }
        if (!user) return;
        setIsSavingPassword(true);
        await updateUserPassword(user.id, passwordData.new);
        setIsSavingPassword(false);
        setPasswordData({ current: '', new: '', confirm: '' });
        toast({
            title: "Success",
            description: "Your password has been changed successfully.",
            variant: "success",
        });
    };

    if (!mentor) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
                <Skeleton className="h-96 w-full" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t('settings')}</h1>
                <p className="text-muted-foreground">Manage your account information and password.</p>
            </div>
            
            <form onSubmit={handleInfoSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('personalInformation')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('fullName')}</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInfoChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">{t('age')}</Label>
                                <Input id="age" name="age" type="number" value={formData.age} onChange={handleInfoChange} />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                             <div className="space-y-2">
                                <Label htmlFor="phone">{t('phone')}</Label>
                                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInfoChange} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="nationalId">{t('nationalId')}</Label>
                                <Input id="nationalId" name="nationalId" value={formData.nationalId} onChange={handleInfoChange} />
                            </div>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="address">{t('address')}</Label>
                            <Input id="address" name="address" value={formData.address} onChange={handleInfoChange} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input id="email" type="email" value={mentor.email} disabled />
                            <CardDescription>Your email address is used for logging in and cannot be changed.</CardDescription>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                         <Button type="submit" disabled={isSavingInfo}>
                             {isSavingInfo && <Spinner className="mr-2 h-4 w-4" />}
                            {t('save')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
            
            <form onSubmit={handlePasswordSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('changePassword')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current">{t('currentPassword')}</Label>
                            <Input id="current" name="current" type="password" value={passwordData.current} onChange={handlePasswordChange} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="new">{t('newPassword')}</Label>
                                <Input id="new" name="new" type="password" value={passwordData.new} onChange={handlePasswordChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm">{t('confirmNewPassword')}</Label>
                                <Input id="confirm" name="confirm" type="password" value={passwordData.confirm} onChange={handlePasswordChange} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                         <Button type="submit" disabled={isSavingPassword || !passwordData.new}>
                            {isSavingPassword && <Spinner className="mr-2 h-4 w-4" />}
                            {t('updatePassword')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}

export default MentorSettingsPage;