// src/config/resumeConfig.js
export const resumeSections = {
  personalInfo: [
    { key: "fullName", label: "Full Name", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "text" },
    { key: "address", label: "Address", type: "textarea" },
    { key: "linkedin", label: "LinkedIn", type: "text" },
    { key: "github", label: "GitHub", type: "text" },
    { key: "objective", label: "Career Objective", type: "textarea" },
  ],
  education: [
    { key: "degree", label: "Degree", type: "text" },
    { key: "institution", label: "Institution", type: "text" },
    { key: "year", label: "Year", type: "text" },
    { key: "percentage", label: "Percentage / CGPA", type: "text" },
  ],
  projects: [
    { key: "title", label: "Project Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
    { key: "technologies", label: "Technologies Used", type: "text" },
    { key: "link", label: "Project Link", type: "text" },
  ],
  skills: [{ key: "skill", label: "Skill", type: "text" }],
  certifications: [
    { key: "name", label: "Certification Name", type: "text" },
    { key: "authority", label: "Issued By", type: "text" },
    { key: "year", label: "Year", type: "text" },
  ],
  achievements: [
    { key: "title", label: "Title", type: "text" },
    { key: "description", label: "Description", type: "textarea" },
  ],
};
