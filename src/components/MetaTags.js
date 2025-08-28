import { Helmet } from 'react-helmet';

function MetaTags({ 
  title, 
  description, 
  keywords, 
  canonicalUrl,
  image,
  author = "Online Toolkit",
  type = "website",
  locale = "en_US",
  siteName = "Online Toolkit",
  publishedTime,
  modifiedTime,
  section,
  tags
}) {
  const baseUrl = 'https://tools.ehmad.site'; // Replace with your actual domain
  const fullUrl = `${baseUrl}${canonicalUrl}`;
  const fullTitle = `${title} | Online Toolkit`;
  
  // Default image if none provided
  const defaultImage = `${baseUrl}/images/og-default.jpg`;
  const metaImage = image ? `${baseUrl}${image}` : defaultImage;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
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
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Article-specific Open Graph tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && section && (
        <meta property="article:section" content={section} />
      )}
      {type === 'article' && tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@yourtwitterhandle" />
      <meta name="twitter:creator" content="@yourtwitterhandle" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical and Alternate URLs */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
      <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />
      
      {/* Web App Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? "Article" : "WebPage",
          "name": title,
          "headline": title,
          "description": description,
          "url": fullUrl,
          "image": {
            "@type": "ImageObject",
            "url": metaImage,
            "width": 1200,
            "height": 630
          },
          "author": {
            "@type": "Organization",
            "name": author
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`
            }
          },
          ...(publishedTime && { "datePublished": publishedTime }),
          ...(modifiedTime && { "dateModified": modifiedTime }),
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
          }
        })}
      </script>
    </Helmet>
  );
}

export default MetaTags;