import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Filter, ClipboardList, Clock, Users, Star,
  Award, BookOpen, Target, X, ChevronRight, Trophy,
  CheckCircle, AlertCircle, Timer, Brain
} from 'lucide-react';
import { mockTestService } from '../services/dataService';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { generateBreadcrumbSchema } from '../utils/seoSchemas';

const MockTests = () => {
  const navigate = useNavigate();
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All', 'Aptitude', 'Logical Reasoning', 'Verbal Ability',
    'Technical', 'Company Specific', 'Placement Prep',
    'Gate', 'Competitive Exams', 'Others'
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchMockTests();
  }, [selectedCategory, selectedDifficulty]);

  const fetchMockTests = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (selectedDifficulty !== 'All') {
        params.difficulty = selectedDifficulty;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await mockTestService.getAll(params);
      if (response.data.success) {
        setMockTests(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch mock tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchMockTests();
  };

  const handleViewTest = (test) => {
    const slug = test.slug || `${test.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${test._id}`;
    navigate(`/mock-test/${slug}`);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      'Medium': 'bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300',
      'Hard': 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    };
    return colors[difficulty] || 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300';
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs} hour${hrs > 1 ? 's' : ''}`;
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Mock Tests', path: '/mock-test' }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      {
        '@type': 'ItemList',
        '@id': 'https://edulearnix.com/mock-test',
        name: 'Mock Tests & Practice Exams',
        description: 'Free mock tests for interview preparation and competitive exams',
        url: 'https://edulearnix.com/mock-test'
      }
    ]
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <SEO
        title="Mock Tests - Practice Tests for Interview & Exam Preparation | EduLearnix"
        description="Take free mock tests for aptitude, reasoning, technical skills, and competitive exams. Practice with real exam patterns and boost your interview preparation. Assess your skills now!"
        keywords="mock tests, practice tests, online mock test, aptitude test, reasoning test, technical test, interview preparation, competitive exam preparation, free mock test, placement test, skill assessment"
        url="/mock-test"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Mock Test</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Sharpen your skills and boost your confidence with our comprehensive mock tests! 
            Designed to simulate real exam patterns across aptitude, reasoning, technical domains, and more. 
            Practice smart, perform better, and ace your interviews and competitive exams.
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
                placeholder="Search mock tests..."
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
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-200 dark:border-dark-100 bg-gray-50 dark:bg-dark-300 text-gray-900 dark:text-white"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>{diff}</option>
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
            Found <span className="font-semibold text-gray-900 dark:text-white">{mockTests.length}</span> mock tests
          </p>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="hidden lg:block px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-100 bg-white dark:bg-dark-200 text-gray-700 dark:text-gray-300"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff}>{diff === 'All' ? 'All Difficulties' : diff}</option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-200 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200 dark:bg-dark-100" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 dark:bg-dark-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : mockTests.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <ClipboardList className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No mock tests found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Check back soon for new mock tests'}
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedDifficulty('All');
                }}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Mock Tests Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <div
                key={test._id}
                onClick={() => handleViewTest(test)}
                className="group bg-white dark:bg-dark-200 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-dark-100 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
              >
                {/* Header */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-700 p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                        {test.category}
                      </span>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    {test.isFeatured && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-5 right-5">
                    <Brain className="w-10 h-10 text-white/30" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {test.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {test.description}
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4" />
                      {test.questions?.length || test.totalQuestions || 0} Qs
                    </span>
                    <span className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      {formatDuration(test.duration || 30)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {test.totalMarks || test.questions?.reduce((sum, q) => sum + (q.marks || 1), 0) || 0} marks
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {test.attempts || 0}
                    </span>
                  </div>

                  {/* Passing marks info */}
                  {test.passingMarks && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mb-4">
                      <CheckCircle className="w-4 h-4" />
                      Pass: {test.passingMarks} marks ({Math.round((test.passingMarks / (test.totalMarks || 100)) * 100)}%)
                    </div>
                  )}

                  {/* CTA */}
                  <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                    Start Test <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Practice with Our Mock Tests?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real Exam Pattern</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tests designed to match actual exam patterns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-sky-100 dark:bg-sky-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-sky-600 dark:text-sky-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Detailed Solutions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn from detailed explanations for each question</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your improvement with performance analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTests;
