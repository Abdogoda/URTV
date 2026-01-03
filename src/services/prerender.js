// Service to handle pre-rendering for social media crawlers
// This detects when a crawler is accessing the page and serves pre-rendered content

const CRAWLERS = [
  'facebookexternalhit',
  'twitterbot',
  'whatsapp',
  'linkedinbot',
  'slurp',
  'bingbot',
  'yandexbot',
  'baiduspider',
  'yisoubot',
  'sogou',
  'googlebot',
  'pinterest',
  'slackbot'
];

export const isCrawler = (userAgent) => {
  return CRAWLERS.some(crawler => userAgent.toLowerCase().includes(crawler));
};

// Function to detect if page should be pre-rendered
export const shouldPrerender = () => {
  const userAgent = navigator.userAgent;
  return isCrawler(userAgent);
};

// Function to inject meta tags for crawlers
export const injectMetaTagsForCrawler = (title, description, image, url) => {
  // Update basic meta tags
  document.title = title;
  
  const metaTags = {
    'description': description,
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': 'website',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:card': 'summary_large_image'
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    let meta = document.querySelector(`meta[property="${name}"], meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      const isProperty = name.includes('og:') || name === 'type';
      if (isProperty) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // Add canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', url);
};
