import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, ArrowRight, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';

const AccountTypeSelection = () => {
  console.log('AccountTypeSelection component mounted');
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { updateUserRole, user } = useAuthStore();

  useEffect(() => {
    console.log('AccountTypeSelection rendered with user:', user);
  }, [user]);

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateUserRole(selectedRole);
      console.log(`Role updated to: ${selectedRole}, navigating to form page`);
      console.log('Current location:', window.location.pathname);

      // Use absolute paths instead of relative paths to avoid path nesting issues
      if (selectedRole === 'student') {
        navigate('/profile/setup/student', { replace: true });
      } else {
        navigate('/profile/setup/organizer', { replace: true });
      }

      toast.success(`You've selected the ${selectedRole} role!`);
    } catch (error) {
      toast.error("Failed to update role. Please try again.");
      console.error("Role update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="bg-[#0a66c2] p-6 -mx-8 -mt-8 mb-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Choose Your Role
            </h2>
            <p className="text-blue-100 text-center mt-1">
              Select how you'd like to use Skill Forge. You can always change this later.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Student Option */}
            <div
              className={`p-6 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                selectedRole === 'student'
                  ? 'bg-[#e7f3ff] border-2 border-[#0a66c2]'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedRole('student')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#e7f3ff] flex items-center justify-center mb-4">
                  <GraduationCap size={28} className="text-[#0a66c2]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Student</h3>
                <p className="text-gray-600 text-sm">
                  Learn new skills, join workshops, and connect with mentors to advance your career.
                </p>
              </div>
            </div>

            {/* Organizer Option */}
            <div
              className={`p-6 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                selectedRole === 'organizer'
                  ? 'bg-[#e7f3ff] border-2 border-[#0a66c2]'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedRole('organizer')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#e7f3ff] flex items-center justify-center mb-4">
                  <Users size={28} className="text-[#0a66c2]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">Organizer</h3>
                <p className="text-gray-600 text-sm">
                  Create workshops, share expertise, and build a community around your professional skills.
                </p>
              </div>
            </div>
          </div>

          <button
            className={`w-full py-3 px-4 rounded-md font-medium text-white flex items-center justify-center gap-2 transition-colors
              ${selectedRole ? 'bg-[#0a66c2] hover:bg-[#084b8a]' : 'bg-gray-300 cursor-not-allowed text-gray-500'}`}
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <>
                Continue <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
