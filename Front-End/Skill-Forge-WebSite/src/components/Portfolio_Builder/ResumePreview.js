import React, { useState, useRef } from "react";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";

function ResumePreview({ formData }) {
  // Define color themes
  const colorThemes = {
    default: {
      header: "bg-gray-50",
      headerText: "text-gray-800",
      headerBorder: "border-gray-200",
      sectionHeading: "text-gray-800 border-gray-300",
      mainText: "text-gray-700",
      secondaryText: "text-gray-600",
      link: "text-blue-600 hover:underline"
    },
    blue: {
      header: "bg-blue-50",
      headerText: "text-blue-900",
      headerBorder: "border-blue-200",
      sectionHeading: "text-blue-800 border-blue-300",
      mainText: "text-blue-800",
      secondaryText: "text-blue-600",
      link: "text-blue-700 hover:underline"
    },
    green: {
      header: "bg-green-50",
      headerText: "text-green-900",
      headerBorder: "border-green-200",
      sectionHeading: "text-green-800 border-green-300",
      mainText: "text-green-800",
      secondaryText: "text-green-600",
      link: "text-green-700 hover:underline"
    },
    purple: {
      header: "bg-purple-50",
      headerText: "text-purple-900",
      headerBorder: "border-purple-200",
      sectionHeading: "text-purple-800 border-purple-300",
      mainText: "text-purple-800",
      secondaryText: "text-purple-600",
      link: "text-purple-700 hover:underline"
    },
    teal: {
      header: "bg-teal-50",
      headerText: "text-teal-900",
      headerBorder: "border-teal-200",
      sectionHeading: "text-teal-800 border-teal-300",
      mainText: "text-teal-800",
      secondaryText: "text-teal-600",
      link: "text-teal-700 hover:underline"
    }
  };

  // State to track the current theme
  const [currentTheme, setCurrentTheme] = useState("default");
  const theme = colorThemes[currentTheme];
  
  // Reference to the resume element
  const resumeRef = useRef(null);
  
  // State to track download status
  const [downloading, setDownloading] = useState(false);

  // Function to handle PDF download
  
  
  const handleDownloadPDF = async () => {
      if (!resumeRef.current) return;
  
      try {
          setDownloading(true);
  
          const resumeElement = resumeRef.current;
          const scale = window.devicePixelRatio || 2; // Adjusts for screen DPI
  
          // Capture the resume as an image with high resolution
          const canvas = await html2canvas(resumeElement, {
              scale: scale, // Ensures high-quality text rendering
              useCORS: true, // Helps with cross-origin images
              backgroundColor: "#ffffff" // Ensures a white background
          });
  
          const imgData = canvas.toDataURL("image/png");
  
          // Create a PDF document
          const pdf = new jsPDF({
              orientation: "portrait",
              unit: "mm",
              format: "a4"
          });
  
          // PDF dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
  
          // Image dimensions
          const imgWidth = pdfWidth;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
          let currentHeight = 0;
  
          while (currentHeight < imgHeight) {
              pdf.addImage(
                  imgData,
                  "PNG",
                  0,
                  currentHeight,
                  imgWidth,
                  Math.min(imgHeight - currentHeight, pdfHeight),
                  "",
                  "FAST"
              );
              currentHeight += pdfHeight;
  
              if (currentHeight < imgHeight) {
                  pdf.addPage();
              }
          }
  
          // Save the PDF with a dynamic file name
          pdf.save(`${formData.fullName.replace(/\s+/g, "_")}_Resume.pdf`);
      } catch (error) {
          console.error("Error generating PDF:", error);
          alert("Failed to generate PDF. Please try again.");
      } finally {
          setDownloading(false);
      }
  };
  

  return (
    <div>
      {/* Color Theme Buttons */}
      <div className="mb-4 flex flex-wrap gap-2 justify-center">
        <button 
          onClick={() => setCurrentTheme("default")}
          className={`px-4 py-2 rounded-md ${currentTheme === "default" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          Default
        </button>
        <button 
          onClick={() => setCurrentTheme("blue")}
          className={`px-4 py-2 rounded-md ${currentTheme === "blue" ? "bg-blue-600 text-white" : "bg-blue-200 text-blue-800"}`}
        >
          Blue
        </button>
        <button 
          onClick={() => setCurrentTheme("green")}
          className={`px-4 py-2 rounded-md ${currentTheme === "green" ? "bg-green-600 text-white" : "bg-green-200 text-green-800"}`}
        >
          Green
        </button>
        <button 
          onClick={() => setCurrentTheme("purple")}
          className={`px-4 py-2 rounded-md ${currentTheme === "purple" ? "bg-purple-600 text-white" : "bg-purple-200 text-purple-800"}`}
        >
          Purple
        </button>
        <button 
          onClick={() => setCurrentTheme("teal")}
          className={`px-4 py-2 rounded-md ${currentTheme === "teal" ? "bg-teal-600 text-white" : "bg-teal-200 text-teal-800"}`}
        >
          Teal
        </button>
      </div>

      {/* Resume Preview */}
      <div 
        ref={resumeRef} 
        className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
      >
        {/* Header Section with dynamic theme */}
        <div className={`${theme.header} p-6 border-b ${theme.headerBorder}`}>
          <h1 className={`text-3xl font-bold ${theme.headerText} text-center`}>{formData.fullName}</h1>
          <div className="mt-2 text-center">
            <p className={theme.secondaryText}>{formData.email} • {formData.phone}</p>
            <p className={`mt-1 ${theme.secondaryText}`}>{formData.address}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          {/* Summary Section */}
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.sectionHeading} pb-2 mb-3 border-b-2`}>PROFESSIONAL SUMMARY</h2>
            <p className={`${theme.mainText} leading-relaxed`}>{formData.summary}</p>
          </div>

          {/* Experience Section */}
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.sectionHeading} pb-2 mb-3 border-b-2`}>WORK EXPERIENCE</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className={`text-lg font-semibold ${theme.mainText}`}>{exp.role}</h3>
                  <span className={`${theme.secondaryText} text-sm`}>{exp.duration}</span>
                </div>
                <p className={`${theme.secondaryText} italic mb-1`}>{exp.company}</p>
                <p className={theme.mainText}>{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Education Section */}
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.sectionHeading} pb-2 mb-3 border-b-2`}>EDUCATION</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <h3 className={`text-lg font-semibold ${theme.mainText}`}>{edu.degree}</h3>
                  <span className={`${theme.secondaryText} text-sm`}>{edu.year}</span>
                </div>
                <p className={`${theme.secondaryText} italic`}>{edu.school}</p>
              </div>
            ))}
          </div>

          {/* Skills Section */}
          <div className="mb-6">
            <h2 className={`text-xl font-bold ${theme.sectionHeading} pb-2 mb-3 border-b-2`}>SKILLS</h2>
            <p className={theme.mainText}>{formData.skills}</p>
          </div>

          {/* Projects Section */}
          <div className="mb-2">
            <h2 className={`text-xl font-bold ${theme.sectionHeading} pb-2 mb-3 border-b-2`}>PROJECTS</h2>
            {formData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <h3 className={`text-lg font-semibold ${theme.mainText}`}>{project.title}</h3>
                <p className={`${theme.mainText} mb-1`}>{project.description}</p>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={theme.link}
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Download Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className={`px-6 py-3 bg-blue-600 text-white rounded-md flex items-center gap-2 hover:bg-blue-700 transition-colors ${downloading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {downloading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download as PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ResumePreview;