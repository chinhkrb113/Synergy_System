
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Skeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../../components/ui/DropdownMenu';
import { MoreHorizontal } from 'lucide-react';
import { getUsers, updateUserRole } from '../../services/mockApi';
import { User, UserRole } from '../../types';
import UserRoleModal from './components/UserRoleModal';
import { useToast } from '../../hooks/useToast';

const roleColorMap: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'bg-red-500',
    [UserRole.AGENT]: 'bg-blue-500',
    [UserRole.MENTOR]: 'bg-purple-500',
    [UserRole.STUDENT]: 'bg-green-500',
    [UserRole.COMPANY_USER]: 'bg-orange-500',
};

function SettingsPage() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
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
        setIsModalOpen(false);
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
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users ? users.map(user => (
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
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4"/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEditClick(user)}>
                                                    Edit Role
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
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveRole}
                    user={editingUser}
                />
            )}
        </div>
    );
}

export default SettingsPage;
