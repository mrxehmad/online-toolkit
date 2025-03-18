import { Helmet } from 'react-helmet';

function MetaTags({ title, description, keywords, canonicalUrl }) {
  const baseUrl = 'https://tools.ehmad.site'; // Replace with your actual domain
  const fullUrl = `${baseUrl}${canonicalUrl}`;
  
  return (
    <Helmet>
      <title>{title} | Online Toolkit</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={`${title} | Online Toolkit`} />
      <meta property="og:description" content={description} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={`${title} | Online Toolkit`} />
      <meta property="twitter:description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  );
}

export default MetaTags; 