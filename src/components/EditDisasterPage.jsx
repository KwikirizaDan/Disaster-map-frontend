import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';

const EditDisasterPage = () => {
  const { id } = useParams();
  const { updateDisaster } = useAuth();
  const navigate = useNavigate();
  const [disaster, setDisaster] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const response = await fetch(`https://disastermap.vercel.app/api/disasters/${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDisaster(data);
      } catch (error) {
        setFeedback(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDisaster();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback('');

    const formData = new FormData(e.target);
    const disasterData = Object.fromEntries(formData.entries());
    const imageFile = formData.get('image');

    try {
      if (imageFile && imageFile.size > 0) {
        const fileName = `${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('disaster-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw new Error('Image upload failed: ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage.from('disaster-images').getPublicUrl(fileName);
        disasterData.image_url = publicUrl;
      }

      // Convert to correct types
      disasterData.casualties = parseInt(disasterData.casualties, 10) || null;
      disasterData.damage_estimate = parseFloat(disasterData.damage_estimate) || null;

      delete disasterData.image;

      const result = await updateDisaster(id, disasterData);

      if (result.success) {
        setFeedback('Disaster updated successfully!');
        setTimeout(() => navigate(`/disasters/${id}`), 1000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !disaster) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="p-4 bg-[var(--main-container-bg)] text-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Disaster</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title*</label>
            <input type="text" id="title" name="title" defaultValue={disaster.title} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="location_name" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Location Name*</label>
            <input type="text" id="location_name" name="location_name" defaultValue={disaster.location_name} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type*</label>
            <input type="text" id="type" name="type" defaultValue={disaster.type} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Status*</label>
            <input type="text" id="status" name="status" defaultValue={disaster.status} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Severity*</label>
            <input type="text" id="severity" name="severity" defaultValue={disaster.severity} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Latitude*</label>
            <input type="text" id="latitude" name="latitude" defaultValue={disaster.latitude} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Longitude*</label>
            <input type="text" id="longitude" name="longitude" defaultValue={disaster.longitude} required className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">New Image</label>
            <input type="file" id="image" name="image" className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="casualties" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Casualties</label>
            <input type="number" id="casualties" name="casualties" defaultValue={disaster.casualties} className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
          <div>
            <label htmlFor="damage_estimate" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Damage Estimate ($)</label>
            <input type="number" step="0.01" id="damage_estimate" name="damage_estimate" defaultValue={disaster.damage_estimate} className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <textarea id="description" name="description" rows="3" defaultValue={disaster.description} className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3"></textarea>
        </div>
        <div>
          <label htmlFor="resources_needed" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Resources Needed</label>
          <input type="text" id="resources_needed" name="resources_needed" defaultValue={disaster.resources_needed} className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label htmlFor="negative_effects" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Negative Effects</label>
          <input type="text" id="negative_effects" name="negative_effects" defaultValue={disaster.negative_effects} className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
        </div>
        <div>
          <label htmlFor="potential_solutions" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Potential Solutions</label>
          <input type="text" id="potential_solutions" name="potential_solutions" defaultValue={disaster.potential_solutions} className="w-full bg-[var(--surface-2)] border border-[var(--border-color)] rounded-md shadow-sm py-2 px-3" />
        </div>

        {feedback && <p className="text-center text-sm text-red-500 mb-4">{feedback}</p>}

        <div className="flex justify-end">
          <button type="button" onClick={() => navigate(`/disasters/${id}`)} className="mr-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="bg-[var(--accent-blue)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500">
            {loading ? 'Updating...' : 'Update Disaster'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDisasterPage;
