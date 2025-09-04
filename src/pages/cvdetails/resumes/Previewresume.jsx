import React from "react";

const PreviewResume = ({ resumeData, userInfo }) => {
  if (!resumeData || !resumeData.personalInfo?.length) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md text-center text-gray-600">
        No resume data available for preview.
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md text-center text-gray-600">
        User information not available.
      </div>
    );
  }

  const personalInfo = resumeData.personalInfo[0];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        {userInfo.avatar && (
          <img
            src={userInfo.avatar}
            alt={`${userInfo.name || "User"}'s avatar`}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-md"
          />
        )}
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.fullName || userInfo.name || "Your Name"}
        </h1>
        <div className="flex justify-center gap-4 text-gray-600 text-sm mt-2">
          {personalInfo.email && (
            <a
              href={`mailto:${personalInfo.email}`}
              className="hover:text-indigo-600 transition-colors"
              aria-label={`Email ${personalInfo.email}`}
            >
              {personalInfo.email}
            </a>
          )}
          {personalInfo.phone && (
            <span aria-label={`Phone number ${personalInfo.phone}`}>
              {personalInfo.phone}
            </span>
          )}
          {personalInfo.linkedin && (
            <a
              href={personalInfo.linkedin}
              className="hover:text-indigo-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a
              href={personalInfo.github}
              className="hover:text-indigo-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              GitHub
            </a>
          )}
        </div>
        {personalInfo.address && (
          <p className="text-gray-600 text-sm mt-1" aria-label="Address">
            {personalInfo.address}
          </p>
        )}
      </div>

      {personalInfo.objective && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Objective
          </h2>
          <p className="text-gray-700">{personalInfo.objective}</p>
        </div>
      )}

      {resumeData.education?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Education
          </h2>
          {resumeData.education.map((edu) => (
            <div key={edu.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-gray-500 text-sm">
                {edu.year} {edu.percentage && `• ${edu.percentage}%`}
              </p>
            </div>
          ))}
        </div>
      )}

      {resumeData.projects?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Projects
          </h2>
          {resumeData.projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">{proj.title}</h3>
              <p className="text-gray-600">{proj.description}</p>
              <p className="text-gray-500 text-sm">{proj.technologies}</p>
              {proj.link && (
                <a
                  href={proj.link}
                  className="text-indigo-600 hover:text-indigo-800 text-sm transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Project link for ${proj.title}`}
                >
                  {proj.link}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {resumeData.skills?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resumeData.skills.map((skill) => (
              <div key={skill.id} className="text-gray-700">
                {skill.skill}{" "}
                {skill.proficiency && (
                  <span className="text-gray-500 text-sm">({skill.proficiency})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resumeData.certifications?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Certifications
          </h2>
          {resumeData.certifications.map((cert) => (
            <div key={cert.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">{cert.name}</h3>
              <p className="text-gray-600">{cert.authority}</p>
              <p className="text-gray-500 text-sm">{cert.year}</p>
            </div>
          ))}
        </div>
      )}

      {resumeData.achievements?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
            Achievements
          </h2>
          {resumeData.achievements.map((ach) => (
            <div key={ach.id} className="mb-4">
              <h3 className="text-lg font-medium text-gray-800">{ach.title}</h3>
              <p className="text-gray-600">{ach.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviewResume;