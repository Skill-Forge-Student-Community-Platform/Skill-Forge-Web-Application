import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import StudentProfileOwnerView from './student_layout_pages/StudentProfileOwnerView';
import StudentProfileVisitorView from './student_layout_pages/StudentProfileVisitorView';
import ViewAllProjects from './student_layout_pages/ViewAllProjects';
import ViewAllPosts from './student_layout_pages/ViewAllPosts';
import CertificatePreviewPage from './student_layout_pages/certificatepreviewpage';
import AddCertificateForm from './Student _page_compontents/AddCertificateForm';
import { useAuthStore } from '../../store/authStore';
import useUserProfile from '../../hooks/useUserProfile';

const StudentProfilePage = ({ user, isOwnProfile = false }) => {
  const { profileId } = useParams();
  const { user: authUser } = useAuthStore();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Set the correct userId for the profile
  useEffect(() => {
    if (isOwnProfile && authUser) {
      setUserId(authUser._id);
      setLoading(false);
    } else if (profileId) {
      setUserId(profileId);
      setLoading(false);
    } else if (user && user._id) {
      setUserId(user._id);
      setLoading(false);
    }
  }, [isOwnProfile, authUser, profileId, user]);

  // Use the hook to fetch profile data
  const {
    fullName,
    getProfileImage,
    isLoading: profileLoading,
    error,
    projects,
    qualifications,
    posts,
    // Additional data you might need
    bio,
    school,
    education,
    location: userLocation,
  } = useUserProfile(userId);

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold">Error loading profile</p>
          <p>{error.message || 'Something went wrong'}</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  // Combine profile data
  const profileData = {
    fullName: fullName || 'Student',
    profileImage: getProfileImage ? getProfileImage() : null,
    bio,
    school,
    education,
    location: userLocation,
    projects: projects || [],
    qualifications: qualifications || [],
    posts: posts || [],
  };

  // Add a helper function to get the base path for navigation
  const getBasePath = () => {
    const authUser = useAuthStore.getState().user;
    if (!authUser) return '';

    const roleForUrl = authUser.role.charAt(0).toUpperCase() + authUser.role.slice(1);
    return `/${roleForUrl}/${authUser._id}`;
  };

  return (
    <div className="student-profile-container bg-gray-50 min-h-screen">
      <Routes>
        <Route path="/" element={
          isOwnProfile ? (
            <StudentProfileOwnerView
              userId={userId}
              profileData={profileData}
              basePath={getBasePath()}
            />
          ) : (
            <StudentProfileVisitorView
              userId={userId}
              fullName={profileData.fullName}
              profileImage={profileData.profileImage}
              basePath={getBasePath()}
            />
          )
        } />
        <Route path="projects" element={
          <ViewAllProjects
            projects={profileData.projects}
            userId={userId}
            isOwnProfile={isOwnProfile}
          />
        } />
        <Route path="posts" element={
          <ViewAllPosts
            posts={profileData.posts}
            userId={userId}
            isOwnProfile={isOwnProfile}
          />
        } />
        <Route path="certificates/:certificateId" element={
          <CertificatePreviewPage userId={userId} isOwnProfile={isOwnProfile} />
        } />
        <Route path="add-certificate" element={
          isOwnProfile ? <AddCertificateForm /> : <Navigate to="/" replace />
        } />
        {/* Redirect any other paths to the main profile */}
        <Route path="*" element={<Navigate to="." replace />} />
      </Routes>
    </div>
  );
};

export default StudentProfilePage;
