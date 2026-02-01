import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'EduLearnix - Your Complete Career Platform',
  description = 'EduLearnix is your ultimate destination for fresher jobs, free resources, courses, mock tests, and career guidance. Join 50,000+ students building successful careers.',
  keywords = 'jobs for freshers, free resources, online courses, mock tests, tech blog, career guidance, digital products, interview preparation, job portal, education platform',
  author = 'EduLearnix Team',
  image = 'https://edulearnix.com/og-image.jpg',
  url = 'https://edulearnix.com',
  type = 'website',
  twitterCard = 'summary_large_image',
  twitterHandle = '@edulearnix',
  canonical,
  children,
  noIndex = false,
  structuredData
}) => {
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://edulearnix.com';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const canonicalUrl = canonical || fullUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="EduLearnix" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geo Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* Additional children */}
      {children}
    </Helmet>
  );
};

export default SEO;
