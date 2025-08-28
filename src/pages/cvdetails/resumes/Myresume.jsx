import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResume, createResume, updateResume } from "../../../store/resumeSlice.js";

import { resumeSections } from "../../../config/resumeConfig.js";
import Header from "../../navbar/Header.jsx";
import Sidebar from "../layout/Sidebar.jsx";

const MyResume = () => {
  const dispatch = useDispatch();
  const { data: resumeData, loading, error } = useSelector((state) => state.resume);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch resume on mount
  useEffect(() => {
    dispatch(fetchResume());
  }, [dispatch]);

  // Update editableData when resumeData changes
  useEffect(() => {
    if (resumeData) setEditableData(resumeData);
  }, [resumeData]);

  // Update nested field
  const updateNestedField = (section, id, key, value) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  // Add new entry
  const addEntry = (section) => {
    const newEntry = { id: Date.now() };
    resumeSections[section].forEach((f) => (newEntry[f.key] = ""));
    setEditableData((prev) => ({
      ...prev,
      [section]: [...(prev?.[section] || []), newEntry],
    }));
  };

  // Remove entry
  const removeEntry = (section, id) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  // Save (Update or Create)
  const handleSave = async () => {
    if (!editableData) return;

    let resultAction;
    if (resumeData) {
      // Resume exists → Update
      resultAction = await dispatch(updateResume({ resumeData: editableData }));
    } else {
      // Resume not found → Create new
      resultAction = await dispatch(createResume({ resumeData: editableData }));
    }

    if (
      (updateResume.fulfilled && updateResume.fulfilled.match(resultAction)) ||
      (createResume.fulfilled && createResume.fulfilled.match(resultAction))
    ) {
      setEditableData(resultAction.payload);
      setIsEditing(false);
    } else {
      alert("Failed to save resume: " + resultAction.payload);
    }
  };

  // Render each section
  const renderSection = (sectionKey) => {
    const fields = resumeSections[sectionKey];
    const sectionData = editableData?.[sectionKey];

    if (!sectionData || sectionData.length === 0) {
      return isEditing ? (
        <p className="text-gray-500">
          No data available.{" "}
          <button
            onClick={() => addEntry(sectionKey)}
            className="ml-2 text-blue-500 underline"
          >
            Add
          </button>
        </p>
      ) : (
        <p className="text-gray-500">No data available.</p>
      );
    }

    return (
      <div>
        {sectionData.map((entry) => (
          <div key={entry.id} className="mb-4 border p-3 rounded relative">
            {isEditing && (
              <button
                onClick={() => removeEntry(sectionKey, entry.id)}
                className="absolute top-2 right-2 text-red-500 font-bold"
              >
                X
              </button>
            )}
            {fields.map((field) => (
              <div key={field.key} className="mb-2">
                <label className="block text-sm text-gray-600">
                  {field.label}
                </label>
                {isEditing ? (
                  field.type === "textarea" ? (
                    <textarea
                      value={entry[field.key] || ""}
                      onChange={(e) =>
                        updateNestedField(sectionKey, entry.id, field.key, e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={entry[field.key] || ""}
                      onChange={(e) =>
                        updateNestedField(sectionKey, entry.id, field.key, e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  )
                ) : (
                  <p>{entry[field.key] || "-"}</p>
                )}
              </div>
            ))}
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() => addEntry(sectionKey)}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            + Add {sectionKey}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative">
        <div className="hidden lg:block w-64 bg-gray-900 text-white">
          <Sidebar />
        </div>

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

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="flex justify-between mb-4">
            <h1 className="text-xl font-bold">My Resume</h1>
            {!isEditing ? (
              resumeData ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditableData(
                      Object.fromEntries(
                        Object.keys(resumeSections).map((key) => [key, []])
                      )
                    );
                    setIsEditing(true);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Create Resume
                </button>
              )
            ) : (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            )}
          </div>

          {loading && <p className="p-4">Loading resume...</p>}
          {error && <p className="p-4 text-red-500">{error}</p>}
          {!loading && !resumeData && !isEditing && (
            <p className="p-4">No resume data found. Please create one.</p>
          )}

          {editableData &&
            Object.keys(resumeSections).map((sectionKey) => (
              <div
                key={sectionKey}
                className="bg-white p-6 rounded shadow mb-4"
              >
                <h2 className="text-lg font-semibold mb-3 capitalize">
                  {sectionKey}
                </h2>
                {renderSection(sectionKey)}
              </div>
            ))}
        </main>
      </div>
    </div>
  );
};

export default MyResume;
