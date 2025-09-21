import React, { useState, useEffect, useRef } from 'react';
import { supabase, getJwt } from '../supabaseClient';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditDisaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    image: null,
    title: '',
    type: '',
    status: 'reported',
    severity: '',
    location_name: '',
    latitude: '',
    longitude: '',
    description: '',
    casualties: '',
    damage_estimate: '',
    resources_needed: '',
    negative_effects: '',
    potential_solutions: '',
    image_url: ''
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Fetch existing disaster
  useEffect(() => {
    const fetchDisaster = async () => {
      try {
        const token = await getJwt();
        if (!token) {
          toast.error('You must be logged in to edit a disaster.');
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`http://127.0.0.1:5000/api/disasters/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = response.data;
        setFormData({
          ...data,
          image: null,
          casualties: data.casualties || '',
          damage_estimate: data.damage_estimate || '',
          resources_needed: data.resources_needed || '',
          negative_effects: data.negative_effects || '',
          potential_solutions: data.potential_solutions || ''
        });
        
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      } catch (err) {
        console.error('Error fetching disaster:', err);
        toast.error('Could not load disaster details.');
      }
    };
    
    fetchDisaster();
  }, [id, navigate]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle file upload with validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload only JPG, JPEG, or PNG files.');
      return;
    }
    
    // Check if image is portrait orientation
    const img = new Image();
    img.onload = function() {
      if (this.width > this.height) {
        toast.warning('Please upload a portrait-oriented image for better display.');
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    img.src = URL.createObjectURL(file);
  };
  
  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          toast.success('Location obtained successfully!');
        },
        (error) => {
          toast.error('Unable to get your location. Please enter it manually.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser. Please enter coordinates manually.');
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-red-400', 'bg-red-50');
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-400', 'bg-red-50');
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-red-400', 'bg-red-50');
    
    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload only JPG, JPEG, or PNG files.');
        return;
      }
      
      // Check if image is portrait orientation
      const img = new Image();
      img.onload = function() {
        if (this.height > this.width ) {
          toast.warning('Please upload a landscape-oriented image for better display.');
        }
        
        setFormData(prev => ({
          ...prev,
          image: file
        }));
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Get JWT for authentication
    const token = await getJwt();
    if (!token) {
      toast.error('You must be logged in to update a report.');
      setIsSubmitting(false);
      return;
    }
        
    // Validate required fields
    const requiredFields = ['title', 'type', 'severity', 'location_name', 'latitude', 'longitude', 'description'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Upload image to Supabase if a new image was selected
      let imageUrl = formData.image_url;
      if (formData.image) {
        toast.info('Uploading image...');
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('disasters-images')
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase
          .storage
          .from('disasters-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
        toast.success('Image uploaded successfully!');
      }

      // 2. Prepare payload for API
      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        severity: formData.severity,
        latitude: formData.latitude,
        longitude: formData.longitude,
        location_name: formData.location_name,
        image_url: imageUrl,
        casualties: formData.casualties ? parseInt(formData.casualties, 10) : null,
        damage_estimate: formData.damage_estimate ? parseFloat(formData.damage_estimate) : null,
        resources_needed: formData.resources_needed || null,
        negative_effects: formData.negative_effects || null,
        potential_solutions: formData.potential_solutions || null,
      };

      toast.info('Updating report...');

      // 3. Send to backend API with credentials
      await axios.put(`http://127.0.0.1:5000/api/disasters/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
      toast.success('Disaster report updated successfully!');
      navigate(`/disasters/${id}`);
    } catch (error) {
      console.error('Error updating disaster report:', error);
      toast.error('There was a problem updating your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress steps
  const progressSteps = [
    { number: 1, title: 'Update Image' },
    { number: 2, title: 'Edit Details' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
        style={{fontFamily: '"Public Sans", "Noto Sans", sans-serif'}}>
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex flex-1 justify-center py-10">
            <div className="w-full max-w-2xl">
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h1 className="text-gray-900 tracking-light text-3xl font-bold leading-tight mb-6">Edit Disaster Report</h1>
                
                {/* Progress Steps */}
                <div className="mb-8">
                  <div className="flex justify-between relative">
                    {/* Progress line */}
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
                    <div 
                      className="absolute top-4 left-0 h-0.5 bg-red-500 -z-10 transition-all duration-300" 
                      style={{width: step === 1 ? '0%' : '100%'}}
                    ></div>
                    
                    {progressSteps.map((stepItem, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${step >= stepItem.number ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                          {step > stepItem.number ? (
                            <span className="material-symbols-outlined text-lg">check</span>
                          ) : (
                            <span>{stepItem.number}</span>
                          )}
                        </div>
                        <span className={`text-sm ${step >= stepItem.number ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          {stepItem.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Image Upload */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Update Disaster Image</h2>
                        <p className="text-gray-600 mb-6">You can update the image of the disaster or keep the current one.</p>
                        
                        <div
                          className="flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 cursor-pointer"
                          onClick={() => fileInputRef.current.click()}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                        >
                          {imagePreview ? (
                            <div className="text-center">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="max-h-60 mx-auto mb-4 rounded-md object-cover" 
                                style={{ maxWidth: '500px', height: '300px' }}
                              />
                              <p className="text-green-600 font-semibold">Image selected. Click to change.</p>
                            </div>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-4xl text-gray-400"> cloud_upload </span>
                              <p className="text-gray-600 text-center">
                                <span className="font-semibold text-red-500">Click to upload</span> or drag and drop
                              </p>
                            </>
                          )}
                          <p className="text-xs text-gray-500">JPG, JPEG or PNG only (Landscape orientation recommended)</p>
                          <input 
                            className="sr-only" 
                            id="image" 
                            name="image" 
                            type="file" 
                            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-red-500 text-white text-base font-bold leading-normal tracking-wide shadow-md hover:bg-red-600 transition-colors duration-300"
                        >
                          <span className="truncate">Next</span>
                          <span className="material-symbols-outlined ml-2">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Disaster Details */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold mb-4">Edit Disaster Details</h2>
                        <p className="text-gray-600 mb-6">Update the information about the disaster.</p>
                      </div>
                      
                      {/* Title Field */}
                      <div>
                        <label className="sr-only" htmlFor="title">Title</label>
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                          id="title"
                          name="title"
                          placeholder="Title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      {/* Type of Disaster Dropdown */}
                      <div>
                        <label className="sr-only" htmlFor="type">Type of Disaster</label>
                        <div className="relative">
                          <span
                            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            warning
                          </span>
                          <select
                            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 pl-12 p-4 text-base font-normal leading-normal appearance-none"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>Type of Disaster</option>
                            <option value="earthquake">Earthquake</option>
                            <option value="flood">Flood</option>
                            <option value="wildfire">Wildfire</option>
                            <option value="hurricane">Hurricane</option>
                            <option value="tornado">Tornado</option>
                            <option value="tsunami">Tsunami</option>
                            <option value="drought">Drought</option>
                            <option value="landslide">Landslide</option>
                            <option value="volcanic_eruption">Volcanic Eruption</option>
                            <option value="other">Other</option>
                          </select>
                          <span
                            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                      
                      {/* Status Dropdown */}
                      <div>
                        <label className="sr-only" htmlFor="status">Status</label>
                        <div className="relative">
                          <span
                            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            info
                          </span>
                          <select
                            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 pl-12 p-4 text-base font-normal leading-normal appearance-none"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="reported">Reported</option>
                            <option value="active">Active</option>
                            <option value="warning">Warning</option>
                            <option value="resolved">Resolved</option>
                            <option value="false_alarm">False Alarm</option>
                          </select>
                          <span
                            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                      
                      {/* Severity Dropdown */}
                      <div>
                        <label className="sr-only" htmlFor="severity">Severity</label>
                        <div className="relative">
                          <span
                            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            emergency
                          </span>
                          <select
                            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 pl-12 p-4 text-base font-normal leading-normal appearance-none"
                            id="severity"
                            name="severity"
                            value={formData.severity}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>Severity Level</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                          <span
                            className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                      
                      {/* Location Fields */}
                      <div>
                        <label className="sr-only" htmlFor="location_name">Location Name</label>
                        <div className="relative">
                          <span
                            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            location_on
                          </span>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 pl-12 p-4 text-base font-normal leading-normal"
                            id="location_name"
                            name="location_name"
                            placeholder="Location Name"
                            value={formData.location_name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="latitude">Latitude</label>
                          <div className="relative">
                            <span
                              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                              north
                            </span>
                            <input
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 pl-12 p-4 text-base font-normal leading-normal"
                              id="latitude"
                              name="latitude"
                              placeholder="Latitude"
                              value={formData.latitude}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="sr-only" htmlFor="longitude">Longitude</label>
                          <div className="relative">
                            <span
                              className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                              east
                            </span>
                            <input
                              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 pl-12 p-4 text-base font-normal leading-normal"
                              id="longitude"
                              name="longitude"
                              placeholder="Longitude"
                              value={formData.longitude}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button 
                          type="button" 
                          onClick={getCurrentLocation}
                          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          <span className="material-symbols-outlined">my_location</span>
                          Use my current location
                        </button>
                      </div>
                      
                      {/* Description Field */}
                      <div>
                        <label className="sr-only" htmlFor="description">Description</label>
                        <textarea
                          className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 min-h-36 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                          id="description"
                          name="description"
                          placeholder="Description"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      
                      {/* Additional Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="casualties">Casualties</label>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                            id="casualties"
                            name="casualties"
                            type="number"
                            min="0"
                            placeholder="Casualties (optional)"
                            value={formData.casualties}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="sr-only" htmlFor="damage_estimate">Damage Estimate ($)</label>
                          <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 h-14 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                            id="damage_estimate"
                            name="damage_estimate"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Damage Estimate (optional)"
                            value={formData.damage_estimate}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="sr-only" htmlFor="resources_needed">Resources Needed</label>
                        <textarea
                          className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 min-h-20 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                          id="resources_needed"
                          name="resources_needed"
                          placeholder="Resources Needed (optional)"
                          value={formData.resources_needed}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="negative_effects">Negative Effects</label>
                          <textarea
                            className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 min-h-20 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                            id="negative_effects"
                            name="negative_effects"
                            placeholder="Negative Effects (optional)"
                            value={formData.negative_effects}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        <div>
                          <label className="sr-only" htmlFor="potential_solutions">Potential Solutions</label>
                          <textarea
                            className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-md text-gray-900 focus:outline-0 focus:ring-2 focus:ring-red-500 border-gray-200 bg-gray-50 min-h-20 placeholder:text-gray-400 p-4 text-base font-normal leading-normal"
                            id="potential_solutions"
                            name="potential_solutions"
                            placeholder="Potential Solutions (optional)"
                            value={formData.potential_solutions}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-gray-200 text-gray-700 text-base font-bold leading-normal tracking-wide shadow-md hover:bg-gray-300 transition-colors duration-300"
                        >
                          <span className="material-symbols-outlined mr-2">arrow_back</span>
                          <span className="truncate">Back</span>
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-12 px-6 bg-red-500 text-white text-base font-bold leading-normal tracking-wide shadow-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                          {isSubmitting ? (
                            <span className="truncate">Updating...</span>
                          ) : (
                            <span className="truncate">Update Report</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EditDisaster;