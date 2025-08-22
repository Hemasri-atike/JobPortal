import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResume, updateResume } from '../../../store/resumeSlice.js';
import { resumeSections } from '../../../config/resumeConfig.js';
import Header from '../../navbar/Header.jsx';
import Sidebar from '../layout/Sidebar.jsx';

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

  // Update editable data when resumeData changes
  useEffect(() => {
    if (resumeData) setEditableData(resumeData);
  }, [resumeData]);

  const updateNestedField = (section, id, key, value) => {
    setEditableData({
      ...editableData,
      [section]: editableData[section].map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    });
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
    if (!sectionData) return <p className="text-gray-500">No data available.</p>;

    // Array-based sections
    if (Array.isArray(sectionData)) {
      return sectionData.map((entry, idx) => (
        <div key={entry.id || idx} className="mb-4">
          {fields.map((field) => (
            <div key={field.key} className="mb-2">
              <label className="block text-sm text-gray-600">{field.label}</label>
              {isEditing ? (
                field.type === 'textarea' ? (
                  <textarea
                    value={entry[field.key] || ''}
                    onChange={(e) => updateNestedField(sectionKey, entry.id, field.key, e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={entry[field.key] || ''}
                    onChange={(e) => updateNestedField(sectionKey, entry.id, field.key, e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  />
                )
              ) : (
                <p>{entry[field.key] || '-'}</p>
              )}
            </div>
          ))}
        </div>
      ));
    }

    // Object-based section (personalInfo)
    return fields.map((field) => (
      <div key={field.key} className="mb-2">
        <label className="block text-sm text-gray-600">{field.label}</label>
        {isEditing ? (
          <input
            type={field.type}
            value={sectionData[field.key] || ''}
            onChange={(e) =>
              setEditableData({
                ...editableData,
                [sectionKey]: { ...sectionData, [field.key]: e.target.value },
              })
            }
            className="w-full p-2 border rounded-lg"
          />
        ) : (
          <p>{sectionData[field.key] || '-'}</p>
        )}
      </div>
    ));
  };

  if (loading) return <p className="p-4">Loading resume...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!editableData) return <p className="p-4">No resume data found.</p>;

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 bg-gray-900 text-white">
          <Sidebar />
        </div>

        {/* Mobile Sidebar */}
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

        {/* Main Content */}
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

          {Object.keys(resumeSections).map((sectionKey) => (
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
