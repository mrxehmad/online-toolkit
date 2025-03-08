import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import { ThemeProvider } from './context/ThemeContext';

// Import tool components
import MortgageCalculator from './components/tools/MortgageCalculator';
import InvestmentCalculator from './components/tools/InvestmentCalculator';
import TaxCalculator from './components/tools/TaxCalculator';
import CodeFormatter from './components/tools/CodeFormatter';
import JsonValidator from './components/tools/JsonValidator';
import CurlGenerator from './components/tools/CurlGenerator';
import SocialMediaAnalyzer from './components/tools/SocialMediaAnalyzer';
import HashtagGenerator from './components/tools/HashtagGenerator';
import MarkdownToHtml from './components/tools/MarkdownToHtml';

// Import pages
import TermsAndConditions from './components/pages/TermsAndConditions';
import PrivacyPolicy from './components/pages/PrivacyPolicy';
import ContactUs from './components/pages/ContactUs';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* <Route path="/" element={<Home />} />
              <Route path="/tools/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/tools/investment-calculator" element={<InvestmentCalculator />} />
              <Route path="/tools/tax-calculator" element={<TaxCalculator />} />
              <Route path="/tools/code-formatter" element={<CodeFormatter />} />
              <Route path="/tools/json-validator" element={<JsonValidator />} />
              <Route path="/tools/curl-generator" element={<CurlGenerator />} />
              <Route path="/tools/social-media-analyzer" element={<SocialMediaAnalyzer />} />
              <Route path="/tools/hashtag-generator" element={<HashtagGenerator />} />
              <Route path="/tools/markdown-to-html" element={<MarkdownToHtml />} /> */}
              <Route path="/" element={<Home />} />
              <Route path="/mortgage-calculator" element={<MortgageCalculator />} />
              <Route path="/investment-calculator" element={<InvestmentCalculator />} />
              <Route path="/tax-calculator" element={<TaxCalculator />} />
              <Route path="/code-formatter" element={<CodeFormatter />} />
              <Route path="/json-validator" element={<JsonValidator />} />
              <Route path="/curl-generator" element={<CurlGenerator />} />
              <Route path="/social-media-analyzer" element={<SocialMediaAnalyzer />} />
              <Route path="/hashtag-generator" element={<HashtagGenerator />} />
              <Route path="/markdown-to-html" element={<MarkdownToHtml />} />
              
              {/* Pages */}
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
