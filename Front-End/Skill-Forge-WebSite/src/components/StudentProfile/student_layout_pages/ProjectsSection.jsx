import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const ProjectsSection = ({ projects = [], userId, isEditable = false, isLimitedView = true, basePath = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Generate correct paths based on user role and ID
  const getCorrectPath = (path) => {
    if (basePath) return `${basePath}/${path}`;

    // Fallback if basePath wasn't provided
    const roleType = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);
    return `/${roleType}/${user?._id}/${path}`;
  };

  // Handle view all projects
  const handleViewAllProjects = () => {
    navigate(getCorrectPath('profile/projects'));
  };

  // Handle add project
  const handleAddProject = () => {
    navigate(getCorrectPath('add-project'));
  };

  // If no projects, show a message for adding projects
  if (!projects || projects.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Projects</h2>
          {isEditable && (
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm"
              onClick={handleAddProject}
            >
              Add Project
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {isEditable
              ? "You haven't added any projects yet."
              : "This user hasn't added any projects yet."}
          </p>
          {isEditable && (
            <button
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              onClick={handleAddProject}
            >
              Add Your First Project
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show limited projects with view all button
  const displayProjects = isLimitedView ? projects.slice(0, 2) : projects;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Projects</h2>
        <div className="flex gap-2">
          {isLimitedView && projects.length > 2 && (
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors text-sm"
              onClick={handleViewAllProjects}
            >
              View All
            </button>
          )}
          {isEditable && (
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm"
              onClick={handleAddProject}
            >
              Add Project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayProjects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="h-48 bg-gray-200 relative">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{project.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
              <div className="flex justify-between items-center">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    View Project
                  </a>
                )}
                {isEditable && (
                  <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm">
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
