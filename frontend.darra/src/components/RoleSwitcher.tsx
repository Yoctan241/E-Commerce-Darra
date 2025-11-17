import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, User } from 'lucide-react';

export default function RoleSwitcher() {
  const { user, isLoggedIn, switchToAdmin, switchToUser } = useAuth();

  if (!isLoggedIn || !user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
      <div className="text-sm font-medium text-gray-700 mb-2">Mode actuel: {user.role}</div>
      <div className="flex gap-2">
        {user.role === 'user' && (
          <Button
            onClick={switchToAdmin}
            className="bg-[#d4a574] hover:bg-[#b8935f] text-white text-xs py-1 px-3"
          >
            <Shield size={14} className="mr-1" />
            Mode Admin
          </Button>
        )}
        {user.role === 'admin' && (
          <Button
            onClick={switchToUser}
            className="bg-[#2d7a3e] hover:bg-[#1f5028] text-white text-xs py-1 px-3"
          >
            <User size={14} className="mr-1" />
            Mode Utilisateur
          </Button>
        )}
      </div>
    </div>
  );
}