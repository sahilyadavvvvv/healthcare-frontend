import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { listingsAPI, masterAPI, mediaAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [dealTypes, setDealTypes] = useState([]);
  const [hospitalTypes, setHospitalTypes] = useState([]);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    title: '', categoryId: '', dealTypeId: '', cityName: '', address: '',
    askingPrice: '', priceNegotiable: true, shortDescription: '', detailedDescription: '',
    // Hospital
    numberOfBeds: '', hospitalTypeId: '', nabhAccredited: false, monthlyRevenue: '',
    landAreaSqft: '', yearEstablished: '', opdDaily: '', ipBedsOccupied: '',
    // Pharma
    annualTurnover: '', stakePercentage: '', gmpCertified: false, fdaCertified: false,
    whoCertified: false, numberOfSkus: '', productTypes: '', manufacturingCapacity: '',
    // Diagnostic
    diagnosticType: '', machinesIncluded: '', dailyPatientFootfall: '', nablAccredited: false, testsOffered: '',
    diagnosticType: '', machinesIncluded: '', dailyPatientFootfall: '', nablAccredited: false, testsOffered: '',
  });

  useEffect(() => {
    masterAPI.getCategories()
      .then(res => setCategories(res.data?.data || []))
      .catch(() => toast.error('Failed to load categories'));
    
    masterAPI.getHospitalTypes()
      .then(res => setHospitalTypes(res.data?.data || []))
      .catch(() => {});
      

    if (isEditMode) {
      setLoading(true);
      listingsAPI.getById(id).then(res => {
        const data = res.data.data;
        setFormData({
            title: data.title || '', categoryId: data.category?.id || '', dealTypeId: data.dealType?.id || '',
            cityName: data.cityName || '', address: data.address || '', askingPrice: data.askingPrice || '',
            priceNegotiable: data.priceNegotiable ?? true, shortDescription: data.shortDescription || '',
            detailedDescription: data.detailedDescription || '',
            
            numberOfBeds: data.categoryDetails?.numberOfBeds || '',
            hospitalTypeId: data.categoryDetails?.hospitalType?.id || '',
            nabhAccredited: data.categoryDetails?.nabhAccredited || false,
            monthlyRevenue: data.categoryDetails?.monthlyRevenue || '',
            landAreaSqft: data.categoryDetails?.landAreaSqft || '',
            yearEstablished: data.categoryDetails?.yearEstablished || '',
            opdDaily: data.categoryDetails?.opdDaily || '',
            ipBedsOccupied: data.categoryDetails?.ipBedsOccupied || '',

            annualTurnover: data.categoryDetails?.annualTurnover || '',
            stakePercentage: data.categoryDetails?.stakePercentage || '',
            gmpCertified: data.categoryDetails?.gmpCertified || false,
            fdaCertified: data.categoryDetails?.fdaCertified || false,
            whoCertified: data.categoryDetails?.whoCertified || false,
            numberOfSkus: data.categoryDetails?.numberOfSkus || '',
            productTypes: data.categoryDetails?.productTypes || '',
            manufacturingCapacity: data.categoryDetails?.manufacturingCapacity || '',

            diagnosticType: data.categoryDetails?.diagnosticType || '',
            machinesIncluded: data.categoryDetails?.machinesIncluded || '',
            dailyPatientFootfall: data.categoryDetails?.dailyPatientFootfall || '',
            nablAccredited: data.categoryDetails?.nablAccredited || false,
            testsOffered: data.categoryDetails?.testsOffered || '',
        });
        setExistingImages(data.images || []);
      }).finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  useEffect(() => {
    if (formData.categoryId) {
      masterAPI.getDealTypes(formData.categoryId)
        .then(res => setDealTypes(res.data?.data || []))
        .catch(() => {});
      if (!isEditMode) setFormData(prev => ({ ...prev, dealTypeId: '' }));
    }
  }, [formData.categoryId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (existingImages.length + selectedFiles.length + files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    const newPreviews = [...previews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const getCategoryName = () => {
    const cat = categories.find(c => String(c.id) === String(formData.categoryId));
    return cat?.name?.toLowerCase() || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: 5-10 images
    const totalImages = existingImages.length + selectedFiles.length;
    if (totalImages < 5 || totalImages > 10) {
      setError('Please provide between 5 and 10 images of your listing.');
      toast.error('Between 5 and 10 images required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Upload Images
      let newImageUrls = [];
      if (selectedFiles.length > 0) {
          setUploading(true);
          const uploadRes = await mediaAPI.uploadMultiple(selectedFiles);
          newImageUrls = uploadRes.data.data;
          setUploading(false);
      }

      // 2. Prepare Payload
      const payload = {
        title: formData.title,
        categoryId: parseInt(formData.categoryId),
        dealTypeId: parseInt(formData.dealTypeId),
        cityName: formData.cityName,
        address: formData.address,
        askingPrice: parseFloat(formData.askingPrice),
        priceNegotiable: formData.priceNegotiable,
        shortDescription: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        isConfidential: false,
        confidentialTitle: null,
        imageUrls: [...existingImages, ...newImageUrls]
      };

      const catName = getCategoryName();
      if (catName === 'hospitals') {
        if (formData.numberOfBeds) payload.numberOfBeds = parseInt(formData.numberOfBeds);
        if (formData.hospitalTypeId) payload.hospitalTypeId = parseInt(formData.hospitalTypeId);
        payload.nabhAccredited = formData.nabhAccredited;
        if (formData.monthlyRevenue) payload.monthlyRevenue = parseFloat(formData.monthlyRevenue);
        if (formData.landAreaSqft) payload.landAreaSqft = parseFloat(formData.landAreaSqft);
        if (formData.yearEstablished) payload.yearEstablished = parseInt(formData.yearEstablished);
        if (formData.opdDaily) payload.opdDaily = parseInt(formData.opdDaily);
        if (formData.ipBedsOccupied) payload.ipBedsOccupied = parseInt(formData.ipBedsOccupied);
      } else if (catName === 'pharma companies') {
        if (formData.annualTurnover) payload.annualTurnover = parseFloat(formData.annualTurnover);
        if (formData.stakePercentage) payload.stakePercentage = parseFloat(formData.stakePercentage);
        payload.gmpCertified = formData.gmpCertified;
        payload.fdaCertified = formData.fdaCertified;
        payload.whoCertified = formData.whoCertified;
        if (formData.numberOfSkus) payload.numberOfSkus = parseInt(formData.numberOfSkus);
        payload.productTypes = formData.productTypes;
        payload.manufacturingCapacity = formData.manufacturingCapacity;
      } else if (catName === 'diagnostics') {
        payload.diagnosticType = formData.diagnosticType;
        payload.machinesIncluded = formData.machinesIncluded;
        if (formData.dailyPatientFootfall) payload.dailyPatientFootfall = parseInt(formData.dailyPatientFootfall);
        payload.nablAccredited = formData.nablAccredited;
        payload.testsOffered = formData.testsOffered;
      }

      // 3. Create or Edit Listing
      if (isEditMode) {
        await listingsAPI.update(id, payload);
        toast.success('Listing updated successfully!');
      } else {
        await listingsAPI.create(payload);
        toast.success('Listing created successfully!');
      }
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create listing. Please check your inputs and images.');
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition">
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{isEditMode ? 'Edit Listing' : 'Post a New Listing'}</h1>
        <p className="text-gray-500 mb-8 border-b pb-4">Provide details about your healthcare business to attract verified buyers.</p>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg animate-shake">
            <div className="flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          
          {/* Photos Upload Section */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              📸 Listing Photos <span className="text-red-500 text-xs font-normal">(5 to 10 images required)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              {existingImages.map((src, idx) => (
                <div key={`exist-${idx}`} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-dashed border-gray-200">
                  <img src={src} alt="preview" className="w-full h-full object-cover transition group-hover:scale-110" />
                  <button 
                    type="button"
                    onClick={() => {
                        const newEx = [...existingImages];
                        newEx.splice(idx, 1);
                        setExistingImages(newEx);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    ×
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-teal-600 text-white text-[10px] text-center py-1 font-bold">
                      PRIMARY
                    </div>
                  )}
                </div>
              ))}
              {previews.map((src, idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-dashed border-gray-200">
                  <img src={src} alt="preview" className="w-full h-full object-cover transition group-hover:scale-110" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-lg"
                  >
                    ×
                  </button>
                  {existingImages.length === 0 && idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-teal-600 text-white text-[10px] text-center py-1 font-bold">
                      PRIMARY
                    </div>
                  )}
                </div>
              ))}
              
              {(existingImages.length + selectedFiles.length) < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition text-gray-400 hover:text-teal-600 bg-gray-50"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-xs font-medium">Add Photo</span>
                </button>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              multiple 
              accept="image/*" 
              className="hidden" 
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Tip: High-quality photos increase buyer interest by 40%.
              </p>
              <p className={`text-xs font-bold ${(existingImages.length + selectedFiles.length) < 5 ? 'text-red-500' : 'text-green-600'}`}>
                {existingImages.length + selectedFiles.length} / 10 images selected
              </p>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Basic Information */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              📋 Basic Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Category *</label>
                <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Deal Type *</label>
                <select name="dealTypeId" value={formData.dealTypeId} onChange={handleChange} required className={inputClass}>
                  <option value="">Select Deal Type</option>
                  {dealTypes.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Listing Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required maxLength="200"
                placeholder="e.g., Well-equipped Diagnostic Center in Central Delhi" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>City *</label>
                <input type="text" name="cityName" value={formData.cityName} onChange={handleChange} required
                  placeholder="Enter city name manually" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Address / Area</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange}
                  placeholder="e.g., Near Metro Station, Sector 5" className={inputClass} />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              💰 Pricing & Privacy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Asking Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
                  <input type="number" name="askingPrice" value={formData.askingPrice} onChange={handleChange} required
                    min="0" step="0.01" placeholder="0.00" className={`${inputClass} pl-8`} />
                </div>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                  <input type="checkbox" name="priceNegotiable" checked={formData.priceNegotiable} onChange={handleChange}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                  <span className="text-sm font-medium text-gray-700">Price is Negotiable</span>
                </label>
              </div>
            </div>

            <div className={`p-5 rounded-xl border-2 transition bg-gray-50 border-gray-200`}>
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner bg-green-100`}>
                  🔓
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-gray-800">Public Listing</span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This listing is visible to the public ecosystem. All basic details (excluding exact contact nodes) will be displayed to authenticated stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
             <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              📝 Descriptions
            </h2>
            <div className="space-y-6">
              <div>
                <label className={labelClass}>Short Description (Elevator Pitch)</label>
                <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2"
                  maxLength="500" placeholder="A one-sentence hook for your listing..." className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Detailed Description *</label>
                <textarea name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} rows="6" required
                  maxLength="3000" placeholder="Provide full details, history, equipment list, USP, etc." className={inputClass} />
              </div>
            </div>
          </section>

          {/* ====== CATEGORY-SPECIFIC DETAILS ====== */}
          {getCategoryName() && (
            <section className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100">
              <h2 className="text-lg font-bold text-teal-800 mb-6 flex items-center gap-2 uppercase tracking-wider text-sm">
                📌 {getCategoryName()} Specifications
              </h2>
              
              {getCategoryName() === 'hospitals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Number of Beds</label>
                    <input type="number" name="numberOfBeds" value={formData.numberOfBeds} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Hospital Type</label>
                    <select name="hospitalTypeId" value={formData.hospitalTypeId} onChange={handleChange} className={inputClass}>
                      <option value="">Select Type</option>
                      {hospitalTypes.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select></div>
                  <div><label className={labelClass}>Year Established</label>
                    <input type="number" name="yearEstablished" value={formData.yearEstablished} onChange={handleChange} placeholder="YYYY" className={inputClass} /></div>
                  <div><label className={labelClass}>Monthly Revenue (₹)</label>
                    <input type="number" name="monthlyRevenue" value={formData.monthlyRevenue} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Land Area (sq ft)</label>
                    <input type="number" name="landAreaSqft" value={formData.landAreaSqft} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Daily OPD Flow</label>
                    <input type="number" name="opdDaily" value={formData.opdDaily} onChange={handleChange} className={inputClass} /></div>
                  <div className="flex items-center mt-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="nabhAccredited" checked={formData.nabhAccredited} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded" /><span className="text-sm font-medium">NABH Accredited</span></label>
                  </div>
                </div>
              )}

              {getCategoryName() === 'pharma companies' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Annual Turnover (₹)</label>
                    <input type="number" name="annualTurnover" value={formData.annualTurnover} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Stake Percentage (%)</label>
                    <input type="number" name="stakePercentage" value={formData.stakePercentage} onChange={handleChange} step="0.01" min="0" max="100" className={inputClass} /></div>
                  <div><label className={labelClass}>Number of SKUs</label>
                    <input type="number" name="numberOfSkus" value={formData.numberOfSkus} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Product Types</label>
                    <input type="text" name="productTypes" value={formData.productTypes} onChange={handleChange} placeholder="e.g., Tablets, Liquid" className={inputClass} /></div>
                  <div className="md:col-span-2"><label className={labelClass}>Manufacturing Capacity</label>
                    <input type="text" name="manufacturingCapacity" value={formData.manufacturingCapacity} onChange={handleChange} className={inputClass} /></div>
                  <div className="flex gap-6 mt-4">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="gmpCertified" checked={formData.gmpCertified} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded" /><span className="text-sm font-medium">GMP</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="fdaCertified" checked={formData.fdaCertified} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded" /><span className="text-sm font-medium">FDA</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="whoCertified" checked={formData.whoCertified} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded" /><span className="text-sm font-medium">WHO</span></label>
                  </div>
                </div>
              )}

              {getCategoryName() === 'diagnostics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Diagnostic Center Type</label>
                    <select name="diagnosticType" value={formData.diagnosticType} onChange={handleChange} className={inputClass}>
                      <option value="">Select Type</option>
                      <option value="PATHOLOGY_LAB">Pathology Lab</option>
                      <option value="XRAY">X-Ray Center</option>
                      <option value="MRI_CT">MRI / CT Scan</option>
                      <option value="ULTRASOUND">Ultrasound Center</option>
                      <option value="MULTI_MODALITY">Multi-Modality / Full-Service</option>
                    </select></div>
                  <div><label className={labelClass}>Daily Patient Footfall</label>
                    <input type="number" name="dailyPatientFootfall" value={formData.dailyPatientFootfall} onChange={handleChange} className={inputClass} /></div>
                  <div className="md:col-span-2"><label className={labelClass}>Key Machines (Included in Deal)</label>
                    <textarea name="machinesIncluded" value={formData.machinesIncluded} onChange={handleChange} rows="2" placeholder="List key equipment..." className={inputClass} /></div>
                  <div className="md:col-span-2"><label className={labelClass}>Major Tests Offered</label>
                    <textarea name="testsOffered" value={formData.testsOffered} onChange={handleChange} rows="2" placeholder="List major tests..." className={inputClass} /></div>
                  <div className="flex items-center mt-2">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="nablAccredited" checked={formData.nablAccredited} onChange={handleChange} className="w-5 h-5 text-teal-600 rounded" /><span className="text-sm font-medium">NABL Accredited</span></label>
                  </div>
                </div>
              )}

            </section>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-lg ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploading ? 'Uploading Images...' : isEditMode ? 'Saving Changes...' : 'Creating Listing...'}
                </>
              ) : (
                <>{isEditMode ? '💾 Save Changes' : '🚀 Publish Your Listing'}</>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              By publishing, you agree to our Terms of Service. Listings are reviewed within 24 hours.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingPage;

