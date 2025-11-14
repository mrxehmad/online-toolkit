const fs = require('fs');
const path = require('path');

// Configuration
// BASE_URL now includes the /tools sub-path so generated links point to domain.com/tools/<tool>
const BASE_URL = 'https://ehmi.se/tools';
const SITEMAP_OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');
const ROUTES_FILE_PATH = path.join(__dirname, '../src/routes.js');
const BASE_PATH = '';

// Default metadata for different types of routes
const DEFAULT_METADATA = {
  home: {
    changefreq: 'weekly',
    priority: '1.0'
  },
  tools: {
    changefreq: 'monthly',
    priority: '0.9'
  },
  pages: {
    changefreq: 'yearly',
    priority: '0.7'
  }
};

// Tool-specific metadata overrides
const TOOL_METADATA = {
  'browser-info-detector': { changefreq: 'monthly', priority: '0.9' },
  'crypto-converter': { changefreq: 'weekly', priority: '0.9' },
  'mortgage-calculator': { changefreq: 'monthly', priority: '0.9' },
  'investment-calculator': { changefreq: 'monthly', priority: '0.9' },
  'tax-calculator': { changefreq: 'monthly', priority: '0.9' },
  'net-income-tax-calculator': { changefreq: 'monthly', priority: '0.9' },
  'stock-crypto-tracker': { changefreq: 'weekly', priority: '0.9' },
  'currency-converter': { changefreq: 'weekly', priority: '0.9' },
  'weather-dashboard': { changefreq: 'weekly', priority: '0.8' },
  'seo-meta-generator': { changefreq: 'monthly', priority: '0.9' },
  'admin': { changefreq: 'monthly', priority: '0.6' }
};

// Page-specific metadata overrides
const PAGE_METADATA = {
  'contact': { changefreq: 'monthly', priority: '0.8' },
  'terms': { changefreq: 'yearly', priority: '0.7' },
  'privacy': { changefreq: 'yearly', priority: '0.7' }
};

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function getMetadataForRoute(routeType, routePath) {
  // Check for specific overrides first
  if (routeType === 'tools' && TOOL_METADATA[routePath]) {
    return TOOL_METADATA[routePath];
  }
  
  if (routeType === 'pages' && PAGE_METADATA[routePath]) {
    return PAGE_METADATA[routePath];
  }
  
  // Return default metadata for the route type
  return DEFAULT_METADATA[routeType] || DEFAULT_METADATA.tools;
}

function generateSitemapXML(routes) {
  const currentDate = getCurrentDate();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}${BASE_PATH}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${DEFAULT_METADATA.home.changefreq}</changefreq>
    <priority>${DEFAULT_METADATA.home.priority}</priority>
  </url>

`;

  // Generate URLs for tools
  if (routes.tools) {
    xml += '  <!-- Tools -->\n';
    Object.entries(routes.tools).forEach(([key, tool]) => {
      const metadata = getMetadataForRoute('tools', key);
      xml += `  <url>
    <loc>${BASE_URL}${BASE_PATH}${tool.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
  </url>
`;
    });
  }

  // Generate URLs for pages
  if (routes.pages) {
    xml += '  <!-- Pages -->\n';
    Object.entries(routes.pages).forEach(([key, page]) => {
      if (key === 'home' || key === 'notFound') return; // Skip home and 404
      
      const metadata = getMetadataForRoute('pages', key);
      xml += `  <url>
    <loc>${BASE_URL}${BASE_PATH}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${metadata.changefreq}</changefreq>
    <priority>${metadata.priority}</priority>
  </url>
`;
    });
  }

  xml += '</urlset>';
  return xml;
}

function extractRoutesFromFile() {
  try {
    // Read the routes.js file
    const routesContent = fs.readFileSync(ROUTES_FILE_PATH, 'utf8');
    
    // Simple regex-based extraction (since we can't import ES modules in Node.js)
    const routes = {
      tools: {},
      pages: {}
    };
    
    // Extract tool routes
    const toolMatches = routesContent.matchAll(/export const routes = \{[\s\S]*?tools: \{([\s\S]*?)\},[\s\S]*?pages: \{([\s\S]*?)\}/g);
    for (const match of toolMatches) {
      const toolsSection = match[1];
      const pagesSection = match[2];
      
      // Extract individual tool routes
      const toolRouteMatches = toolsSection.matchAll(/(\w+):\s*\{[\s\S]*?path:\s*['"`]([^'"`]+)['"`]/g);
      for (const toolMatch of toolRouteMatches) {
        const toolKey = toolMatch[1];
        const toolPath = toolMatch[2];
        routes.tools[toolKey] = { path: toolPath };
      }
      
      // Extract individual page routes
      const pageRouteMatches = pagesSection.matchAll(/(\w+):\s*\{[\s\S]*?path:\s*['"`]([^'"`]+)['"`]/g);
      for (const pageMatch of pageRouteMatches) {
        const pageKey = pageMatch[1];
        const pagePath = pageMatch[2];
        routes.pages[pageKey] = { path: pagePath };
      }
    }
    
    return routes;
  } catch (error) {
    console.error('Error reading routes file:', error.message);
    return null;
  }
}

function main() {
  console.log('🔍 Generating sitemap.xml from routes.js...');
  
  // Extract routes from the routes.js file
  const routes = extractRoutesFromFile();
  
  if (!routes) {
    console.error('❌ Failed to extract routes from routes.js');
    process.exit(1);
  }
  
  console.log(`📊 Found ${Object.keys(routes.tools).length} tools and ${Object.keys(routes.pages).length} pages`);
  
  // Generate the sitemap XML
  const sitemapXML = generateSitemapXML(routes);
  
  try {
    // Ensure the public directory exists
    const publicDir = path.dirname(SITEMAP_OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write the sitemap to file
    fs.writeFileSync(SITEMAP_OUTPUT_PATH, sitemapXML, 'utf8');
    
    console.log(`✅ Sitemap generated successfully at: ${SITEMAP_OUTPUT_PATH}`);
    console.log(`📅 Last modified: ${getCurrentDate()}`);
    console.log(`🌐 Base URL: ${BASE_URL}`);
    
    // Log some statistics
    const totalUrls = 1 + Object.keys(routes.tools).length + Object.keys(routes.pages).length - 1; // -1 for home page
    console.log(`🔗 Total URLs in sitemap: ${totalUrls}`);
    
  } catch (error) {
    console.error('❌ Error writing sitemap file:', error.message);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSitemapXML, extractRoutesFromFile };
