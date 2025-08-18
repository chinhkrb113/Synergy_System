import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, PlusCircle, Globe, LogOut, UserCheck, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../ui/DropdownMenu';
import { ThemeToggle } from '../ThemeToggle';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import NotificationBell from '../NotificationBell';

function Header({ onMenuClick }: { onMenuClick: () => void }): React.ReactNode {
  const { t, setLanguage, language } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Should not happen in a protected route, but good practice

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Button size="icon" variant="outline" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t('search')}
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <Button size="icon" variant="ghost" className="rounded-full">
        <PlusCircle className="h-5 w-5" />
      </Button>

      {(user.role === UserRole.STUDENT || user.role === UserRole.COMPANY_USER) && <NotificationBell />}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'font-bold' : ''}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('vi')} className={language === 'vi' ? 'font-bold' : ''}>
            Tiếng Việt
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
            <img src={user.avatarUrl} alt="Avatar" width={32} height={32} className="rounded-full" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
           <DropdownMenuItem disabled>
            <div className="flex flex-col">
              <span className="font-semibold">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.role === UserRole.STUDENT && (
            <>
              <DropdownMenuItem onClick={() => navigate(`/learning/students/${user.id}`)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/learning/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
              </DropdownMenuItem>
            </>
          )}
          {user.role === UserRole.MENTOR && (
            <DropdownMenuItem onClick={() => navigate('/learning/mentor-settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('settings')}</span>
            </DropdownMenuItem>
          )}
           {user.role === UserRole.ADMIN && (
            <>
              <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  <span>{t('profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/ops/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{t('settings')}</span>
              </DropdownMenuItem>
            </>
          )}
          {(user.role === UserRole.AGENT || user.role === UserRole.COMPANY_USER) && (
             <DropdownMenuItem onClick={() => navigate('/profile/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('settings')}</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
             <LogOut className="mr-2 h-4 w-4" />
            <span>{t('logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header;