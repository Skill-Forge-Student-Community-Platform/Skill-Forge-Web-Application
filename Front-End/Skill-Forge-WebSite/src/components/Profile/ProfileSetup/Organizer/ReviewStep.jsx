import React from 'react';
import { CheckCircle } from 'lucide-react';

const ReviewStep = ({ formData }) => {
  const renderSection = (title, content, noBorder) => (
    <div className={`${!noBorder ? "border-b border-gray-200 pb-4 mb-4" : ""}`}>
      <h4 className="font-medium text-gray-700">{title}</h4>
      <div className="mt-2">{content}</div>
    </div>
  );

  const renderList = (items) => {
    if (!items || items.length === 0) {
      return <span className="text-gray-500 italic">None specified</span>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="bg-gray-100 px-2 py-1 rounded-md text-sm">
            {item}
          </span>
        ))}
      </div>
    );
  };

  const renderSocialLinks = () => {
    const socialLinks = formData.socialLinks || {};
    const links = [
      { name: 'LinkedIn', url: socialLinks.linkedin },
      { name: 'Facebook', url: socialLinks.facebook },
      { name: 'Twitter', url: socialLinks.twitter },

      { name: 'Instagram', url: socialLinks.instagram }
    ].filter(link => link.url);

    if (links.length === 0) {
      return <span className="text-gray-500 italic">No social links provided</span>;
    }

    return (
      <ul className="list-disc pl-5 space-y-1">
        {links.map((link, i) => (
          <li key={i}>
            <span>{link.name}: </span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {link.url}
            </a>
          </li>
        ))}
      </ul>
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
          {/* Basic Organization Info */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Basic Organization Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {renderSection("Organization Name", <p>{formData.organizationName || "Not provided"}</p>)}

              {renderSection("Industry", <p>{formData.industry || "Not specified"}</p>)}

              {renderSection("Your Position", <p>{formData.position || "Not provided"}</p>)}

              {renderSection("Organizer Type", <p>{formData.organizerType || "Not specified"}</p>)}

              {renderSection("Bio / About",
                <p className="whitespace-pre-line">{formData.bio || "No bio provided"}</p>,
                true
              )}
            </div>
          </div>

          {/* Expertise */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Areas of Expertise</h3>
            {renderList(formData.expertise)}
          </div>

          {/* Event Preferences */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Event Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {renderSection("Preferred Event Types", renderList(formData.preferredEventTypes))}

              {renderSection("Expected Participants",
                <p>{formData.expectedParticipantsRange || "Not specified"}</p>
              )}

              {renderSection("Event Format",
                <p>{formData.eventFormatPreference || "Not specified"}</p>,
                true
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {renderSection("Contact Email",
                <p>{formData.contactEmail || "Not provided"}</p>
              )}

              {renderSection("Contact Phone",
                <p>{formData.contactPhone || "Not provided"}</p>
              )}

              {renderSection("Mobile Number",
                <p>{formData.mobileNumber || "Not provided"}</p>
              )}

              {renderSection("Website",
                formData.website ? (
                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {formData.website}
                  </a>
                ) : <span className="text-gray-500 italic">Not provided</span>,
                true
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Social Media Links</h3>
            {renderSocialLinks()}
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
