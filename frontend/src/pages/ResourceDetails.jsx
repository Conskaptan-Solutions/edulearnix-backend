import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  Heart,
  Share2,
  Calendar,
  FolderOpen,
  Video,
  FileText,
  Mail,
  User,
  Clock,
  Eye,
  Tag,
  Play,
} from 'lucide-react';
import { resourceService } from '../services/dataService';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import VerifiedBadge from '../components/common/VerifiedBadge';

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedResources, setRelatedResources] = useState([]);

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getById(id);
      if (response.data.success) {
        setResource(response.data.data);
        setLikeCount(response.data.data.likes || 0);
        // Fetch related resources from same category
        fetchRelatedResources(response.data.data.category);
      }
    } catch (error) {
      toast.error('Failed to fetch resource details');
      navigate('/resources');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedResources = async (category) => {
    try {
      const response = await resourceService.getAll({ category });
      if (response.data.success) {
        // Filter out current resource and take only 4
        const filtered = response.data.data
          .filter(r => r._id !== id)
          .slice(0, 4);
        setRelatedResources(filtered);
      }
    } catch (error) {
      console.error('Failed to fetch related resources');
    }
  };

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
    toast.success(liked ? 'Like removed' : 'Resource liked!');
  };

  const handleDownload = () => {
    if (resource?.link) {
      window.open(resource.link, '_blank');
      toast.success('Opening resource...');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: resource?.title,
      text: `Check out this resource: ${resource?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getCategoryIcon = () => {
    if (resource?.isVideo) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Software Notes': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Interview Notes': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Tools & Technology': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Trending Technology': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Video Resources': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'Software Project': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'Hardware Project': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Software Notes': 'from-blue-500 to-blue-600',
      'Interview Notes': 'from-purple-500 to-purple-600',
      'Tools & Technology': 'from-green-500 to-green-600',
      'Trending Technology': 'from-orange-500 to-orange-600',
      'Video Resources': 'from-red-500 to-red-600',
      'Software Project': 'from-indigo-500 to-indigo-600',
      'Hardware Project': 'from-teal-500 to-teal-600',
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4">Resource not found</h2>
          <Link to="/resources" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-300">
      <SEO
        title={`${resource.title} - Free Resource | EduLearnix`}
        description={resource.description || `Download ${resource.title} - ${resource.category}`}
        keywords={`${resource.title}, ${resource.category}, ${resource.subcategory}, free resources, download, edulearnix`}
        ogType="article"
        canonicalUrl={`https://edulearnix.in/resources/${id}`}
      />
      
      {/* Back Button */}
      <div className="bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/resources"
            className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Resources
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Card */}
        <div className="bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          {/* Header Section */}
          <div className="p-6 lg:p-8 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Resource Icon/Thumbnail */}
              <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {resource.isVideo ? (
                  <Video className="w-10 h-10 text-blue-500" />
                ) : (
                  <FileText className="w-10 h-10 text-green-500" />
                )}
              </div>
              
              {/* Title & Category Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                    <Tag className="w-3 h-3" />
                    {resource.category}
                  </span>
                  {resource.subcategory && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-dark-100 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                      {resource.subcategory}
                    </span>
                  )}
                  {resource.isVideo && (
                    <span className="px-3 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded-full text-xs font-medium">
                      Video Resource
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {resource.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <FolderOpen className="w-4 h-4" />
                  <span>{resource.category}</span>
                </div>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden sm:flex flex-col gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 border-2 rounded-xl font-medium transition-all ${
                    liked
                      ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-medium hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Meta Information Grid */}
          <div className="px-6 lg:px-8 py-5 bg-gray-50 dark:bg-dark-100 border-b border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Heart className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Likes</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{likeCount || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Download className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Downloads</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{resource.downloads || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Views</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{resource.views || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">Posted</p>
                  <p className="font-semibold text-gray-900 dark:text-white text-xs">
                    {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div className="px-6 lg:px-8 py-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                About this Resource
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>
          )}

          {/* Action Buttons - Mobile & Desktop */}
          <div className="px-6 lg:px-8 py-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25"
              >
                {resource.isVideo ? (
                  <>
                    <Play className="w-5 h-5" />
                    Watch Resource
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5" />
                    Access Resource
                  </>
                )}
              </button>
              
              {/* Mobile Action Buttons */}
              <div className="flex sm:hidden gap-3">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border-2 rounded-xl font-medium transition-all ${
                    liked
                      ? 'border-red-500 text-red-500 bg-red-50 dark:bg-red-500/10'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl font-medium transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Posted By Section */}
          <div className="px-6 lg:px-8 py-5 bg-gray-50 dark:bg-dark-100 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Posted By</p>
            <div className="flex items-center gap-3">
              {resource.postedBy ? (
                <>
                  {resource.postedBy.avatar ? (
                    <img 
                      src={resource.postedBy.avatar} 
                      alt={resource.postedBy.name} 
                      className="w-12 h-12 rounded-full object-cover shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg ${resource.postedBy.avatar ? 'hidden' : ''}`}
                  >
                    {resource.postedBy.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {resource.postedBy.name}
                      <VerifiedBadge user={resource.postedBy} size="sm" />
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      {resource.postedBy.email}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white font-bold text-lg">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Deleted User
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This user account has been removed
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Related Resources Section */}
        {relatedResources.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center justify-between">
              <span>More from {resource.category}</span>
              <Link to="/resources" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                View All →
              </Link>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedResources.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/resources/${rel._id}`}
                  className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-dark-100">
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(rel.category)} flex items-center justify-center p-4`}>
                      <h3 className="text-white font-bold text-sm text-center leading-tight line-clamp-3">
                        {rel.title}
                      </h3>
                    </div>
                    {rel.thumbnail && rel.thumbnail.startsWith('http') && (
                      <img
                        src={rel.thumbnail}
                        alt={rel.title}
                        className="absolute inset-0 w-full h-full object-cover z-10"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    {rel.isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 text-sm leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {rel.title}
                    </h3>
                    {rel.subcategory && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{rel.subcategory}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDetails;
