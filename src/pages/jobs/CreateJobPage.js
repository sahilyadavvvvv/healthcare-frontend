import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsAPI, masterAPI } from '../../services/api';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [jobCategories, setJobCategories] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    title: '', jobCategoryId: '', specialisation: '', employmentType: '',
    salaryMinLpa: '', salaryMaxLpa: '', cityName: '', experienceRequired: '',
    qualifications: '', description: '', applicationDeadline: '',
    numberOfOpenings: 1, contactEmail: '',
  });

  useEffect(() => {
    masterAPI.getJobCategories().then(res => setJobCategories(res.data?.data || [])).catch(() => {});
    masterAPI.getCities().then(res => setCities(res.data?.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const payload = {
        title: formData.title,
        jobCategoryId: parseInt(formData.jobCategoryId),
        specialisation: formData.specialisation,
        employmentType: formData.employmentType,
        cityName: formData.cityName,
        experienceRequired: formData.experienceRequired,
        qualifications: formData.qualifications,
        description: formData.description,
        applicationDeadline: formData.applicationDeadline,
        numberOfOpenings: parseInt(formData.numberOfOpenings) || 1,
        contactEmail: formData.contactEmail,
      };
      if (formData.salaryMinLpa) payload.salaryMinLpa = parseFloat(formData.salaryMinLpa);
      if (formData.salaryMaxLpa) payload.salaryMaxLpa = parseFloat(formData.salaryMaxLpa);

      await jobsAPI.create(payload);
      setSuccess('Job posted successfully! It will be reviewed by admin.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job. Please check all fields.');
    } finally { setLoading(false); }
  };

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-teal-600 mb-6 transition">
          ← Back
        </button>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Post a Job</h1>
        <p className="text-gray-500 mb-6">Hire healthcare professionals for your organization.</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
          {/* Job Title */}
          <div>
            <label className={labelClass}>Job Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required maxLength="200"
              placeholder="e.g., Senior Cardiologist" className={inputClass} />
          </div>

          {/* Category & Employment Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Job Category *</label>
              <select name="jobCategoryId" value={formData.jobCategoryId} onChange={handleChange} required className={inputClass}>
                <option value="">Select Category</option>
                {jobCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Employment Type *</label>
              <select name="employmentType" value={formData.employmentType} onChange={handleChange} required className={inputClass}>
                <option value="">Select Type</option>
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="LOCUM">Locum</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
          </div>

          {/* Specialisation & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Specialisation</label>
              <input type="text" name="specialisation" value={formData.specialisation} onChange={handleChange}
                placeholder="e.g., Cardiology, Radiology" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Experience Required *</label>
              <select name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} required className={inputClass}>
                <option value="">Select</option>
                <option value="FRESHER">Fresher</option>
                <option value="ONE_TO_THREE">1-3 Years</option>
                <option value="THREE_TO_FIVE">3-5 Years</option>
                <option value="FIVE_TO_TEN">5-10 Years</option>
                <option value="TEN_PLUS">10+ Years</option>
              </select>
            </div>
          </div>

          {/* Salary & City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Min Salary (LPA)</label>
              <input type="number" name="salaryMinLpa" value={formData.salaryMinLpa} onChange={handleChange}
                step="0.5" min="0" placeholder="e.g., 8" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Max Salary (LPA)</label>
              <input type="number" name="salaryMaxLpa" value={formData.salaryMaxLpa} onChange={handleChange}
                step="0.5" min="0" placeholder="e.g., 20" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>City *</label>
              <input type="text" name="cityName" value={formData.cityName} onChange={handleChange}
                required placeholder="e.g., Mumbai, Delhi" className={inputClass} />
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label className={labelClass}>Qualifications</label>
            <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange}
              placeholder="e.g., MBBS, MD Cardiology" className={inputClass} />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Job Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="5" required
              maxLength="3000" placeholder="Full job description, responsibilities, requirements..." className={inputClass} />
          </div>

          {/* Openings, Deadline, Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Openings</label>
              <input type="number" name="numberOfOpenings" value={formData.numberOfOpenings} onChange={handleChange}
                min="1" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Application Deadline *</label>
              <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange}
                required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Contact Email *</label>
              <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange}
                required placeholder="hr@hospital.com" className={inputClass} />
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 disabled:opacity-50 transition flex items-center justify-center gap-2">
            ✉ {loading ? 'Posting...' : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateJobPage;
