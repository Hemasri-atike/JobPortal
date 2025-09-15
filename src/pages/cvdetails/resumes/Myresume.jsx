import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResume, updateResume, clearError } from "../../../store/resumeSlice.js";
import { resumeSections } from "../../../config/resumeConfig.js";
import Header from "../../navbar/Header.jsx";
import Sidebar from "../layout/Sidebar.jsx";
import PreviewResume from "./Previewresume.jsx";

const MyResume = () => {
  const dispatch = useDispatch();
  const { data: resumeData, loading, error } = useSelector((state) => state.resume);
  console.log("slice data",resumeData)
  const { userInfo } = useSelector((state) => state.user);
  console.log("user details",userInfo)
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [editableData, setEditableData] = useState(null);
  console.log("sfd",editableData)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchResume());
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (resumeData) {
      setEditableData(structuredClone(resumeData));
    }
  }, [resumeData]);

  const updateNestedField = (section, id, key, value) => {
    console.log("section",section,key,value)
    setEditableData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
    setFormErrors((prev) => ({ ...prev, [`${section}-${id}-${key}`]: "" }));
  };

  const addEntry = (section) => {
    const newEntry = { id: Date.now() };
    resumeSections[section].forEach((f) => (newEntry[f.key] = ""));
    setEditableData((prev) => ({
      ...prev,
      [section]: [...(prev?.[section] || []), newEntry],
    }));
  };

  const removeEntry = (section, id) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!editableData || !editableData.personalInfo || editableData.personalInfo.length !== 1) {
      errors.global = "Personal Information must have exactly one entry.";
      isValid = false;
    }

    Object.keys(resumeSections).forEach((sectionKey) => {
      const fields = resumeSections[sectionKey];
      const sectionData = editableData?.[sectionKey] || [];

      sectionData.forEach((entry) => {
        fields.forEach((field) => {
          const value = entry[field.key];
          const fieldId = `${sectionKey}-${entry.id}-${field.key}`;

          if (field.required && !value) {
            errors[fieldId] = `${field.label} is required`;
            isValid = false;
          }
          if (field.pattern && value) {
            try {
              if (!new RegExp(field.pattern).test(value)) {
                errors[fieldId] = `Invalid ${field.label} format`;
                isValid = false;
              }
            } catch (e) {
              console.error(`Invalid regex for ${field.label}: ${field.pattern}`, e);
              errors[fieldId] = `Validation error for ${field.label}`;
              isValid = false;
            }
          }
          if (field.maxLength && value && value.length > field.maxLength) {
            errors[fieldId] = `${field.label} exceeds ${field.maxLength} characters`;
            isValid = false;
          }
          if (field.min && value && !isNaN(Number(value)) && Number(value) < field.min) {
            errors[fieldId] = `${field.label} must be at least ${field.min}`;
            isValid = false;
          }
          if (field.max && value && !isNaN(Number(value)) && Number(value) > field.max) {
            errors[fieldId] = `${field.label} must not exceed ${field.max}`;
            isValid = false;
          }
        });
      });
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async () => {
    if (!editableData || saving) {
      setFormErrors({ global: "No data to save or save in progress" });
      return;
    }

    if (!localStorage.getItem("token") || !userInfo) {
      setFormErrors({ global: "You must be logged in to save your resume" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      console.log("edit",editableData)
      const resultAction = await dispatch(updateResume(editableData));
      if (updateResume.fulfilled.match(resultAction)) {
        setEditableData(resultAction.payload);
        setIsEditing(false);
        setIsPreview(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        dispatch(clearError());
      } else {
        setFormErrors({ global: resultAction.payload || "Failed to save resume" });
      }
    } catch (error) {
      setFormErrors({ global: error.message || "Unexpected error occurred while saving resume" });
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (sectionKey) => {
    const fields = resumeSections[sectionKey];
    const sectionData = editableData?.[sectionKey] || [];

    if (sectionData.length === 0) {
      return isEditing ? (
        <div className="text-gray-500 text-sm flex items-center gap-2">
          No data available.
          {sectionKey !== "personalInfo" && (
            <button
              onClick={() => addEntry(sectionKey)}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
              aria-label={`Add new ${sectionKey} entry`}
            >
              Add {sectionKey.replace(/([A-Z])/g, " $1").trim()}
            </button>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No data available.</p>
      );
    }

    return (
      <div className="space-y-6">
        {sectionData.map((entry) => (
          <div
            key={entry.id}
            className="relative bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg"
          >
            {isEditing && sectionKey !== "personalInfo" && (
              <button
                onClick={() => removeEntry(sectionKey, entry.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                aria-label={`Remove ${sectionKey} entry`}
              >
                ×
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => {
                const fieldId = `${sectionKey}-${entry.id}-${field.key}`;
                const errorMessage = formErrors[fieldId];

                return (
                  <div key={field.key} className="mb-4">
                    <label
                      htmlFor={fieldId}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {isEditing ? (
                      field.type === "textarea" ? (
                        <textarea
                          id={fieldId}
                          value={entry[field.key] || ""}
                          onChange={(e) =>
                            updateNestedField(sectionKey, entry.id, field.key, e.target.value)
                          }
                          className={`w-full p-3 border ${
                            errorMessage ? "border-red-500" : "border-gray-200"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y shadow-sm`}
                          rows="4"
                          maxLength={field.maxLength}
                          placeholder={field.placeholder}
                          required={field.required}
                          aria-invalid={!!errorMessage}
                          aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
                        />
                      ) : field.type === "select" ? (
                        <select
                          id={fieldId}
                          value={entry[field.key] || ""}
                          onChange={(e) =>
                            updateNestedField(sectionKey, entry.id, field.key, e.target.value)
                          }
                          className={`w-full p-3 border ${
                            errorMessage ? "border-red-500" : "border-gray-200"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm`}
                          required={field.required}
                          aria-invalid={!!errorMessage}
                          aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
                        >
                          <option value="" disabled>
                            {field.placeholder}
                          </option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          id={fieldId}
                          type={field.type}
                          value={entry[field.key] || ""}
                          onChange={(e) =>
                            updateNestedField(sectionKey, entry.id, field.key, e.target.value)
                          }
                          className={`w-full p-3 border ${
                            errorMessage ? "border-red-500" : "border-gray-200"
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm`}
                          maxLength={field.maxLength}
                          placeholder={field.placeholder}
                          required={field.required}
                          pattern={field.pattern}
                          min={field.min}
                          max={field.max}
                          aria-invalid={!!errorMessage}
                          aria-describedby={errorMessage ? `${fieldId}-error` : undefined}
                        />
                      )
                    ) : (
                      <p className="text-gray-800">{entry[field.key] || "-"}</p>
                    )}
                    {errorMessage && (
                      <p id={`${fieldId}-error`} className="text-red-500 text-xs mt-1">
                        {errorMessage}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {isEditing && sectionKey !== "personalInfo" && (
          <button
            onClick={() => addEntry(sectionKey)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            aria-label={`Add new ${sectionKey} entry`}
          >
            + Add {sectionKey.replace(/([A-Z])/g, " $1").trim()}
          </button>
        )}
      </div>
    );
  };

  const initializeResumeData = () => ({
    personalInfo: [
      {
        id: Date.now(),
        fullName: userInfo?.name || "",
        email: userInfo?.email || "",
        phone: userInfo?.mobile || "",
        address: "",
        linkedin: "",
        github: "",
        objective: "",
      },
    ],
    education: [],
    experience: [],
    projects: [],
    skills: [],
    certifications: [],
    achievements: [],
  });

  if (!userInfo && (isPreview || isEditing)) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-md text-center text-gray-600">
        Please log in to view or edit your resume.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <div className="hidden lg:block w-72 text-white shadow-2xl">
          <Sidebar />
        </div>
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-40 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          >
            <div
              className="absolute left-0 top-0 h-full w-72 bg-indigo-900 text-white z-50 transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                  {userInfo ? `${userInfo.name}'s Resume` : "My Resume"}
                </h1>
                {userInfo && (
                  <div className="mt-3 flex items-center gap-3">
                    {userInfo.avatar && (
                      <img
                        src={userInfo.avatar}
                        alt={`${userInfo.name || "User"}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover shadow-sm"
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 text-sm font-medium">
                        {userInfo.name || "User"}
                      </span>
                      <span className="text-gray-400 text-sm">•</span>
                      <a
                        href={`mailto:${userInfo.email}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                      >
                        {userInfo.email || "No email provided"}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                {!isEditing && !isPreview && resumeData && (
                  <button
                    onClick={() => setIsPreview(true)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
                    aria-label="Preview resume"
                  >
                    Preview Resume
                  </button>
                )}
                {isPreview && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsPreview(false)}
                      className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
                      aria-label="Back to view"
                    >
                      Back to View
                    </button>
                    <button
                      onClick={() => {
                        setIsPreview(false);
                        setIsEditing(true);
                      }}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
                      aria-label="Edit resume"
                    >
                      Edit Resume
                    </button>
                  </div>
                )}
                {!isEditing && !isPreview && (
                  resumeData ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md"
                      aria-label="Edit resume"
                    >
                      Edit Resume
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditableData(initializeResumeData());
                        setIsEditing(true);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md"
                      aria-label="Create resume"
                    >
                      Create Resume
                    </button>
                  )
                )}
                {isEditing && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditableData(resumeData ? structuredClone(resumeData) : null);
                        setFormErrors({});
                      }}
                      className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 shadow-md"
                      aria-label="Cancel editing"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md ${
                        saving ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      aria-label="Save resume"
                    >
                      {saving ? "Saving..." : "Save Resume"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showSuccess && (
            <div className="bg-green-50 border-l-4 border-green-600 text-green-800 p-4 rounded-lg mb-10 animate-slide-down">
              Resume saved successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg mb-10 flex justify-between items-center animate-slide-down">
              <span>{error}</span>
              <button
                onClick={() => dispatch(clearError())}
                className="text-red-800 hover:text-red-900 font-medium focus:outline-none focus:underline"
                aria-label="Dismiss error"
              >
                Dismiss
              </button>
            </div>
          )}

          {formErrors.global && (
            <div className="bg-red-50 border-l-4 border-red-600 text-red-800 p-4 rounded-lg mb-10 animate-slide-down">
              {formErrors.global}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
              <p className="ml-4 text-gray-600 text-lg font-medium">Loading resume...</p>
            </div>
          )}

          {!loading && !resumeData && !isEditing && !isPreview && (
            <div className="bg-white p-8 rounded-2xl shadow-md text-center text-gray-600">
              No resume data found. Click "Create Resume" to get started.
            </div>
          )}

          {!editableData && isEditing ? (
            <div className="bg-white p-8 rounded-2xl shadow-md text-center text-gray-600">
              Initializing resume data...
            </div>
          ) : isPreview && resumeData ? (
            <PreviewResume resumeData={resumeData} userInfo={userInfo} />
          ) : editableData && !isEditing ? (
            <div className="space-y-10">
              {Object.keys(resumeSections).map((sectionKey) => (
                <div
                  key={sectionKey}
                  className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 capitalize tracking-tight border-b border-gray-200 pb-2">
                    {sectionKey.replace(/([A-Z])/g, " $1").trim()}
                  </h2>
                  {renderSection(sectionKey)}
                </div>
              ))}
            </div>
          ) : (
            editableData && (
              <div className="space-y-10">
                {Object.keys(resumeSections).map((sectionKey) => (
                  <div
                    key={sectionKey}
                    className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl"
                  >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 capitalize tracking-tight border-b border-gray-200 pb-2">
                      {sectionKey.replace(/([A-Z])/g, " $1").trim()}
                    </h2>
                    {renderSection(sectionKey)}
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default MyResume;