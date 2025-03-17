import React from "react";
import ProjectsSection from "./ProjectsSection";
import QualificationsSection from "./QualificationsSection";
import "./ProjectsQualificationsContainer.css"; // Ensure this file exists

const ProjectsQualificationsContainer = () => {
  return (
    <div className="projects-qualifications-container">
      <ProjectsSection />
      <QualificationsSection />
    </div>
  );
};

export default ProjectsQualificationsContainer;
