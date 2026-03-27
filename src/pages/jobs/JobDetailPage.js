import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiDollarSign, FiBriefcase, FiClock, FiMail, FiChevronLeft, FiCheck } from 'react-icons/fi';

const JobDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchJob(); }, [id]);

  const fetchJob = async () => {
    try { const response = await jobsAPI.getById(id); setJob(response.data.data); }
    catch (error) { console.error('Error fetching job:', error); }
    setLoading(false);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to apply'); return; }
    if (!cvFile) { toast.error('Please upload your CV/Resume'); return; }

    const formData = new FormData();
    formData.append('cvFile', cvFile);
    if (coverLetter) formData.append('coverLetter', coverLetter);

    setSubmitting(true);
    try { 
      await jobsAPI.apply(id, formData); 
      toast.success('Application submitted successfully!'); 
      setShowApplyModal(false); 
      setCvFile(null);
      setCoverLetter('');
    } catch (error) { 
      toast.error(error.response?.data?.message || 'Failed to apply'); 
    }
    setSubmitting(false);
  };

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div></div>);
  if (!job) return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-xl font-bold text-gray-800 mb-2">Job Not Found</h2><Link to="/jobs" className="text-primary-500">Back to Jobs</Link></div></div>);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Link to="/jobs" className="inline-flex items-center text-gray-600 hover:text-primary-500 mb-6"><FiChevronLeft className="mr-1" />Back to Jobs</Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge badge-primary mb-2">{job.jobCategory?.name}</span>
                  <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                  <p className="text-gray-600">{job.employer?.companyName || job.employer?.fullName}</p>
                </div>
                <span className="badge badge-secondary">{job.employmentType?.replace('_', ' ')}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Location</p><p className="font-medium text-gray-800 flex items-center gap-1"><FiMapPin className="w-4 h-4" />{job.city?.name}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Salary</p><p className="font-medium text-gray-800">₹{job.salaryMinLpa} - {job.salaryMaxLpa} LPA</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Experience</p><p className="font-medium text-gray-800">{job.experienceRequired?.replace('_', ' ')}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">Openings</p><p className="font-medium text-gray-800">{job.numberOfOpenings}</p></div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
              </div>

              {job.qualifications && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Qualifications</h2>
                  <p className="text-gray-600">{job.qualifications}</p>
                </div>
              )}

              {job.specialisation && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Specialisation</h2>
                  <p className="text-gray-600">{job.specialisation}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-4">
                <p className="text-xl font-bold text-primary-600">₹{job.salaryMinLpa} - ₹{job.salaryMaxLpa} LPA</p>
                <p className="text-sm text-gray-500">Annual Salary</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600"><FiClock className="w-4 h-4" /><span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span></div>
                <div className="flex items-center gap-2 text-sm text-gray-600"><FiMail className="w-4 h-4" /><span>{job.contactEmail}</span></div>
              </div>

              <button onClick={() => setShowApplyModal(true)} className="btn btn-primary w-full py-3 mb-3">Apply Now</button>
              <p className="text-xs text-gray-500 text-center">{job.applicationCount} applicants</p>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Apply for {job.title}</h2>
            <form onSubmit={handleApply} className="space-y-4">
              <div><label className="form-label">Upload CV/Resume (PDF) *</label><input type="file" accept=".pdf" onChange={e => setCvFile(e.target.files[0])} className="form-input" required /></div>
              <div><label className="form-label">Cover Letter (Optional)</label><textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="form-input" rows="4" maxLength="500" placeholder="Why are you a good fit for this role?" /></div>
              <div className="flex gap-3"><button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary flex-1">Cancel</button><button type="submit" disabled={submitting} className="btn btn-primary flex-1">{submitting ? 'Applying...' : 'Submit Application'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailPage;
