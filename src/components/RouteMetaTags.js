import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getMetadataForPath, generateKeywords } from '../utils/toolMetadata';

const BASE_URL = 'https://ehmi.se';
const SITE_NAME = 'Online Toolkit';

function RouteMetaTags() {
  const location = useLocation();
  const path = location.pathname;
  
  // Get metadata for current path
  const metadata = getMetadataForPath(path);
  
  // If no metadata found, use default
  if (!metadata) {
    return (
      <Helmet>
        <title>Online Toolkit | Free Online Tools</title>
        <meta name="description" content="Your one-stop destination for useful online tools. We provide a collection of calculators, formatters, and utilities to help streamline your work." />
        <meta name="keywords" content="online tools, free tools, web tools, utility tools, productivity tools" />
        <link rel="canonical" href={`${BASE_URL}/tools${path}`} />
        <link rel="icon" type="image/png" href="/tools/favicon.png" />
      </Helmet>
    );
  }
  
  // Generate full URL
  const fullUrl = `${BASE_URL}/tools${path === '/' ? '' : path}`;
  const fullTitle = `${metadata.name} | ${SITE_NAME}`;
  
  // Generate keywords if not provided
  const keywords = metadata.keywords || generateKeywords(metadata.name, metadata.description);
  
  // Default image
  const defaultImage = `${BASE_URL}/tools/favicon.png`;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metadata.description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="en" />
      <meta name="language" content="English" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={defaultImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={metadata.name} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={defaultImage} />
      <meta name="twitter:image:alt" content={metadata.name} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical and Alternate URLs */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/tools/favicon.png" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": metadata.name,
          "headline": metadata.name,
          "description": metadata.description,
          "url": fullUrl,
          "image": {
            "@type": "ImageObject",
            "url": defaultImage,
            "width": 1200,
            "height": 630
          },
          "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
              "@type": "ImageObject",
              "url": `${BASE_URL}/tools/favicon.png`
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        })}
      </script>
    </Helmet>
  );
}

export default RouteMetaTags;

