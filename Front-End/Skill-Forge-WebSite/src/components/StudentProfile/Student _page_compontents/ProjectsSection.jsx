import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProjectsSection = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // ✅ Default Project (Image Only Initially)
    const defaultProjects = [
      {
        title: "Enjoy the beauty of the Floating Islands",
        location: "Maldives Islands",
        rating: 5.0,
        price: "$1270",
        image: process.env.PUBLIC_URL + "/images/maldives.jpg",
      },
    ];

    // ✅ Get Saved Projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

    // ✅ Show the first project as default
    const combinedProjects = savedProjects.length > 0 ? savedProjects : defaultProjects;
    setProjects(combinedProjects);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>

      <div className="flex flex-wrap gap-4">
        {/* ✅ Show Only the Image Initially */}
        {projects.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden w-64 h-48">
            <img
              src={projects[0].image}
              alt={projects[0].title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* ✅ "Add More" Section */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center w-64 h-48 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => navigate("/profile/add-project")}
        >
          <p className="text-gray-500 font-medium">+ Add More</p>
        </div>
      </div>

      {/* ✅ View All Projects Button */}
      <div className="mt-4 flex justify-end">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          onClick={() => navigate("/profile/view-projects")}
        >
          View All Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectsSection;
