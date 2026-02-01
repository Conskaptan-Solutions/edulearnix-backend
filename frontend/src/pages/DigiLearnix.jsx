import { useState, useEffect } from 'react';
import { 
  Search, ShoppingBag, Tag, MessageCircle, 
  TrendingUp, Star, Filter 
} from 'lucide-react';
import { productService } from '../services/dataService';
import toast from 'react-hot-toast';
import SEO from '../components/seo/SEO';
import { generateBreadcrumbSchema } from '../utils/seoSchemas';

const DigiLearnix = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    'All',
    'OTT Subscriptions',
    'Education Subscription',
    'Hosting',
    'VPN',
    'Cloud Storage',
    'AI Tools',
    'Productivity Tools',
    'Marketing Tools',
    'Design Tools',
    'Others',
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      const response = await productService.getAll(params);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openWhatsApp = (product) => {
    const message = encodeURIComponent(
      `Hi, I'm interested in "${product.name}" (₹${product.offerPrice}). Please share more details.`
    );
    window.open(`https://wa.me/${product.whatsappNumber}?text=${message}`, '_blank');
  };

  const calculateDiscount = (actual, offer) => {
    return Math.round(((actual - offer) / actual) * 100);
  };

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Digital Products', path: '/digilearnix' }
  ];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbs),
      {
        '@type': 'Store',
        '@id': 'https://edulearnix.com/digilearnix',
        name: 'DigiLearnix - Digital Products Store',
        description: 'Buy digital subscriptions, software, and tools at best prices',
        url: 'https://edulearnix.com/digilearnix'
      }
    ]
  };

  return (
    <div className="min-h-screen py-8 lg:py-12">
      <SEO
        title="Digital Products - OTT Subscriptions, Software & Tools | DigiLearnix"
        description="Buy premium digital products at best prices - Netflix, Prime Video, Spotify, educational subscriptions, hosting, VPN, AI tools, and more. Get instant delivery and great deals!"
        keywords="digital products, OTT subscriptions, Netflix subscription, Prime Video, Spotify premium, educational subscription, hosting, VPN, AI tools, software, digital subscriptions, buy online"
        url="/digilearnix"
        structuredData={structuredData}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Digital Products</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Get premium digital subscriptions and tools at incredible prices! 
            From OTT platforms to productivity software, cloud storage to AI tools - 
            everything you need for work and entertainment, all at unbeatable rates. 
            Shop smart, save big!
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-12"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          {/* Category Filters */}
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

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200 dark:bg-dark-100"></div>
                <div className="p-4">
                  <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded w-1/3 mb-2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-dark-100 rounded w-1/2 mb-3"></div>
                  <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded w-2/3 mb-3"></div>
                  <div className="h-9 bg-gray-200 dark:bg-dark-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <div key={product._id} className="bg-white dark:bg-dark-200 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group">
                {/* Thumbnail */}
                <div className="relative aspect-square bg-gray-100 dark:bg-dark-200">
                  <img
                    src={product.thumbnail || '/images/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Discount Badge */}
                  {product.actualPrice > product.offerPrice && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                      {calculateDiscount(product.actualPrice, product.offerPrice)}% OFF
                    </div>
                  )}
                  
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{product.category}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mt-1 mb-1 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">{product.subcategory}</p>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">₹{product.offerPrice}</span>
                    {product.actualPrice > product.offerPrice && (
                      <span className="text-sm text-gray-400 dark:text-gray-500 line-through">₹{product.actualPrice}</span>
                    )}
                  </div>

                  {/* WhatsApp Button */}
                  <button
                    onClick={() => openWhatsApp(product)}
                    className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">Order on WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigiLearnix;
