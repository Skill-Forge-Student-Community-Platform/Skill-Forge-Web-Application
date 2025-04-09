import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectsSection = ({ userId, projects = [], isEditable = false }) => {
  const navigate = useNavigate();
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    // If we have projects from props, use them
    if (projects && projects.length > 0) {
      setDisplayProjects(projects);
      return;
    }

    // ✅ Default Projects when none are available
    const defaultProjects = [
      {
        id: '1',
        title: 'E-commerce Website',
        description: 'A responsive online store built with React and Node.js',
        image: 'https://via.placeholder.com/600x400?text=E-commerce+Project',
        link: 'https://example.com/project'
      }
    ];

    // ✅ Get Saved Projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // ✅ Show saved or default projects
    const projectsToShow = savedProjects.length > 0 ? savedProjects : defaultProjects;
    setDisplayProjects(projectsToShow);
  }, [projects]);

  const handleViewAll = () => {
    navigate("/profile/projects");
  };

  const handleAddProject = () => {
    navigate("/add-project");
  };

  return (
    <>
      {displayProjects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No projects added yet</p>
          {isEditable && (
            <button
              onClick={handleAddProject}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Your First Project
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayProjects.slice(0, 2).map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {project.image && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.image}

                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                  )}

                  <div className="mt-4 flex justify-between">
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
                      <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <button
              className="text-blue-500 hover:text-blue-700 font-medium"
              onClick={handleViewAll}
            >
              View All Projects
            </button>

            {isEditable && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                onClick={handleAddProject}
              >
                Add New
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ProjectsSection;
