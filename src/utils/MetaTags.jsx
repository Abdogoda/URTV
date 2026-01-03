// MetaTags utility for managing page title and meta descriptions
export const updateMetaTags = (title, description, ogImage = '', canonicalUrl = '') => {
  // Update document title
  document.title = title;
  
  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', description);
  
  // Update Open Graph title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);
  
  // Update Open Graph description
  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', description);
  
  // Update Open Graph image if provided
  if (ogImage) {
    let ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
    }
    ogImageMeta.setAttribute('content', ogImage);
  }
  
  // Update canonical URL if provided
  if (canonicalUrl) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }
  
  // Update Twitter title
  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twitterTitle) {
    twitterTitle = document.createElement('meta');
    twitterTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twitterTitle);
  }
  twitterTitle.setAttribute('content', title);
  
  // Update Twitter description
  let twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (!twitterDescription) {
    twitterDescription = document.createElement('meta');
    twitterDescription.setAttribute('name', 'twitter:description');
    document.head.appendChild(twitterDescription);
  }
  twitterDescription.setAttribute('content', description);
  
  // Update Twitter image if provided
  if (ogImage) {
    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', ogImage);
  }
};

export const addStructuredData = (data) => {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (script) {
    script.remove();
  }
  
  if (data) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  }
};

export default { updateMetaTags, addStructuredData };
