// Structured Data Schema Generator for SEO

export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'EduLearnix',
  alternateName: 'EduLearnix - Career & Education Platform',
  url: 'https://edulearnix.com',
  logo: 'https://edulearnix.com/logo.png',
  description: 'EduLearnix is your ultimate destination for fresher jobs, free resources, courses, mock tests, and career guidance.',
  email: 'support@edulearnix.com',
  telephone: '+91-8272946202',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'India'
  },
  sameAs: [
    'https://facebook.com/edulearnix',
    'https://twitter.com/edulearnix',
    'https://linkedin.com/company/edulearnix',
    'https://instagram.com/edulearnix',
    'https://youtube.com/@edulearnix',
    'https://github.com/edulearnix'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@edulearnix.com',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Hindi']
  }
});

export const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'EduLearnix',
  url: 'https://edulearnix.com',
  description: 'Complete career platform for freshers - Jobs, Resources, Courses, Mock Tests & More',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://edulearnix.com/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'EduLearnix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://edulearnix.com/logo.png'
    }
  }
});

export const generateJobPostingSchema = (job) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: job.title,
  description: job.description,
  datePosted: job.createdAt || new Date().toISOString(),
  validThrough: job.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  employmentType: job.employmentType || 'FULL_TIME',
  hiringOrganization: {
    '@type': 'Organization',
    name: job.company || 'EduLearnix',
    sameAs: 'https://edulearnix.com',
    logo: job.companyLogo || 'https://edulearnix.com/logo.png'
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      streetAddress: job.location || 'Remote',
      addressLocality: job.city,
      addressRegion: job.state,
      addressCountry: 'IN'
    }
  },
  baseSalary: job.salary ? {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: {
      '@type': 'QuantitativeValue',
      value: job.salary,
      unitText: 'YEAR'
    }
  } : undefined,
  qualifications: job.qualifications,
  skills: job.skills,
  experienceRequirements: {
    '@type': 'OccupationalExperienceRequirements',
    monthsOfExperience: job.experience || 0
  },
  educationRequirements: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: job.education || 'Bachelor\'s Degree'
  }
});

export const generateCourseSchema = (course) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: course.title,
  description: course.description,
  provider: {
    '@type': 'Organization',
    name: 'EduLearnix',
    sameAs: 'https://edulearnix.com'
  },
  courseCode: course.slug,
  educationalLevel: course.level || 'Beginner',
  inLanguage: 'en',
  isAccessibleForFree: course.price === 0 || course.isFree,
  offers: course.price > 0 ? {
    '@type': 'Offer',
    price: course.price,
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    url: `https://edulearnix.com/courses/${course.slug}`
  } : undefined,
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: course.duration
  },
  aggregateRating: course.rating ? {
    '@type': 'AggregateRating',
    ratingValue: course.rating,
    ratingCount: course.reviews || 1,
    bestRating: 5,
    worstRating: 1
  } : undefined
});

export const generateBlogSchema = (blog) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: blog.title,
  description: blog.excerpt || blog.description,
  image: blog.image || 'https://edulearnix.com/blog-default.jpg',
  datePublished: blog.publishedAt || blog.createdAt,
  dateModified: blog.updatedAt || blog.createdAt,
  author: {
    '@type': 'Person',
    name: blog.author?.name || 'EduLearnix Team',
    url: `https://edulearnix.com/author/${blog.author?.slug || 'team'}`
  },
  publisher: {
    '@type': 'Organization',
    name: 'EduLearnix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://edulearnix.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://edulearnix.com/blog/${blog.slug}`
  },
  keywords: blog.tags?.join(', '),
  articleSection: blog.category,
  wordCount: blog.content?.split(' ').length || 1000
});

export const generateProductSchema = (product) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.title,
  description: product.description,
  image: product.image || 'https://edulearnix.com/product-default.jpg',
  brand: {
    '@type': 'Brand',
    name: product.brand || 'EduLearnix'
  },
  offers: {
    '@type': 'Offer',
    url: `https://edulearnix.com/digilearnix/${product.slug}`,
    priceCurrency: 'INR',
    price: product.price,
    priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    seller: {
      '@type': 'Organization',
      name: 'EduLearnix'
    }
  },
  aggregateRating: product.rating ? {
    '@type': 'AggregateRating',
    ratingValue: product.rating,
    reviewCount: product.reviews || 1,
    bestRating: 5,
    worstRating: 1
  } : undefined,
  category: product.category
});

export const generateMockTestSchema = (mockTest) => ({
  '@context': 'https://schema.org',
  '@type': 'Quiz',
  name: mockTest.title,
  description: mockTest.description,
  about: {
    '@type': 'Thing',
    name: mockTest.subject || 'Test Preparation'
  },
  educationalLevel: mockTest.level || 'Intermediate',
  inLanguage: 'en',
  typicalAgeRange: '18-35',
  numberOfQuestions: mockTest.questionsCount || 50,
  timeRequired: mockTest.duration || 'PT60M',
  isAccessibleForFree: mockTest.isFree || true,
  provider: {
    '@type': 'Organization',
    name: 'EduLearnix',
    url: 'https://edulearnix.com'
  }
});

export const generateFAQSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `https://edulearnix.com${crumb.path}`
  }))
});

export const generateVideoSchema = (video) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: video.title,
  description: video.description,
  thumbnailUrl: video.thumbnail,
  uploadDate: video.uploadDate,
  duration: video.duration,
  contentUrl: video.url,
  embedUrl: video.embedUrl,
  publisher: {
    '@type': 'Organization',
    name: 'EduLearnix',
    logo: {
      '@type': 'ImageObject',
      url: 'https://edulearnix.com/logo.png'
    }
  }
});
