import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchResume, updateResume } from "../../../store/resumeSlice.js";
import { resumeSections } from "../../../config/resumeConfig.js";
import Header from "../../navbar/Header.jsx";
import Sidebar from "../layout/Sidebar.jsx";

const MyResume = () => {
  const dispatch = useDispatch();
  const { data: resumeData, loading, error } = useSelector((state) => state.resume);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchResume());
  }, [dispatch]);

  useEffect(() => {
    if (resumeData) setEditableData(resumeData);
  }, [resumeData]);

  const updateNestedField = (section, id, key, value) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: prev[section].map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addEntry = (section) => {
    const newEntry = {};
    resumeSections[section].forEach((f) => (newEntry[f.key] = ""));
    newEntry.id = Date.now(); // temporary ID
    setEditableData((prev) => ({
      ...prev,
      [section]: [...(prev[section] || []), newEntry],
    }));
  };

  const removeEntry = (section, id) => {
    setEditableData((prev) => ({
      ...prev,
      [section]: prev[section].filter((item) => item.id !== id),
    }));
  };

  const handleSave = async () => {
    if (editableData) {
      await dispatch(updateResume(editableData));
      setIsEditing(false);
    }
  };

  const renderSection = (sectionKey) => {
    const fields = resumeSections[sectionKey];
    const sectionData = editableData?.[sectionKey];

    if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
      return (
        <p className="text-gray-500">
          No data available.{" "}
          {isEditing && (
            <button
              onClick={() => addEntry(sectionKey)}
              className="ml-2 text-blue-500 underline"
            >
              Add
            </button>
          )}
        </p>
      );
    }

    if (Array.isArray(sectionData)) {
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
                  <label className="block text-sm text-gray-600">{field.label}</label>
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
    }

    // Object-based section
    return fields.map((field) => (
      <div key={field.key} className="mb-2">
        <label className="block text-sm text-gray-600">{field.label}</label>
        {isEditing ? (
          <input
            type={field.type}
            value={sectionData[field.key] || ""}
            onChange={(e) =>
              setEditableData({
                ...editableData,
                [sectionKey]: { ...sectionData, [field.key]: e.target.value },
              })
            }
            className="w-full p-2 border rounded-lg"
          />
        ) : (
          <p>{sectionData[field.key] || "-"}</p>
        )}
      </div>
    ));
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
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
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
          {!loading && !resumeData && <p className="p-4">No resume data found.</p>}

          {editableData &&
            Object.keys(resumeSections).map((sectionKey) => (
              <div key={sectionKey} className="bg-white p-6 rounded shadow mb-4">
                <h2 className="text-lg font-semibold mb-3 capitalize">{sectionKey}</h2>
                {renderSection(sectionKey)}
              </div>
            ))}
        </main>
      </div>
    </div>
  );
};

export default MyResume;
