import React, { useState, useEffect } from 'react';

import { Upload, Edit, Eye, Plus, Trash } from 'lucide-react';
import Header from '../../navbar/Header';
import Sidebar from '../layout/Sidebar';

const Myresume = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resumeData, setResumeData] = useState({
    personalInfo: { name: '', email: '', phone: '', location: '' },
    education: [],
    workExperience: [],
    skills: [],
    certifications: [],
    resumeFile: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  // Mock data (replace with API call)
  useEffect(() => {
    setIsLoading(true);
    // Simulate API fetch: axios.get('/api/candidate/resume')
    setTimeout(() => {
      setResumeData({
        personalInfo: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '123-456-7890',
          location: 'London, UK',
        },
        education: [
          { id: 1, degree: 'BSc Computer Science', institution: 'University of London', year: '2018-2022' },
        ],
        workExperience: [
          { id: 1, title: 'Software Engineer', company: 'Tech Corp', dates: '2022-Present', description: 'Developed web applications.' },
        ],
        skills: [
          { id: 1, name: 'JavaScript', level: 'Expert' },
          { id: 2, name: 'React', level: 'Intermediate' },
        ],
        certifications: [
          { id: 1, name: 'AWS Certified Developer', issuer: 'Amazon', date: '2023' },
        ],
        resumeFile: null,
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      // Simulate API upload: axios.post('/api/candidate/resume/upload', formData)
      setResumeData({ ...resumeData, resumeFile: file.name });
    } else {
      alert('Please upload a PDF file.');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API update: axios.put('/api/candidate/resume', resumeData)
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  // Add new entry (education, work experience, skills, certifications)
  const addEntry = (section) => {
    const newEntry = {
      id: resumeData[section].length + 1,
      [section === 'education' ? 'degree' : section === 'workExperience' ? 'title' : section === 'skills' ? 'name' : 'name']: '',
      [section === 'education' ? 'institution' : section === 'workExperience' ? 'company' : section === 'skills' ? 'level' : 'issuer']: '',
      [section === 'education' ? 'year' : section === 'workExperience' ? 'dates' : section === 'certifications' ? 'date' : '']: '',
      ...(section === 'workExperience' && { description: '' }),
    };
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], newEntry],
    });
  };

  // Delete entry
  const deleteEntry = (section, id) => {
    setResumeData({
      ...resumeData,
      [section]: resumeData[section].filter((item) => item.id !== id),
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block w-64 bg-gray-900">
          <Sidebar />
        </div>

        {/* Sidebar for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-64 bg-gray-900 text-white z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Resume</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              aria-label={isEditing ? 'Save resume' : 'Edit resume'}
            >
              <Edit size={16} className="mr-2" />
              {isEditing ? 'Save Resume' : 'Edit Resume'}
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Resume File Upload */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Resume File</h2>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center bg-yellow-400 text-[#1E3A8A] px-4 py-2 rounded-lg hover:bg-yellow-500 cursor-pointer transition-colors text-sm"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Resume (PDF)
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload resume PDF"
                  />
                  {resumeFile && (
                    <span className="text-sm text-gray-600">{resumeFile.name}</span>
                  )}
                  {resumeData.resumeFile && (
                    <button
                      className="flex items-center text-blue-600 hover:underline text-sm"
                      onClick={() => alert('Preview resume (implement with PDF viewer)')}
                      aria-label="Preview resume"
                    >
                      <Eye size={16} className="mr-2" />
                      Preview
                    </button>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600">Name</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.name}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, name: e.target.value },
                          })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Email</label>
                      <input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value },
                          })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Phone</label>
                      <input
                        type="tel"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value },
                          })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600">Location</label>
                      <input
                        type="text"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value },
                          })
                        }
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        aria-label="Location"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                      aria-label="Save personal information"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-gray-800">{resumeData.personalInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-800">{resumeData.personalInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-gray-800">{resumeData.personalInfo.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-gray-800">{resumeData.personalInfo.location}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Education</h2>
                  {isEditing && (
                    <button
                      onClick={() => addEntry('education')}
                      className="flex items-center text-blue-600 hover:underline text-sm"
                      aria-label="Add education entry"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </button>
                  )}
                </div>
                {resumeData.education.map((edu) => (
                  <div key={edu.id} className="mb-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                education: resumeData.education.map((item) =>
                                  item.id === edu.id ? { ...item, degree: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Degree"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                education: resumeData.education.map((item) =>
                                  item.id === edu.id ? { ...item, institution: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Institution"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600">Year</label>
                            <input
                              type="text"
                              value={edu.year}
                              onChange={(e) =>
                                setResumeData({
                                  ...resumeData,
                                  education: resumeData.education.map((item) =>
                                    item.id === edu.id ? { ...item, year: e.target.value } : item
                                  ),
                                })
                              }
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              aria-label="Year"
                            />
                          </div>
                          <button
                            onClick={() => deleteEntry('education', edu.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Delete education entry"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-800 font-medium">{edu.degree}</p>
                        <p className="text-sm text-gray-600">{edu.institution}, {edu.year}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Work Experience */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Work Experience</h2>
                  {isEditing && (
                    <button
                      onClick={() => addEntry('workExperience')}
                      className="flex items-center text-blue-600 hover:underline text-sm"
                      aria-label="Add work experience entry"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </button>
                  )}
                </div>
                {resumeData.workExperience.map((exp) => (
                  <div key={exp.id} className="mb-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600">Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                workExperience: resumeData.workExperience.map((item) =>
                                  item.id === exp.id ? { ...item, title: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Job title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                workExperience: resumeData.workExperience.map((item) =>
                                  item.id === exp.id ? { ...item, company: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Company"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600">Dates</label>
                            <input
                              type="text"
                              value={exp.dates}
                              onChange={(e) =>
                                setResumeData({
                                  ...resumeData,
                                  workExperience: resumeData.workExperience.map((item) =>
                                    item.id === exp.id ? { ...item, dates: e.target.value } : item
                                  ),
                                })
                              }
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              aria-label="Dates"
                            />
                          </div>
                          <button
                            onClick={() => deleteEntry('workExperience', exp.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Delete work experience entry"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-sm text-gray-600">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                workExperience: resumeData.workExperience.map((item) =>
                                  item.id === exp.id ? { ...item, description: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            aria-label="Job description"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-800 font-medium">{exp.title}</p>
                        <p className="text-sm text-gray-600">{exp.company}, {exp.dates}</p>
                        <p className="text-sm text-gray-600">{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
                  {isEditing && (
                    <button
                      onClick={() => addEntry('skills')}
                      className="flex items-center text-blue-600 hover:underline text-sm"
                      aria-label="Add skill entry"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                skills: resumeData.skills.map((item) =>
                                  item.id === skill.id ? { ...item, name: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Skill name"
                          />
                          <select
                            value={skill.level}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                skills: resumeData.skills.map((item) =>
                                  item.id === skill.id ? { ...item, level: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Skill level"
                          >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Expert</option>
                          </select>
                          <button
                            onClick={() => deleteEntry('skills', skill.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Delete skill entry"
                          >
                            <Trash size={16} />
                          </button>
                        </>
                      ) : (
                        <div className="flex-1">
                          <p className="text-gray-800">{skill.name} ({skill.level})</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Certifications</h2>
                  {isEditing && (
                    <button
                      onClick={() => addEntry('certifications')}
                      className="flex items-center text-blue-600 hover:underline text-sm"
                      aria-label="Add certification entry"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </button>
                  )}
                </div>
                {resumeData.certifications.map((cert) => (
                  <div key={cert.id} className="mb-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600">Certification</label>
                          <input
                            type="text"
                            value={cert.name}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                certifications: resumeData.certifications.map((item) =>
                                  item.id === cert.id ? { ...item, name: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Certification name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer}
                            onChange={(e) =>
                              setResumeData({
                                ...resumeData,
                                certifications: resumeData.certifications.map((item) =>
                                  item.id === cert.id ? { ...item, issuer: e.target.value } : item
                                ),
                              })
                            }
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            aria-label="Issuer"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-sm text-gray-600">Date</label>
                            <input
                              type="text"
                              value={cert.date}
                              onChange={(e) =>
                                setResumeData({
                                  ...resumeData,
                                  certifications: resumeData.certifications.map((item) =>
                                    item.id === cert.id ? { ...item, date: e.target.value } : item
                                  ),
                                })
                              }
                              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                              aria-label="Certification date"
                            />
                          </div>
                          <button
                            onClick={() => deleteEntry('certifications', cert.id)}
                            className="text-red-600 hover:text-red-700"
                            aria-label="Delete certification entry"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-800 font-medium">{cert.name}</p>
                        <p className="text-sm text-gray-600">{cert.issuer}, {cert.date}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Myresume;