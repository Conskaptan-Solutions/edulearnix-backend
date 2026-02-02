import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, FileText, Calendar, Eye, ThumbsUp, 
  User, Clock, Star, MessageCircle, Share2, 
  MoreHorizontal, Bookmark, Send, Heart,
  TrendingUp, Filter, ChevronDown, Loader2,
  Globe, Image, Tag, ArrowLeft
} from 'lucide-react';
import { blogService } from '../services/dataService';
import VerifiedBadge from '../components/common/VerifiedBadge';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { generateBreadcrumbSchema } from '../utils/seoSchemas';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedPosts, setExpandedPosts] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const categories = [
    'All',
    'Tech Blog',
    'Career Tips',
    'Interview Guide',
    'Tutorial',
    'News',
    'Others',
  ];

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = { limit: 1000 }; // Get all blogs
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await blogService.getAll(params);
      if (response.data.success) {
        const allBlogs = response.data.data || [];
        setBlogs(allBlogs);
        setDisplayedBlogs(allBlogs.slice(0, 5));
        setPage(1);
        setHasMore(allBlogs.length > 5);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const response = await blogService.getFeatured();
      if (response.data.success) {
        setFeaturedBlogs(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch featured blogs');
    }
  };

  const loadMoreBlogs = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * 5;
      const endIndex = startIndex + 5;
      const newBlogs = blogs.slice(startIndex, endIndex);
      
      if (newBlogs.length > 0) {
        setDisplayedBlogs(prev => [...prev, ...newBlogs]);
        setPage(nextPage);
        setHasMore(endIndex < blogs.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 800);
  }, [blogs, page, loadingMore, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreBlogs, hasMore, loadingMore]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleLike = async (id) => {
    if (likedPosts[id]) return;
    try {
      await blogService.like(id);
      setBlogs(blogs.map(b => 
        b._id === id ? { ...b, likes: (b.likes || 0) + 1 } : b
      ));
      setDisplayedBlogs(displayedBlogs.map(b => 
        b._id === id ? { ...b, likes: (b.likes || 0) + 1 } : b
      ));
      setLikedPosts({ ...likedPosts, [id]: true });
    } catch (error) {
      console.error('Failed to like blog');
    }
  };

  const toggleExpand = (id) => {
    setExpandedPosts({ ...expandedPosts, [id]: !expandedPosts[id] });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getReadingTime = (content) => {
    if (!content) return '1 min';
    const words = content.split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Tech Blog': 'bg-blue-500',
      'Career Tips': 'bg-emerald-500',
      'Interview Guide': 'bg-purple-500',
      'Tutorial': 'bg-orange-500',
      'News': 'bg-red-500',
      'Others': 'bg-gray-500',
    };
    return colors[category] || colors['Others'];
  };

  const handleShare = async (blog) => {
    const url = `${window.location.origin}/blog/${blog.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      {
        '@type': 'Blog',
        '@id': 'https://edulearnix.com/blog',
        name: 'EduLearnix Tech Blog',
        description: 'Technology tutorials, career tips, programming guides, and latest tech trends',
        url: 'https://edulearnix.com/blog',
        publisher: {
          '@type': 'Organization',
          name: 'EduLearnix'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-300">
      <SEO
        title="Tech Blog - Programming Tutorials, Career Tips & Technology Guides | EduLearnix"
        description="Read latest tech blogs, programming tutorials, interview tips, career guidance, web development guides, and technology trends. Learn from industry experts and enhance your technical skills."
        keywords="tech blog, programming tutorials, coding tutorials, web development, interview tips, career guidance, technology trends, software development blog, learning resources, programming guides, tech articles"
        url="/blog"
        structuredData={structuredData}
      />
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Tech Blog
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Discover insights, tutorials, and the latest in technology
              </p>
            </div>
            
            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-full bg-gray-100 dark:bg-dark-100 border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button type="submit" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors">
                Search
              </button>
            </form>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-dark-100 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : displayedBlogs.length === 0 ? (
              <div className="bg-white dark:bg-dark-200 rounded-xl p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No posts found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try a different search term' : 'Be the first to share something!'}
                </p>
              </div>
            ) : (
              displayedBlogs.map((blog) => (
                <article key={blog._id} className="bg-white dark:bg-dark-200 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {blog.author ? (
                        <>
                          {blog.author.avatar ? (
                            <img 
                              src={blog.author.avatar} 
                              alt={blog.author.name} 
                              className="w-12 h-12 rounded-full object-cover shadow-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ${blog.author.avatar ? 'hidden' : ''}`}
                          >
                            {blog.author.name?.charAt(0).toUpperCase() || 'A'}
                          </div>
                        </>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white shadow-lg">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{blog.author?.name || 'Deleted User'}</h3>
                          <VerifiedBadge user={blog.author} size="sm" />
                          {blog.isFeatured && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" /> Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatDate(blog.createdAt)}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" />
                            Public
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>

                  {/* Category Badge */}
                  <div className="px-4 pb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(blog.category)}`}>
                      <Tag className="w-3 h-3" />
                      {blog.category}
                    </span>
                  </div>

                  {/* Post Title */}
                  <div className="px-4 pb-3">
                    <Link to={`/blog/${blog.slug}`} className="block">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        {blog.title}
                      </h2>
                    </Link>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {blog.excerpt || blog.content?.substring(0, 300)}
                    </p>
                    {(blog.content?.length > 300 || blog.excerpt) && (
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium text-sm mt-2 hover:underline"
                      >
                        Read more
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    )}
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="px-4 pb-3 flex flex-wrap gap-2">
                      {blog.tags.slice(0, 5).map((tag, idx) => (
                        <span key={idx} className="text-blue-600 dark:text-blue-400 text-sm hover:underline cursor-pointer">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Cover Image */}
                  {blog.coverImage && (
                    <Link to={`/blog/${blog.slug}`} className="block px-4 pb-4">
                      <div className="relative w-full h-64 bg-gray-100 dark:bg-dark-100 rounded-xl overflow-hidden">
                        <img
                          src={blog.coverImage}
                          alt={blog.title}
                          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                          style={{ objectFit: 'contain' }}
                          onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                        />
                      </div>
                    </Link>
                  )}

                  {/* Stats Bar */}
                  <div className="px-4 py-3 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <ThumbsUp className="w-3 h-3 text-white fill-white" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                          <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                      <span className="ml-1">{blog.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blog.views || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getReadingTime(blog.content)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="px-2 py-1 border-t border-gray-100 dark:border-gray-800 flex items-center">
                    <button 
                      onClick={() => handleLike(blog._id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${
                        likedPosts[blog._id] 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100'
                      }`}
                    >
                      <ThumbsUp className={`w-5 h-5 ${likedPosts[blog._id] ? 'fill-blue-600 dark:fill-blue-400' : ''}`} />
                      <span>{likedPosts[blog._id] ? 'Liked' : 'Like'}</span>
                    </button>
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 font-medium transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Read</span>
                    </Link>
                    <button 
                      onClick={() => handleShare(blog)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-100 font-medium transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </article>
              ))
            )}

            {/* Infinite Scroll Loader */}
            {hasMore && (
              <div ref={observerTarget} className="flex flex-col items-center justify-center py-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Loading more posts...</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            )}
            {!hasMore && displayedBlogs.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">You've reached the end! 🎉</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-4">
            {/* Trending/Featured */}
            {featuredBlogs.length > 0 && (
              <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800 sticky top-32">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-gray-900 dark:text-white">Trending Posts</h3>
                </div>
                <div className="space-y-4">
                  {featuredBlogs.slice(0, 5).map((blog, index) => (
                    <Link key={blog._id} to={`/blog/${blog.slug}`} className="flex gap-3 group">
                      <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 group-hover:text-blue-600 transition-colors">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                          {blog.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            {blog.author?.name || 'Anonymous'}
                            <VerifiedBadge user={blog.author} size="xs" />
                          </span>
                          <span>•</span>
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Stats */}
            <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Explore Topics</h3>
              <div className="space-y-2">
                {categories.slice(1).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-dark-100 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getCategoryColor(cat)}`}></span>
                      {cat}
                    </div>
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="text-xs text-gray-500 dark:text-gray-400 px-4">
              <div className="flex flex-wrap gap-2">
                <Link to="/about" className="hover:underline">About</Link>
                <span>•</span>
                <Link to="/contact" className="hover:underline">Contact</Link>
                <span>•</span>
                <Link to="/privacy-policy" className="hover:underline">Privacy</Link>
                <span>•</span>
                <Link to="/terms-of-service" className="hover:underline">Terms</Link>
              </div>
              <p className="mt-2">© 2026 EduLearnix. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
