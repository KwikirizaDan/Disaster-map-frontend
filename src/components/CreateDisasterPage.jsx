import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

// This component provides a form for creating a new disaster report.
const CreateDisasterPage = () => {
  const { createDisaster } = useAuth(); // Function to call the create disaster API
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(''); // State for user feedback messages
  const [loading, setLoading] = useState(false); // State to disable form during submission

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    const formData = new FormData(e.target);
    const disasterData = Object.fromEntries(formData.entries());
    const imageFile = formData.get('image');

    try {
      // If an image is provided, upload it to Supabase first
      if (imageFile && imageFile.size > 0) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('disaster-images') // Assumes a 'disaster-images' bucket in Supabase
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error('Image upload failed: ' + uploadError.message);
        }

        // Get the public URL of the uploaded image
        const { data: { publicUrl } } = supabase.storage.from('disaster-images').getPublicUrl(fileName);
        disasterData.image_url = publicUrl;
      }

      // Convert form data to correct types before sending to API
      disasterData.casualties = parseInt(disasterData.casualties, 10) || null;
      disasterData.damage_estimate = parseFloat(disasterData.damage_estimate) || null;

      // Remove the file object from the data sent to our backend
      delete disasterData.image;

      // Call the API to create the disaster
      const result = await createDisaster(disasterData);

      if (result.success) {
        setFeedback('Disaster created successfully!');
        setTimeout(() => navigate(`/disasters`), 1000); // Redirect after a short delay
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Create New Disaster</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form fields for disaster data */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title*</label>
            <input type="text" id="title" name="title" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="location_name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location Name*</label>
            <input type="text" id="location_name" name="location_name" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type*</label>
            <input type="text" id="type" name="type" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Status*</label>
            <input type="text" id="status" name="status" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Severity*</label>
            <input type="text" id="severity" name="severity" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Latitude*</label>
            <input type="text" id="latitude" name="latitude" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Longitude*</label>
            <input type="text" id="longitude" name="longitude" required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Image</label>
            <input type="file" id="image" name="image" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="casualties" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Casualties</label>
            <input type="number" id="casualties" name="casualties" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="damage_estimate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Damage Estimate ($)</label>
            <input type="number" step="0.01" id="damage_estimate" name="damage_estimate" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <textarea id="description" name="description" rows="3" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3"></textarea>
        </div>
        <div>
          <label htmlFor="resources_needed" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Resources Needed</label>
          <input type="text" id="resources_needed" name="resources_needed" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label htmlFor="negative_effects" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Negative Effects</label>
          <input type="text" id="negative_effects" name="negative_effects" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label htmlFor="potential_solutions" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Potential Solutions</label>
          <input type="text" id="potential_solutions" name="potential_solutions" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
        </div>

        {/* Display feedback messages */}
        {feedback && <p className="text-center text-sm text-red-500 mb-4">{feedback}</p>}

        <div className="flex justify-end">
          <button type="button" onClick={() => navigate('/disasters')} className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500">
            {loading ? 'Creating...' : 'Create Disaster'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateDisasterPage;
