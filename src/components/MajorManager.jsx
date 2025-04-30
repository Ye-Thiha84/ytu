import React, { useEffect, useState } from 'react';
import { fetchMajors, createMajor, updateMajor, deleteMajor } from '../lib/fetchMajors';
import "../styles/global.css";

const MajorManager = () => {
  const [majors, setMajors] = useState([]);
  const [newMajor, setNewMajor] = useState({ slug: '', description: '', category: '', career_opportunities: '', why_choose: '' });
  const [editingMajor, setEditingMajor] = useState(null);
  const [error, setError] = useState(null);

  // Fetch majors on mount
  useEffect(() => {
    const loadMajors = async () => {
      try {
        const data = await fetchMajors();
        setMajors(data);
      } catch (err) {
        setError('Failed to load majors.');
      }
    };
    loadMajors();
  }, []);

  // Handle form input changes for new major
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMajor((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form input changes for editing major
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMajor((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new major
  const handleAddMajor = async (e) => {
    e.preventDefault();
    try {
      // Convert career_opportunities from comma-separated string to array
      const careerOpportunities = newMajor.career_opportunities
        ? newMajor.career_opportunities.split(',').map(item => item.trim()).filter(item => item)
        : [];
      
      const majorToCreate = {
        slug: newMajor.slug,
        description: newMajor.description,
        category: newMajor.category,
        career_opportunities: careerOpportunities,
        why_choose: newMajor.why_choose,
      };

      const createdMajor = await createMajor(majorToCreate);
      setMajors((prev) => [...prev, createdMajor]);
      setNewMajor({ slug: '', description: '', category: '', career_opportunities: '', why_choose: '' }); // Reset form
      setError(null);
    } catch (err) {
      setError('Failed to add major: ' + err.message);
    }
  };

  // Start editing a major
  const handleEditMajor = (major) => {
    setEditingMajor({
      ...major,
      career_opportunities: major.career_opportunities ? major.career_opportunities.join(', ') : '',
    });
  };

  // Save edited major
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      // Convert career_opportunities from comma-separated string to array
      const careerOpportunities = editingMajor.career_opportunities
        ? editingMajor.career_opportunities.split(',').map(item => item.trim()).filter(item => item)
        : [];

      const majorToUpdate = {
        slug: editingMajor.slug,
        description: editingMajor.description,
        category: editingMajor.category,
        career_opportunities: careerOpportunities,
        why_choose: editingMajor.why_choose,
      };

      const updatedMajor = await updateMajor(editingMajor.id, majorToUpdate);
      setMajors((prev) =>
        prev.map((major) => (major.id === updatedMajor.id ? updatedMajor : major))
      );
      setEditingMajor(null); // Close edit form
      setError(null);
    } catch (err) {
      setError('Failed to update major: ' + err.message);
    }
  };

  // Delete a major
  const handleDeleteMajor = async (id) => {
    try {
      await deleteMajor(id);
      setMajors((prev) => prev.filter((major) => major.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete major.');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white text-black">
      <h1 className="text-2xl font-bold mb-4">Manage Majors</h1>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Add New Major Form */}
      <div className="mb-6 p-4 bg-white rounded">
        <h2 className="text-lg font-semibold mb-2">Add New Major</h2>
        <div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Slug</label>
            <input
              type="text"
              name="slug"
              value={newMajor.slug}
              onChange={handleInputChange}
              className="border p-2 w-full rounded text-black"
              placeholder="Enter slug"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={newMajor.description}
              onChange={handleInputChange}
              className="border p-2 w-full rounded text-black"
              placeholder="Enter description"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Category</label>
            <select
              name="category"
              value={newMajor.category}
              onChange={handleInputChange}
              className="border p-2 w-full rounded text-black"
            >
              <option value="">Select category</option>
              <option value="science">Science</option>
              <option value="art">Art</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Career Opportunities (comma-separated)</label>
            <input
              type="text"
              name="career_opportunities"
              value={newMajor.career_opportunities}
              onChange={handleInputChange}
              className="border p-2 w-full rounded text-black"
              placeholder="e.g., Teacher, Researcher, Engineer"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Why Choose This Major?</label>
            <textarea
              name="why_choose"
              value={newMajor.why_choose}
              onChange={handleInputChange}
              className="border p-2 w-full rounded text-black"
              placeholder="Enter reason to choose this major"
            />
          </div>
          <button
            onClick={handleAddMajor}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Major
          </button>
        </div>
      </div>

      {/* Edit Major Form (shown when editingMajor is set) */}
      {editingMajor && (
        <div className="mb-6 p-4 bg-white rounded">
          <h2 className="text-lg font-semibold mb-2">Edit Major</h2>
          <div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Slug</label>
              <input
                type="text"
                name="slug"
                value={editingMajor.slug}
                onChange={handleEditInputChange}
                className="border p-2 w-full rounded text-black"
                placeholder="Enter slug"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                value={editingMajor.description}
                onChange={handleEditInputChange}
                className="border p-2 w-full rounded text-black"
                placeholder="Enter description"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Category</label>
              <select
                name="category"
                value={editingMajor.category || ''}
                onChange={handleEditInputChange}
                className="border p-2 w-full rounded text-black"
              >
                <option value="">Select category</option>
                <option value="science">Science</option>
                <option value="art">Art</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Career Opportunities (comma-separated)</label>
              <input
                type="text"
                name="career_opportunities"
                value={editingMajor.career_opportunities}
                onChange={handleEditInputChange}
                className="border p-2 w-full rounded text-black"
                placeholder="e.g., Teacher, Researcher, Engineer"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium">Why Choose This Major?</label>
              <textarea
                name="why_choose"
                value={editingMajor.why_choose || ''}
                onChange={handleEditInputChange}
                className="border p-2 w-full rounded text-black"
                placeholder="Enter reason to choose this major"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setEditingMajor(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Majors Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white">
            <th className="border p-2 text-left">Slug</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Category</th>
            <th className="border p-2 text-left">Career Opportunities</th>
            <th className="border p-2 text-left">Why Choose</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {majors.length > 0 ? (
            majors.map((major) => (
              <tr key={major.id} className="border-b">
                <td className="border p-2">{major.slug}</td>
                <td className="border p-2">{major.description}</td>
                <td className="border p-2">{major.category || 'N/A'}</td>
                <td className="border p-2">
                  {major.career_opportunities && major.career_opportunities.length > 0
                    ? major.career_opportunities.join(', ')
                    : 'N/A'}
                </td>
                <td className="border p-2">{major.why_choose || 'N/A'}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEditMajor(major)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMajor(major.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
                No majors available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MajorManager;