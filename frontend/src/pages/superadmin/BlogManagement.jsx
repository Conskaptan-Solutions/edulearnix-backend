import { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Edit2, Trash2, ExternalLink, Eye, Loader2, ChevronDown, X, Save, AlertCircle, Star, Globe, Clock, ThumbsUp, User, Calendar, Image } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import VerifiedBadge from '../../components/common/VerifiedBadge';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showViewModal, setShowViewModal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'Tech Blog',
    tags: '',
    coverImage: '',
    isPublished: true,
    isFeatured: false,
  });

  const categories = ['Tech Blog', 'Career Tips', 'Interview Guide', 'Tutorial', 'News', 'Others'];

  useEffect(() => {
    fetchBlogs();
    fetchContributors();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs/all');
      setBlogs(res.data.data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      try {
        const res = await api.get('/blogs?limit=100');
        setBlogs(res.data.data || []);
      } catch (err) {
        toast.error('Failed to load blogs');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchContributors = async () => {
    try {
      const res = await api.get('/users/approved');
      const blogPosters = (res.data.data || []).filter(u => ['blog_poster', 'tech_blog_poster', 'super_admin'].includes(u.role));
      setContributors(blogPosters);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => {
    setFormData({ title: '', excerpt: '', content: '', category: 'Tech Blog', tags: '', coverImage: '', isPublished: true, isFeatured: false });
    setEditingBlog(null);
  };

  const openCreateModal = () => { resetForm(); setShowModal(true); };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      category: blog.category || 'Tech Blog',
      tags: blog.tags?.join(', ') || '',
      coverImage: blog.coverImage || '',
      isPublished: blog.isPublished ?? true,
      isFeatured: blog.isFeatured ?? false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setActionLoading('form');
      const blogData = { ...formData, tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) };
      if (editingBlog) {
        await api.put(`/blogs/${editingBlog._id}`, blogData);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/blogs', blogData);
        toast.success('Blog created successfully');
      }
      await fetchBlogs();
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      setActionLoading(blogId);
      await api.delete(`/blogs/${blogId}`);
      toast.success('Blog deleted successfully');
      await fetchBlogs();
      setShowDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete blog');
    } finally {
      setActionLoading(null);
    }
  };

  const togglePublish = async (blog) => {
    try {
      setActionLoading(blog._id);
      await api.put(`/blogs/${blog._id}`, { ...blog, isPublished: !blog.isPublished });
      toast.success(blog.isPublished ? 'Blog unpublished' : 'Blog published');
      await fetchBlogs();
    } catch (error) {
      toast.error('Failed to update blog');
    } finally {
      setActionLoading(null);
    }
  };

  const toggleFeatured = async (blog) => {
    try {
      setActionLoading(blog._id + '-featured');
      await api.put(`/blogs/${blog._id}`, { ...blog, isFeatured: !blog.isFeatured });
      toast.success(blog.isFeatured ? 'Removed from featured' : 'Added to featured');
      await fetchBlogs();
    } catch (error) {
      toast.error('Failed to update blog');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const getCategoryBadge = (category) => {
    const colors = {
      'Tech Blog': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Career Tips': 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
      'Interview Guide': 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
      'Tutorial': 'bg-blue-50 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400',
      'News': 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
      'Others': 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300',
    };
    return (<span className={`px-2.5 py-1 rounded-full text-xs font-medium ${colors[category] || colors['Others']}`}>{category}</span>);
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || blog.category === categoryFilter;
    const matchesAuthor = !authorFilter || blog.author?._id === authorFilter;
    const matchesStatus = !statusFilter || (statusFilter === 'published' ? blog.isPublished : !blog.isPublished);
    return matchesSearch && matchesCategory && matchesAuthor && matchesStatus;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter(b => b.isPublished).length,
    drafts: blogs.filter(b => !b.isPublished).length,
    featured: blogs.filter(b => b.isFeatured).length,
    totalViews: blogs.reduce((acc, b) => acc + (b.views || 0), 0),
    totalLikes: blogs.reduce((acc, b) => acc + (b.likes || 0), 0),
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">Tech Blog Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all blog posts and articles on the platform</p>
        </div>
        <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25">
          <Plus className="w-5 h-5" />
          Create Blog
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Blogs</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-500/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.published}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Published</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.drafts}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Drafts</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.featured}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Featured</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-200 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center">
              <ThumbsUp className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLikes}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Likes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-200 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search blogs..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={authorFilter} onChange={(e) => setAuthorFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer min-w-[140px]">
                  <option value="">All Authors</option>
                  {contributors.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer min-w-[140px]">
                  <option value="">All Categories</option>
                  {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-9 pr-8 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer min-w-[130px]">
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blog</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Author</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Stats</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No blogs found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{searchTerm ? 'Try a different search term' : 'Create your first blog post'}</p>
                    <button onClick={openCreateModal} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors">
                      <Plus className="w-4 h-4" /> Create Blog
                    </button>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 dark:hover:bg-dark-100 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700" onError={(e) => { e.target.style.display = 'none'; }} />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white flex-shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{blog.title}</p>
                            {blog.isFeatured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {blog.author ? (
                        <div className="flex items-center gap-2">
                          {blog.author.avatar ? (
                            <img 
                              src={blog.author.avatar} 
                              alt={blog.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium ${blog.author.avatar ? 'hidden' : ''}`}>
                            {blog.author.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {blog.author.name}
                              </p>
                              <VerifiedBadge user={blog.author} size="xs" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {blog.author.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">Deleted User</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">{getCategoryBadge(blog.category)}</td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {formatDate(blog.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{blog.views || 0}</span>
                        <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{blog.likes || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <button onClick={() => togglePublish(blog)} disabled={actionLoading === blog._id} className="relative inline-flex items-center">
                        <div className={`w-12 h-6 rounded-full transition-colors ${blog.isPublished ? 'bg-green-500' : 'bg-gray-400'}`}>
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform absolute top-0.5 ${blog.isPublished ? 'translate-x-6' : 'translate-x-0.5'}`}>
                            {actionLoading === blog._id && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
                          </div>
                        </div>
                        <span className={`ml-2 text-xs font-medium ${blog.isPublished ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setShowViewModal(blog)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleFeatured(blog)} disabled={actionLoading === blog._id + '-featured'} className={`p-2 rounded-lg transition-colors ${blog.isFeatured ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'}`} title={blog.isFeatured ? 'Remove from Featured' : 'Add to Featured'}>
                          <Star className={`w-4 h-4 ${blog.isFeatured ? 'fill-yellow-500' : ''}`} />
                        </button>
                        {blog.slug && (
                          <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View Blog">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button onClick={() => openEditModal(blog)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowDeleteModal(blog)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{editingBlog ? 'Edit Blog' : 'Create New Blog'}</h2>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Title *</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="Enter blog title" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500">
                    {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags (comma-separated)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="react, javascript, web" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cover Image URL</label>
                  <input type="url" name="coverImage" value={formData.coverImage} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500" placeholder="https://example.com/cover.jpg" />
                  {formData.coverImage && (
                    <div className="mt-2">
                      <img src={formData.coverImage} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Excerpt *</label>
                  <textarea name="excerpt" value={formData.excerpt} onChange={handleInputChange} required rows={2} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none" placeholder="Short summary of the blog..." />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Content *</label>
                  <textarea name="content" value={formData.content} onChange={handleInputChange} required rows={8} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-dark-100 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 resize-none" placeholder="Full blog content (supports markdown)..." />
                </div>
                <div className="md:col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Publish immediately</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Featured post</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors">Cancel</button>
                <button type="submit" disabled={actionLoading === 'form'} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                  {actionLoading === 'form' ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" />{editingBlog ? 'Update' : 'Create'}</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Blog Details</h2>
              <button onClick={() => setShowViewModal(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-dark-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
              {showViewModal.coverImage && (
                <img src={showViewModal.coverImage} alt={showViewModal.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              )}
              <div className="flex items-center gap-2 mb-3">
                {getCategoryBadge(showViewModal.category)}
                {showViewModal.isFeatured && <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"><Star className="w-3 h-3 fill-yellow-500" /> Featured</span>}
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${showViewModal.isPublished ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300'}`}>
                  {showViewModal.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{showViewModal.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{showViewModal.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                {showViewModal.author ? (
                  <span className="flex items-center gap-2">
                    {showViewModal.author.avatar ? (
                      <img 
                        src={showViewModal.author.avatar} 
                        alt={showViewModal.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs ${showViewModal.author.avatar ? 'hidden' : ''}`}>{showViewModal.author.name?.charAt(0)}</div>
                    {showViewModal.author.name}
                    <VerifiedBadge user={showViewModal.author} size="xs" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white text-xs">
                      <User className="w-3 h-3" />
                    </div>
                    Deleted User
                  </span>
                )}
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(showViewModal.createdAt)}</span>
                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{showViewModal.views || 0} views</span>
                <span className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />{showViewModal.likes || 0} likes</span>
              </div>
              {showViewModal.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {showViewModal.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-dark-100 rounded-lg text-xs text-gray-600 dark:text-gray-400">#{tag}</span>
                  ))}
                </div>
              )}
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{showViewModal.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-200 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Blog</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{showDeleteModal.title}</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this blog post? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-300 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteModal._id)} disabled={actionLoading === showDeleteModal._id} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center">
                {actionLoading === showDeleteModal._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
