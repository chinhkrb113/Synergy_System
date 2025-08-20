

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Spinner } from '../../components/ui/Spinner';
import { Eye, EyeOff } from 'lucide-react';

const mockAccounts = [
    'admin@example.com',
    'agent@example.com',
    'mentor@example.com',
    'student@example.com',
    'company@example.com',
];

function LoginPage(): React.ReactNode {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('Passw0rd!'); // Dummy password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const { t } = useI18n();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(email);
            navigate(from, { replace: true });
        } catch (err) {
            setError('Failed to log in. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="w-full max-w-sm shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    </div>
                    <CardTitle className="text-2xl">{t('welcome')}</CardTitle>
                    <CardDescription>{t('loginToYourAccount')}</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">{t('email')}</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">{t('password')}</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                         {error && <p className="text-sm text-destructive">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                            {t('login')}
                        </Button>
                         <div className="text-xs text-muted-foreground text-center">
                            <p>Demo accounts:</p>
                            <div className="flex flex-wrap gap-x-2 justify-center">
                               {mockAccounts.map(acc => <code key={acc} className="cursor-pointer hover:text-primary" onClick={() => setEmail(acc)}>{acc.split('@')[0]}</code>)}
                            </div>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default LoginPage;