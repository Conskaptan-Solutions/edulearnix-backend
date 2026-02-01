import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Briefcase, MapPin, Clock, 
  Building, Heart, Eye, Share2, ExternalLink, 
  IndianRupee, Tag, X, ChevronRight
} from 'lucide-react';
import { jobService } from '../services/dataService';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { generateBreadcrumbSchema } from '../utils/seoSchemas';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [likedJobs, setLikedJobs] = useState(new Set());

  const categories = [
    'All', 'IT Job', 'Non IT Job', 'Walk In Drive', 
    'Govt Job', 'Internship', 'Part Time Job', 'Remote Job', 'Others'
  ];

  useEffect(() => {
    fetchJobs();
    // Load liked jobs from localStorage
    const savedLikes = localStorage.getItem('likedJobs');
    if (savedLikes) {
      setLikedJobs(new Set(JSON.parse(savedLikes)));
    }
  }, [selectedCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await jobService.getAll(params);
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleLike = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await jobService.like(id);
      
      // Update local state
      const newLikedJobs = new Set(likedJobs);
      if (likedJobs.has(id)) {
        newLikedJobs.delete(id);
      } else {
        newLikedJobs.add(id);
      }
      setLikedJobs(newLikedJobs);
      localStorage.setItem('likedJobs', JSON.stringify([...newLikedJobs]));
      
      // Update job likes count
      setJobs(jobs.map(job => 
        job._id === id ? { ...job, likesCount: response.data.likesCount } : job
      ));
    } catch (error) {
      console.error('Failed to like job');
    }
  };

  const handleShare = async (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    const jobUrl = `${window.location.origin}/jobs/${createSlug(job)}`;
    try {
      await navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: jobUrl,
      });
    } catch (error) {
      navigator.clipboard.writeText(jobUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleViewJob = (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/jobs/${createSlug(job)}`);
  };

  const handleApply = (job, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/jobs/${createSlug(job)}`);
  };

  // Create URL-friendly slug
  const createSlug = (job) => {
    const titleSlug = job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const companySlug = job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${titleSlug}-${companySlug}-${job._id}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'IT Job': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Non IT Job': 'bg-blue-200 dark:bg-blue-600/20 text-blue-800 dark:text-blue-200',
      'Walk In Drive': 'bg-blue-50 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400',
      'Govt Job': 'bg-blue-300 dark:bg-blue-700/20 text-blue-900 dark:text-blue-100',
      'Internship': 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
      'Part Time Job': 'bg-sky-200 dark:bg-sky-600/20 text-sky-800 dark:text-sky-200',
      'Remote Job': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Others': 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-300',
    };
    return colors[category] || colors['Others'];
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      {
        '@type': 'CollectionPage',
        '@id': 'https://edulearnix.com/jobs',
        url: 'https://edulearnix.com/jobs',
        name: 'Fresher Jobs - Latest Entry Level Job Openings | EduLearnix',
        description: 'Find latest fresher jobs and entry-level positions. Browse thousands of job opportunities for freshers in IT, Non-IT, Government sectors, and more.',
        isPartOf: {
          '@id': 'https://edulearnix.com/#website'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <SEO
        title="Fresher Jobs 2026 - Latest Entry Level Jobs & Job Openings for Freshers | EduLearnix"
        description="Find latest fresher jobs, entry-level positions, and graduate job openings. Browse thousands of job opportunities for freshers in IT, Software Development, Non-IT, Government sectors, Banking, and more. Apply now and start your career journey!"
        keywords="fresher jobs, jobs for freshers, entry level jobs, graduate jobs, fresher job openings, IT jobs for freshers, software developer jobs, fresher vacancies, campus placement jobs, first job, jobs after graduation, job openings 2026, fresher recruitment, entry level positions, graduate trainee jobs"
        url="/jobs"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Fresher Job</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Launch your career with confidence! Explore thousands of entry-level opportunities 
            tailored for freshers across IT, Non-IT, Government sectors, and more. 
            Find the perfect role to kickstart your professional journey with us.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-gray-100 dark:bg-dark-200 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </form>

          {/* Category Filters */}
          <div className={`flex flex-wrap gap-2 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white dark:bg-dark-200 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-200 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-dark-100"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-2/3"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 dark:bg-dark-100 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-dark-100 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-dark-200 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Company Logo */}
                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                      {job.companyLogo ? (
                        <img 
                          src={job.companyLogo} 
                          alt={job.company}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-full h-full flex items-center justify-center ${job.companyLogo ? 'hidden' : ''}`}>
                        <Building className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Title & Company */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span>{job.experience}</span>
                      </div>
                      {job.salary && job.salary !== 'Not Disclosed' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <IndianRupee className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(job.category)}`}>
                      <Tag className="w-3 h-3" />
                      {job.category}
                    </span>
                    {/* Application Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'Closed' 
                        ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'
                        : 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300'
                    }`}>
                      {job.status === 'Closed' ? 'Application Closed' : 'Application Open'}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-4 bg-gray-50 dark:bg-dark-100 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Like Button */}
                    <button
                      onClick={(e) => handleLike(job._id, e)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        likedJobs.has(job._id)
                          ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-200 dark:hover:bg-dark-200 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedJobs.has(job._id) ? 'fill-current' : ''}`} />
                      <span>{job.likesCount || 0}</span>
                    </button>
                    
                    {/* Views */}
                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      {job.views || 0}
                    </span>

                    {/* Share Button */}
                    <button
                      onClick={(e) => handleShare(job, e)}
                      className="p-1.5 hover:bg-gray-200 dark:hover:bg-dark-200 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Apply Button */}
                  {job.status === 'Closed' ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed">
                      Closed
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleApply(job, e)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
                    >
                      Apply
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
