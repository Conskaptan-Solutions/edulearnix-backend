export const generateSitemap = (jobs = [], blogs = [], courses = [], resources = [], products = [], mockTests = []) => {
  const baseUrl = 'https://edulearnix.com';
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/jobs', changefreq: 'daily', priority: '0.9' },
    { url: '/resources', changefreq: 'daily', priority: '0.9' },
    { url: '/courses', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/mock-test', changefreq: 'weekly', priority: '0.8' },
    { url: '/digilearnix', changefreq: 'weekly', priority: '0.8' },
    { url: '/about', changefreq: 'monthly', priority: '0.7' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
    { url: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
    { url: '/terms-of-service', changefreq: 'yearly', priority: '0.5' },
    { url: '/refund-policy', changefreq: 'yearly', priority: '0.5' },
    { url: '/cookie-policy', changefreq: 'yearly', priority: '0.5' },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

  // Add static pages
  staticPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Add jobs
  jobs.forEach(job => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/jobs/${job.slug}</loc>\n`;
    xml += `    <lastmod>${job.updatedAt || today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    if (job.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${job.image}</image:loc>\n`;
      xml += `      <image:title>${job.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add blogs
  blogs.forEach(blog => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/blog/${blog.slug}</loc>\n`;
    xml += `    <lastmod>${blog.updatedAt || today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    if (blog.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${blog.image}</image:loc>\n`;
      xml += `      <image:title>${blog.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add courses
  courses.forEach(course => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/courses/${course.slug}</loc>\n`;
    xml += `    <lastmod>${course.updatedAt || today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    if (course.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${course.image}</image:loc>\n`;
      xml += `      <image:title>${course.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add resources
  resources.forEach(resource => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/resources/${resource.slug}</loc>\n`;
    xml += `    <lastmod>${resource.updatedAt || today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  // Add products
  products.forEach(product => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/digilearnix/${product.slug}</loc>\n`;
    xml += `    <lastmod>${product.updatedAt || today}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    if (product.image) {
      xml += '    <image:image>\n';
      xml += `      <image:loc>${product.image}</image:loc>\n`;
      xml += `      <image:title>${product.title}</image:title>\n`;
      xml += '    </image:image>\n';
    }
    xml += '  </url>\n';
  });

  // Add mock tests
  mockTests.forEach(test => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/mock-test/${test.slug}</loc>\n`;
    xml += `    <lastmod>${test.updatedAt || today}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.7</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  
  return xml;
};
