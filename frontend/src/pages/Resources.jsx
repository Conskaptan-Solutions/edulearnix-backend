import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, FolderOpen, FileText, Video, Download, 
  Heart, ExternalLink, Play 
} from 'lucide-react';
import { resourceService } from '../services/dataService';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { generateBreadcrumbSchema } from '../utils/seoSchemas';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'Software Notes',
    'Interview Notes',
    'Tools & Technology',
    'Trending Technology',
    'Video Resources',
    'Software Project',
    'Hardware Project',
  ];

  // Category colors for fallback thumbnails
  const categoryColors = {
    'Software Notes': 'from-blue-500 to-blue-600',
    'Interview Notes': 'from-purple-500 to-purple-600',
    'Tools & Technology': 'from-green-500 to-green-600',
    'Trending Technology': 'from-orange-500 to-orange-600',
    'Video Resources': 'from-red-500 to-red-600',
    'Software Project': 'from-indigo-500 to-indigo-600',
    'Hardware Project': 'from-teal-500 to-teal-600',
  };

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await resourceService.getAll(params);
      if (response.data.success) {
        setResources(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResources();
  };

  const handleLike = async (id) => {
    try {
      await resourceService.like(id);
      setResources(resources.map(r => 
        r._id === id ? { ...r, likes: r.likes + 1 } : r
      ));
    } catch (error) {
      console.error('Failed to like');
    }
  };

  const handleDownload = async (resource) => {
    try {
      await resourceService.download(resource._id);
      setResources(resources.map(r => 
        r._id === resource._id ? { ...r, downloads: r.downloads + 1 } : r
      ));
      window.open(resource.link, '_blank');
    } catch (error) {
      window.open(resource.link, '_blank');
    }
  };

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Resources', path: '/resources' }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      {
        '@type': 'CollectionPage',
        '@id': 'https://edulearnix.com/resources',
        name: 'Free Learning Resources',
        description: 'Free notes, tutorials, projects, and study materials for students and professionals',
        url: 'https://edulearnix.com/resources'
      }
    ]
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <SEO
        title="Free Resources - Notes, Projects, Tutorials & Study Materials | EduLearnix"
        description="Access free learning resources including notes, video tutorials, software projects, PDF books, and study materials. Download free resources for programming, web development, and more."
        keywords="free resources, study notes, free tutorials, software projects, free pdf, programming notes, web development resources, free learning materials, download free notes, free ebooks, study materials"
        url="/resources"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Free Resource</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Unlock your potential with our comprehensive collection of free learning resources! 
            Access curated notes, video tutorials, software projects, and cutting-edge materials 
            across various technologies. Everything you need to excel in your career, absolutely free.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
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

        {/* Resources Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200 dark:bg-dark-100"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded w-1/2 mb-3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No resources found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {resources.map((resource) => (
              <Link
                key={resource._id}
                to={`/resources/${resource._id}`}
                className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group block"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {/* Always show colored background as base */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${categoryColors[resource.category] || 'from-gray-500 to-gray-600'} flex items-center justify-center p-6`}>
                    <h3 className="text-white font-bold text-lg text-center leading-tight line-clamp-4">
                      {resource.title}
                    </h3>
                  </div>
                  
                  {/* Try to load image on top if available */}
                  {resource.isVideo && resource.link && getYouTubeId(resource.link) ? (
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(resource.link)}/maxresdefault.jpg`}
                      alt={resource.title}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : resource.thumbnail && resource.thumbnail.startsWith('http') ? (
                    <img
                      src={resource.thumbnail}
                      alt={resource.title}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : null}
                  
                  {resource.isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors z-20">
                      <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                      </div>
                    </div>
                  )}

                  <span className="absolute top-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-md z-30">
                    {resource.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{resource.subcategory}</p>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-500 line-clamp-2 mb-3">
                    {resource.description}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3 text-gray-500 dark:text-gray-500 text-sm">
                      <button
                        onClick={() => handleLike(resource._id)}
                        className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{resource.likes || 0}</span>
                      </button>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span>{resource.downloads || 0}</span>
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownload(resource);
                      }}
                      className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      {resource.isVideo ? 'Watch' : 'Get'}
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
