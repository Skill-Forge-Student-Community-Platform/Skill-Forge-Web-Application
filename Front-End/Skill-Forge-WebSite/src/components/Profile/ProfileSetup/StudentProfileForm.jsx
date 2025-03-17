import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Loader, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import TermsAndConditions from '../../Common/TermsAndConditions';
import ProfileCompletionHandler from './ProfileCompletionHandler';
import { compressImage } from '../../../utils/imageCompression';

// Import step components
import BasicInfoStep from './Student/BasicInfoStep';
import EducationStep from './Student/EducationStep';
import SkillsInterestsStep from './Student/SkillsInterestsStep';
import CompetitionPreferencesStep from './Student/CompetitionPreferencesStep';
import ContactSocialStep from './Student/ContactSocialStep';
import ReviewStep from './Student/ReviewStep';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

// Step titles for the progress indicator
const STEPS = [
  "Basic Information",
  "Education Details",
  "Skills & Interests",
  "Competition Preferences",
  "Contact & Social Links",
  "Review & Submit"
];

const StudentProfileForm = () => {
  console.log('StudentProfileForm component mounted');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    console.log('StudentProfileForm rendered with user:', user);
  }, [user]);

  const [formData, setFormData] = useState({
    // Basic Information
    fullName: '',
    bio: '',
    dateOfBirth: '',
    profilePicture: null,

    // Education Details
    education: '',
    school: '',
    graduationYear: new Date().getFullYear(),
    studentId: '',
    fieldOfStudy: '',
    yearOfStudy: '',

    // Skills & Interests
    skills: [],
    interests: [],
    experienceLevel: '',

    // Competition Preferences
    competitionInterests: [],
    preferredCompetitionTypes: [],
    hackathonTeamPreference: '',
    preferredNotifications: [],

    // Contact & Social
    mobileNumber: '',
    backupEmail: '',
    privacyMode: false,
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    },

    // Terms
    termsAccepted: false
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newCompetitionInterest, setNewCompetitionInterest] = useState('');
  const [newCompetitionType, setNewCompetitionType] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Handle basic form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle checkbox arrays (for multiple selection fields)
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = [...prev[field]];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  // Handle social links changes
  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Add new interest
  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  // Remove interest
  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  // Add new competition interest
  const addCompetitionInterest = () => {
    if (newCompetitionInterest.trim() && !formData.competitionInterests.includes(newCompetitionInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        competitionInterests: [...prev.competitionInterests, newCompetitionInterest.trim()]
      }));
      setNewCompetitionInterest('');
    }
  };

  // Remove competition interest
  const removeCompetitionInterest = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      competitionInterests: prev.competitionInterests.filter(item => item !== itemToRemove)
    }));
  };

  // Add new competition type
  const addCompetitionType = () => {
    if (newCompetitionType.trim() && !formData.preferredCompetitionTypes.includes(newCompetitionType.trim())) {
      setFormData(prev => ({
        ...prev,
        preferredCompetitionTypes: [...prev.preferredCompetitionTypes, newCompetitionType.trim()]
      }));
      setNewCompetitionType('');
    }
  };

  // Remove competition type
  const removeCompetitionType = (itemToRemove) => {
    setFormData(prev => ({
      ...prev,
      preferredCompetitionTypes: prev.preferredCompetitionTypes.filter(item => item !== itemToRemove)
    }));
  };

  // Handle profile picture upload with compression
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Compress image before setting it
        const compressedImageDataUrl = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.8
        });

        // Convert base64 to file
        const fetchRes = await fetch(compressedImageDataUrl);
        const blob = await fetchRes.blob();
        const compressedFile = new File([blob], file.name, { type: file.type });

        setFormData(prev => ({ ...prev, profilePicture: compressedFile }));
        setImagePreview(compressedImageDataUrl);

        toast.success('Image compressed and ready for upload');
      } catch (error) {
        console.error('Error compressing image:', error);
        toast.error('Failed to process image');

        // Fallback to uncompressed image
        setFormData(prev => ({ ...prev, profilePicture: file }));

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setImagePreview(null);
  };

  // Navigate to next step
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Jump to specific step
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      window.scrollTo(0, 0);
    }
  };

  // Open terms modal
  const openTermsModal = () => {
    setTermsModalOpen(true);
  };

  // Accept terms handler
  const acceptTerms = () => {
    setFormData(prev => ({ ...prev, termsAccepted: true }));
    setTermsModalOpen(false);
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return formData.fullName.trim() !== '';
      case 1: // Education Details
        return formData.education !== '' && formData.school !== '';
      case 2: // Skills & Interests
        return formData.skills.length > 0 || formData.interests.length > 0;
      case 3: // Competition Preferences
        return true; // Optional step
      case 4: // Contact & Social
        return true; // Optional step except term acceptance which is checked on final submit
      default:
        return true;
    }
  };

  // Form submission with improved error handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!formData.termsAccepted) {
      toast.error('You must accept the terms and conditions to proceed');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create form data object for file upload
      const profileFormData = new FormData();

      // Add profile picture if exists
      if (formData.profilePicture) {
        profileFormData.append('profilePicture', formData.profilePicture);
      }

      // Add other form data as JSON
      const dataToSend = { ...formData };
      delete dataToSend.profilePicture; // Remove file from JSON data
      profileFormData.append('profileData', JSON.stringify(dataToSend));

      console.log("Submitting student profile data...");

      // Use the updateProfile method from authStore
      const response = await updateProfile(profileFormData);
      console.log("Profile update response:", response);

      // Mark profile as completed and show success screen
      toast.success('Student profile created successfully!');
      setProfileCompleted(true);

    } catch (error) {
      console.error('Profile update error:', error);
      const errorMsg = error.message || 'Failed to update profile. Please try again.';
      toast.error(errorMsg);

      // Scroll to top to show error
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step content - using our new components
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            formData={formData}
            handleChange={handleChange}
            handleProfilePictureUpload={handleProfilePictureUpload}
            removeProfilePicture={removeProfilePicture}
            imagePreview={imagePreview}
          />
        );
      case 1:
        return (
          <EducationStep
            formData={formData}
            handleChange={handleChange}
          />
        );
      case 2:
        return (
          <SkillsInterestsStep
            formData={formData}
            handleChange={handleChange}
            newSkill={newSkill}
            setNewSkill={setNewSkill}
            addSkill={addSkill}
            removeSkill={removeSkill}
            newInterest={newInterest}
            setNewInterest={setNewInterest}
            addInterest={addInterest}
            removeInterest={removeInterest}
          />
        );
      case 3:
        return (
          <CompetitionPreferencesStep
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            newCompetitionInterest={newCompetitionInterest}
            setNewCompetitionInterest={setNewCompetitionInterest}
            addCompetitionInterest={addCompetitionInterest}
            removeCompetitionInterest={removeCompetitionInterest}
            newCompetitionType={newCompetitionType}
            setNewCompetitionType={setNewCompetitionType}
            addCompetitionType={addCompetitionType}
            removeCompetitionType={removeCompetitionType}
          />
        );
      case 4:
        return (
          <ContactSocialStep
            formData={formData}
            handleChange={handleChange}
            handleSocialLinkChange={handleSocialLinkChange}
          />
        );
      case 5:
        return (
          <ReviewStep
            formData={formData}
            setCurrentStep={setCurrentStep}
          />
        );
      default:
        return <BasicInfoStep formData={formData} handleChange={handleChange} />;
    }
  };

  // Show profile completion screen if profile is completed
  if (profileCompleted) {
    return <ProfileCompletionHandler role={user.role} userId={user._id} />;
  }

  // Main form layout with progress indicator and step navigation
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3f2ef] to-[#e6f0fa] py-12 px-4 sm:px-8 transition-all duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,75,138,0.1)]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0a66c2] to-[#0052a3] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <h2 className="text-3xl font-bold text-white text-center relative z-10">
              Complete Your Student Profile
            </h2>
            <p className="text-blue-100 text-center mt-3 max-w-xl mx-auto relative z-10">
              Help us personalize your experience and connect you with relevant opportunities tailored to your skills and interests
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-6 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    index > 0 ? 'flex-1' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center w-full">
                    {index > 0 && (
                      <div
                        className={`absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 transition-all duration-300 ${
                          index <= currentStep
                            ? 'bg-gradient-to-r from-[#0a66c2] to-[#0a66c2]/70'
                            : 'bg-gray-200'
                        }`}
                        style={{ width: 'calc(100% - 2rem)', marginLeft: '1rem' }}
                      ></div>
                    )}
                    <button
                      onClick={() => goToStep(index)}
                      disabled={index > currentStep}
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-[#0a66c2] text-white ring-4 ring-blue-100 scale-110 shadow-lg'
                          : index < currentStep
                          ? 'bg-[#0a66c2] text-white shadow-md'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {index + 1}
                    </button>
                  </div>
                  <span
                    className={`hidden md:block mt-3 text-xs font-medium transition-all duration-200 ${
                      index <= currentStep ? 'text-[#0a66c2]' : 'text-gray-500'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit}>
            <div className="p-8 bg-gray-50/50">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="px-8 py-6 bg-white border-t border-gray-100 flex justify-between items-center shadow-inner">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md flex items-center transition-all duration-200 group"
                >
                  <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                  Previous Step
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-200 ${
                    isStepValid()
                      ? 'bg-gradient-to-r from-[#0a66c2] to-[#084b8a] text-white hover:shadow-lg hover:translate-y-[-2px]'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  Continue to Next Step
                  <ArrowRight size={18} className={`ml-2 ${isStepValid() ? 'group-hover:translate-x-1 transition-transform duration-200' : ''}`} />
                </button>
              ) : (
                <div className="flex items-center">
                  <label className="flex items-center mr-4 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={() => !formData.termsAccepted && openTermsModal()}
                      className="w-4 h-4 mr-2 text-blue-600"
                    />
                    <span>I accept the <button type="button" onClick={openTermsModal} className="text-blue-600 underline">Terms and Conditions</button></span>
                  </label>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.termsAccepted}
                    className={`px-7 py-3 rounded-lg font-medium flex items-center transition-all duration-200 ${
                      !isSubmitting && formData.termsAccepted
                        ? 'bg-gradient-to-r from-[#0a66c2] to-[#084b8a] text-white hover:shadow-lg hover:translate-y-[-2px]'
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={18} className="animate-spin mr-2" />
                        Saving Profile...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border-l-4 border-[#0a66c2] flex items-start">
          <div className="bg-blue-50 p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#0a66c2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Complete your profile to unlock all features</h3>
            <p className="text-gray-600 text-sm">
              A complete profile helps you stand out to event organizers and increases your chances of being matched with relevant workshops and opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsAndConditions
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={acceptTerms}
      />
    </div>
  );
};

export default StudentProfileForm;
