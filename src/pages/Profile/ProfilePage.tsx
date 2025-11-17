import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save,
  Shield,
  Calendar,
  MapPin,
  Briefcase,
  X
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/auth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_BASE_URL } from '@/config/api';

// Profile update schema
const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  team: z.string().optional(),
  region: z.string().optional(),
});

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  newPassword_confirmation: z.string(),
}).refine((data) => data.newPassword === data.newPassword_confirmation, {
  message: "Passwords don't match",
  path: ["newPassword_confirmation"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const justUpdatedRef = React.useRef(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      team: user?.team || '',
      region: user?.region || '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPassword_confirmation: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        team: user.team || '',
        region: user.region || '',
      });
      
      // Don't update avatar preview if we just manually updated it (after profile save)
      if (justUpdatedRef.current) {
        justUpdatedRef.current = false;
        return; // Skip avatar preview update
      }
      
      // Only update avatar preview if we don't have a local file selected
      if (!avatarFile) {
        if (user.avatar) {
          // Check if avatarPreview is already a data URL (local preview)
          // If so, don't override it unless it's from the server
          const isDataUrl = avatarPreview?.startsWith('data:');
          if (!isDataUrl || !avatarPreview) {
            setAvatarPreview(user.avatar);
          }
        } else {
          setAvatarPreview(null);
        }
      }
    }
  }, [user, avatarFile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your avatar?')) {
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await authService.removeAvatar();
      
      // Clear local state
      setAvatarFile(null);
      setAvatarPreview(null);
      
      // Update user in store
      updateUser(updatedUser);
      
      toast.success('Avatar removed successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove avatar');
    } finally {
      setIsLoading(false);
    }
  };

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      if (data.team) formData.append('team', data.team);
      if (data.region) formData.append('region', data.region);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const updatedUser = await authService.updateProfile(formData);
      
      // Clear local file first
      setAvatarFile(null);
      
      // Mark that we're doing a manual update to prevent useEffect from overriding
      justUpdatedRef.current = true;
      
      // Update avatar preview FIRST (before updating store) to use the server URL (with cache-busting)
      if (updatedUser.avatar) {
        // Ensure we have a full URL (if backend returns relative, prepend API base URL)
        let avatarUrl = updatedUser.avatar;
        if (avatarUrl && !avatarUrl.startsWith('http')) {
          // If relative URL, construct full URL from API base
          const apiBase = API_BASE_URL.replace('/api', ''); // Remove /api to get base URL
          avatarUrl = `${apiBase}${avatarUrl}`;
        }
        // Add timestamp to force browser to reload the image
        const timestamp = Date.now();
        const finalAvatarUrl = `${avatarUrl}?t=${timestamp}`;
        setAvatarPreview(finalAvatarUrl);
      }
      
      // Update user in store AFTER setting preview
      updateUser(updatedUser);
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        newPassword_confirmation: data.newPassword_confirmation,
      });
      toast.success('Password changed successfully!');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your profile</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage your personal information and account settings
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - User Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mx-auto">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full object-cover"
                      key={avatarPreview} // Force re-render when avatar changes
                      onError={(e) => {
                        // Fallback to default avatar
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-600">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors shadow-lg">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                {avatarPreview && (
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute top-0 right-0 bg-error-500 text-white p-1 rounded-full hover:bg-error-600 transition-colors shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
              
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              
              <div className="mt-4 flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 capitalize">{user.role}</span>
              </div>

              {/* User Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                {user.createdAt && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                {user.lastLoginAt && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Last login: {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <Card className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'profile'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('password')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'password'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Lock className="w-4 h-4 inline mr-2" />
                  Change Password
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <Input
                        {...profileForm.register('firstName')}
                        error={profileForm.formState.errors.firstName?.message}
                        placeholder="John"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <Input
                        {...profileForm.register('lastName')}
                        error={profileForm.formState.errors.lastName?.message}
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      {...profileForm.register('email')}
                      error={profileForm.formState.errors.email?.message}
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="w-4 h-4 inline mr-1" />
                        Team
                      </label>
                      <Input
                        {...profileForm.register('team')}
                        error={profileForm.formState.errors.team?.message}
                        placeholder="Team A"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Region
                      </label>
                      <Input
                        {...profileForm.register('region')}
                        error={profileForm.formState.errors.region?.message}
                        placeholder="North"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={Save}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <Input
                      type="password"
                      {...passwordForm.register('currentPassword')}
                      error={passwordForm.formState.errors.currentPassword?.message}
                      placeholder="Enter your current password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <Input
                      type="password"
                      {...passwordForm.register('newPassword')}
                      error={passwordForm.formState.errors.newPassword?.message}
                      placeholder="Enter new password (min. 6 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <Input
                      type="password"
                      {...passwordForm.register('newPassword_confirmation')}
                      error={passwordForm.formState.errors.newPassword_confirmation?.message}
                      placeholder="Confirm your new password"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Password Requirements:</strong>
                    </p>
                    <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                      <li>Minimum 6 characters</li>
                      <li>Use a combination of letters, numbers, and symbols for better security</li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => passwordForm.reset()}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={Lock}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

