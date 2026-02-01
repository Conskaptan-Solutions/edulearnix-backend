// SEO Utility Functions

/**
 * Truncate text to specified length for meta descriptions
 */
export const truncateText = (text, length = 160) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length - 3) + '...';
};

/**
 * Generate SEO-friendly slug from text
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Extract keywords from text
 */
export const extractKeywords = (text, maxKeywords = 10) => {
  if (!text) return [];
  
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word));
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

/**
 * Generate meta description from content
 */
export const generateMetaDescription = (content, title = '') => {
  if (!content) return '';
  
  // Remove HTML tags
  const cleanContent = content.replace(/<[^>]*>/g, ' ');
  
  // Clean up whitespace
  const normalized = cleanContent.replace(/\s+/g, ' ').trim();
  
  // If title exists, prepend it
  const description = title ? `${title}. ${normalized}` : normalized;
  
  return truncateText(description, 160);
};

/**
 * Create canonical URL
 */
export const createCanonicalUrl = (path, baseUrl = 'https://edulearnix.com') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Format date for schema.org
 */
export const formatSchemaDate = (date) => {
  if (!date) return new Date().toISOString();
  return new Date(date).toISOString();
};

/**
 * Get reading time estimate
 */
export const getReadingTime = (text) => {
  if (!text) return 0;
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Generate social share URLs
 */
export const generateShareUrls = (url, title, description) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
  };
};

/**
 * Check if URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Generate image alt text from filename
 */
export const generateAltText = (filename, fallback = 'Image') => {
  if (!filename) return fallback;
  
  return filename
    .replace(/\.[^/.]+$/, '') // Remove extension
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Create breadcrumb trail
 */
export const createBreadcrumbTrail = (path) => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', path: '/' }];
  
  let currentPath = '';
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: currentPath
    });
  });
  
  return breadcrumbs;
};

/**
 * Calculate SEO score
 */
export const calculateSEOScore = (page) => {
  let score = 0;
  const checks = {
    hasTitle: page.title && page.title.length > 0 && page.title.length <= 60,
    hasDescription: page.description && page.description.length >= 120 && page.description.length <= 160,
    hasKeywords: page.keywords && page.keywords.split(',').length >= 5,
    hasCanonical: page.canonical && isValidUrl(page.canonical),
    hasStructuredData: page.structuredData && Object.keys(page.structuredData).length > 0,
    hasImage: page.image && isValidUrl(page.image),
    hasH1: page.content && page.content.includes('<h1'),
    hasInternalLinks: page.content && (page.content.match(/<a href="\//g) || []).length >= 3
  };
  
  Object.values(checks).forEach(check => {
    if (check) score += 12.5;
  });
  
  return Math.round(score);
};

/**
 * Validate structured data
 */
export const validateStructuredData = (data) => {
  try {
    JSON.parse(JSON.stringify(data));
    return {
      valid: true,
      errors: []
    };
  } catch (error) {
    return {
      valid: false,
      errors: [error.message]
    };
  }
};

/**
 * Get optimal image dimensions for SEO
 */
export const getOptimalImageDimensions = (type) => {
  const dimensions = {
    og: { width: 1200, height: 630 },
    twitter: { width: 1200, height: 675 },
    favicon: { width: 32, height: 32 },
    logo: { width: 250, height: 250 },
    thumbnail: { width: 400, height: 300 }
  };
  
  return dimensions[type] || dimensions.og;
};

/**
 * Generate sitemap entry
 */
export const generateSitemapEntry = (url, lastmod, changefreq = 'weekly', priority = '0.8') => {
  return {
    loc: url,
    lastmod: formatSchemaDate(lastmod),
    changefreq,
    priority
  };
};

/**
 * Clean HTML for meta description
 */
export const cleanHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export default {
  truncateText,
  generateSlug,
  extractKeywords,
  generateMetaDescription,
  createCanonicalUrl,
  formatSchemaDate,
  getReadingTime,
  generateShareUrls,
  isValidUrl,
  generateAltText,
  createBreadcrumbTrail,
  calculateSEOScore,
  validateStructuredData,
  getOptimalImageDimensions,
  generateSitemapEntry,
  cleanHtml
};
