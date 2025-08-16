
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../../../components/ui/Dialog';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { User, UserRole } from '../../../types';

interface UserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (userId: string, newRole: UserRole) => void;
    user: User;
}

function UserRoleModal({ isOpen, onClose, onSave, user }: UserRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

    useEffect(() => {
        if (user) {
            setSelectedRole(user.role);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(user.id, selectedRole);
    };

    if (!isOpen) return null;

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit}>
                <DialogHeader>
                    <DialogTitle>Edit User Role</DialogTitle>
                    <DialogDescription>
                        Change the role for <span className="font-semibold">{user.name}</span> ({user.email}).
                    </DialogDescription>
                </DialogHeader>
                <DialogContent>
                    <div className="space-y-2">
                        <Label htmlFor="role">User Role</Label>
                        <Select
                            id="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        >
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                    </div>
                </DialogContent>
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Changes</Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
}

export default UserRoleModal;
