import { Users, LogOut, LayoutDashboard, ChartBar, UserPlus, BookOpen, Calendar, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-screen w-64 bg-white border-r shadow-sm p-4 flex flex-col">
      <div className="flex-1">
        {/* Dashboard Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 px-2">Dashboard</h2>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/analytics')}
          >
            <ChartBar className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>

        {/* Management Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 px-2">Management</h2>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/students')}
          >
            <Users className="mr-2 h-4 w-4" />
            Students
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/admissions')}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Admissions
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/courses')}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </Button>
        </div>

        {/* Tools Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 px-2">Tools</h2>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/calendar')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
};

export default Sidebar;