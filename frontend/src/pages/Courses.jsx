import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, GraduationCap, Clock, Users, Star,
  Play, BookOpen, Globe, IndianRupee, X, ChevronRight,
  Award, Video, CheckCircle
} from 'lucide-react';
import { courseService } from '../services/dataService';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { generateBreadcrumbSchema } from '../utils/seoSchemas';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All', 'Web Development', 'Mobile Development', 'Data Science',
    'Machine Learning', 'DevOps', 'Cybersecurity', 'Cloud Computing',
    'UI/UX Design', 'Digital Marketing', 'Interview Prep', 'DSA',
    'Programming Languages', 'Others'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  useEffect(() => {
    fetchCourses();
  }, [selectedCategory, selectedLevel]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (selectedLevel !== 'All') {
        params.level = selectedLevel;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await courseService.getAll(params);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const handleViewCourse = (course) => {
    const slug = course.slug || `${course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${course._id}`;
    navigate(`/courses/${slug}`);
  };

  const formatPrice = (course) => {
    if (course.isFree) return 'Free';
    if (course.offerPrice && course.offerPrice < course.actualPrice) {
      return (
        <span className="flex items-center gap-2">
          <span className="text-green-600 dark:text-green-400 font-bold">₹{course.offerPrice}</span>
          <span className="line-through text-gray-400 text-sm">₹{course.actualPrice}</span>
        </span>
      );
    }
    return `₹${course.actualPrice}`;
  };

  const getLevelColor = (level) => {
    const colors = {
      'Beginner': 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
      'Intermediate': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      'Advanced': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
      'All Levels': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
    };
    return colors[level] || colors['All Levels'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Web Development': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Mobile Development': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
      'Data Science': 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
      'Machine Learning': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
      'DevOps': 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300',
      'Cybersecurity': 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
      'Cloud Computing': 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
      'UI/UX Design': 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300',
      'DSA': 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
      'Interview Prep': 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-300',
    };
    return colors[category] || 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300';
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Web Development': 'from-blue-500 to-blue-600',
      'Mobile Development': 'from-purple-500 to-purple-600',
      'Data Science': 'from-green-500 to-green-600',
      'Machine Learning': 'from-orange-500 to-orange-600',
      'DevOps': 'from-cyan-500 to-cyan-600',
      'Cybersecurity': 'from-red-500 to-red-600',
      'Cloud Computing': 'from-sky-500 to-sky-600',
      'UI/UX Design': 'from-pink-500 to-pink-600',
      'DSA': 'from-indigo-500 to-indigo-600',
      'Interview Prep': 'from-teal-500 to-teal-600',
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      {
        '@type': 'ItemList',
        '@id': 'https://edulearnix.com/courses',
        name: 'Online Courses',
        description: 'Top online courses for skill development and career growth',
        itemListElement: courses.slice(0, 10).map((course, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Course',
            name: course.title,
            description: course.description,
            url: `https://edulearnix.com/courses/${course.slug}`
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <SEO
        title="Online Courses - Learn Programming, Web Development & More | EduLearnix"
        description="Explore top online courses in programming, web development, data science, AI/ML, and more. Learn from industry experts with hands-on projects. Start your learning journey today!"
        keywords="online courses, programming courses, web development courses, data science courses, AI courses, machine learning courses, free courses, paid courses, skill development, learn online, certification courses"
        url="/courses"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Top Courses</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Elevate your skills with our handpicked selection of industry-leading courses! 
            Learn from the best instructors, gain practical knowledge, and unlock new career opportunities. 
            From beginner to advanced levels, find the perfect course to achieve your goals.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-dark-200 rounded-2xl shadow-sm border border-gray-200 dark:border-dark-100 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-dark-100 bg-gray-50 dark:bg-dark-300 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-100"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Search
            </button>
          </form>

          {/* Desktop Filters */}
          <div className="hidden lg:flex flex-wrap gap-4 mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 8).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-dark-100 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-6 pt-6 border-t border-gray-200 dark:border-dark-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-dark-100 bg-gray-50 dark:bg-dark-300 text-gray-900 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-dark-100 bg-gray-50 dark:bg-dark-300 text-gray-900 dark:text-white"
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-white">{courses.length}</span> courses
          </p>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="hidden lg:block px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300"
          >
            {levels.map((level) => (
              <option key={level} value={level}>{level === 'All' ? 'All Levels' : level}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-dark-100" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 dark:bg-dark-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new courses'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleViewCourse(course)}
                className="group bg-white dark:bg-dark-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-100 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  {/* Colored fallback background with title */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center p-4`}>
                    <h3 className="text-white font-bold text-base text-center leading-tight line-clamp-4">
                      {course.title}
                    </h3>
                  </div>
                  
                  {/* Try to load thumbnail image on top */}
                  {course.thumbnail && course.thumbnail.startsWith('http') && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2 z-20">
                    {course.isFree && (
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                        FREE
                      </span>
                    )}
                    {course.isFeatured && (
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay */}
                  {course.previewVideo && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-20">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category & Level */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  {course.instructor?.name && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      By {course.instructor.name}
                    </p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      {course.lessons?.length || 0} lessons
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.enrollments || 0}
                    </span>
                    {course.rating > 0 && (
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        {course.rating.toFixed(1)}
                      </span>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-dark-100">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(course)}
                    </div>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1">
                      Enroll Now <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Section - if we have featured courses */}
        {!loading && courses.length > 0 && courses.some(c => c.isFeatured) && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Featured Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.filter(c => c.isFeatured).slice(0, 2).map((course) => (
                <div
                  key={`featured-${course._id}`}
                  onClick={() => handleViewCourse(course)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-shadow"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 relative">
                      {/* Fallback with title */}
                      <div className="absolute inset-0 bg-white/20 flex items-center justify-center p-2">
                        <span className="text-white text-xs font-bold text-center line-clamp-3">{course.title}</span>
                      </div>
                      {/* Try to load thumbnail */}
                      {course.thumbnail && course.thumbnail.startsWith('http') && (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="absolute inset-0 w-full h-full object-cover z-10" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                      <p className="text-white/80 text-sm mb-3 line-clamp-2">{course.shortDescription || course.description}</p>
                      <div className="flex items-center gap-3 text-sm text-white/90">
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" /> {course.lessons?.length || 0} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {course.enrollments || 0} enrolled
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
