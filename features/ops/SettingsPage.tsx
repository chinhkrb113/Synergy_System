

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../../components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { getUsers, updateUserRole, deleteUser } from '../../services/mockApi';
import { User, UserRole } from '../../types';
import UserRoleModal from './components/UserRoleModal';
import { AlertDialog } from '../../components/ui/AlertDialog';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';

const roleColorMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'bg-red-500',
    [UserRole.AGENT]: 'bg-blue-500',
    [UserRole.MENTOR]: 'bg-purple-500',
    [UserRole.STUDENT]: 'bg-green-500',
    [UserRole.COMPANY_USER]: 'bg-orange-500',
};

type SortDirection = 'ascending' | 'descending';
type SortConfig = { key: keyof User; direction: SortDirection };

function SettingsPage() {
    const { t } = useI18n();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[] | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const { toast } = useToast();
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);
    
    const sortedUsers = useMemo(() => {
        if (!users) return null;
        const sortableItems = [...users];
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
    }, [users, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortDirection = (key: keyof User) => {
        if (sortConfig.key !== key) return false;
        return sortConfig.direction;
    };


    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsRoleModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
    };

    const confirmDelete = async () => {
        if (userToDelete) {
            const success = await deleteUser(userToDelete.id);
            if (success) {
                setUsers(prev => prev!.filter(u => u.id !== userToDelete.id));
                toast({
                    title: 'Success!',
                    description: `User ${userToDelete.name} has been deleted.`,
                    variant: 'success'
                });
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to delete user.',
                    variant: 'destructive'
                });
            }
            setUserToDelete(null);
        }
    };

    const handleSaveRole = async (userId: string, newRole: UserRole) => {
        const updatedUser = await updateUserRole(userId, newRole);
        if (updatedUser) {
            setUsers(prev => prev!.map(u => u.id === userId ? updatedUser : u));
            toast({
                title: 'Success!',
                description: `Successfully updated ${updatedUser.name}'s role to ${newRole}.`,
                variant: 'success'
            });
        } else {
             toast({
                title: 'Error',
                description: `Failed to update user role.`,
                variant: 'destructive'
            });
        }
        setIsRoleModalOpen(false);
        setEditingUser(null);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage system users and their roles.</p>
            </div>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all users in the Synergy CRM system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead onClick={() => requestSort('name')} isSorted={getSortDirection('name')}>Name</TableHead>
                                <TableHead onClick={() => requestSort('email')} isSorted={getSortDirection('email')}>Email</TableHead>
                                <TableHead onClick={() => requestSort('role')} isSorted={getSortDirection('role')}>Role</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedUsers ? sortedUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full" />
                                            <span className="font-medium">{user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                         <Badge className={`${roleColorMap[user.role]} text-white`}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={user.id === currentUser?.id}>
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                                    Edit Role
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem 
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    {t('delete')}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )) : Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-32" /></div></TableCell>
                                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {editingUser && (
                 <UserRoleModal
                    isOpen={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                    onSave={handleSaveRole}
                    user={editingUser}
                />
            )}

            <AlertDialog
                isOpen={!!userToDelete}
                onClose={() => setUserToDelete(null)}
                onConfirm={confirmDelete}
                title={t('areYouSure')}
                description={t('deleteUserWarning', { userName: userToDelete?.name || '' })}
            />
        </div>
    );
}

export default SettingsPage;
