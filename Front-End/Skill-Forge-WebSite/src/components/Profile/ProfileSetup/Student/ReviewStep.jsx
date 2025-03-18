import React from 'react';
import { CheckCircle } from 'lucide-react';

const ReviewStep = ({ formData, setCurrentStep }) => {
  // Helper function to render sections consistently
  const renderSection = (title, content, noBorder) => (
    <div className={`${!noBorder ? "border-b border-gray-200 pb-4 mb-4" : ""}`}>
      <h4 className="font-medium text-gray-700">{title}</h4>
      <div className="mt-2">{content}</div>
    </div>
  );

  // Helper function to render tag-based items (skills, interests, etc.)
  const renderTags = (items, blueThemed = true) => {
    if (!items || items.length === 0) {
      return <span className="text-gray-500 italic">None specified</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={i}
            className={`${
              blueThemed
                ? "bg-[#e7f3ff] text-[#0a66c2]"
                : "bg-[#f5faff] text-[#0a66c2] border border-blue-100"
            } text-xs px-2 py-1 rounded-full`}
          >
            {item}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Review Your Information
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Please review your profile information before submitting. You can go back to any section to make changes.
        </p>

        <div className="space-y-4 divide-y divide-gray-200">
          {/* Basic Information */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {renderSection("Full Name", <p>{formData.fullName || "Not provided"}</p>)}
              {renderSection("Date of Birth", <p>{formData.dateOfBirth || "Not provided"}</p>)}
              {renderSection("Bio",
                <p className="whitespace-pre-line">
                  {formData.bio ? (
                    formData.bio.length > 150 ? `${formData.bio.substring(0, 150)}...` : formData.bio
                  ) : "No bio provided"}
                </p>,
                true
              )}
            </div>
          </div>

          {/* Education */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Education Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {renderSection("Education Level", <p>{formData.education || "Not specified"}</p>)}
              {renderSection("School/University", <p>{formData.school || "Not specified"}</p>)}
              {renderSection("Field of Study", <p>{formData.fieldOfStudy || "Not specified"}</p>)}
              {renderSection("Graduation Year", <p>{formData.graduationYear || "Not specified"}</p>, true)}
            </div>
          </div>

          {/* Skills & Interests */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Skills & Interests</h3>
            <div className="space-y-3">
              {renderSection("Skills", renderTags(formData.skills))}
              {renderSection("Interests", renderTags(formData.interests, false))}
              {renderSection("Experience Level", <p>{formData.experienceLevel || "Not specified"}</p>, true)}
            </div>
          </div>

          {/* Competition Preferences */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Competition Preferences</h3>
            <div className="space-y-3">
              {renderSection("Competition Interests", renderTags(formData.competitionInterests))}
              {renderSection("Preferred Competition Types", renderTags(formData.preferredCompetitionTypes, false))}
              {renderSection("Team Preference", <p>{formData.hackathonTeamPreference || "Not specified"}</p>)}
              {renderSection("Notification Preferences", renderTags(formData.preferredNotifications, false), true)}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {renderSection("Mobile Number", <p>{formData.mobileNumber || "Not provided"}</p>)}
              {renderSection("Backup Email", <p>{formData.backupEmail || "Not provided"}</p>)}
              {renderSection("Privacy Mode", <p>{formData.privacyMode ? "Enabled" : "Disabled"}</p>, true)}
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-700 mb-2">Social Links</h4>
              {Object.entries(formData.socialLinks).some(([_, url]) => url) ? (
                <ul className="list-disc pl-5 space-y-1">
                  {Object.entries(formData.socialLinks).map(([platform, url]) => url && (
                    <li key={platform}>
                      <span className="capitalize">{platform}: </span>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">No social links provided</p>
              )}
            </div>
          </div>
        </div>

        {/* Terms acceptance confirmation */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          {formData.termsAccepted ? (
            <div className="flex items-center text-green-600">
              <CheckCircle size={20} className="mr-2" />
              <span>You have accepted the Terms and Conditions</span>
            </div>
          ) : (
            <div className="flex items-center bg-blue-100 p-3 rounded-lg">
              <div className="mr-3 bg-blue-200 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Please accept the Terms and Conditions in the submission area below before submitting your profile
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                Ready to complete your profile?
              </p>
              <p className="text-xs text-gray-500">
                By clicking "Save Profile" you confirm that all information provided is accurate and you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
