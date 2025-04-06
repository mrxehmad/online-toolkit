import { lazy } from 'react';

// Tool components with more granular splitting
export const routes = {
  tools: {
    cryptoConverter: {
      path: '/crypto-converter',
      component: lazy(() => import(/* webpackChunkName: "crypto" */ './components/tools/CryptoConverter')),
    },
    mortgageCalculator: {
      path: '/mortgage-calculator',
      component: lazy(() => import(/* webpackChunkName: "mortgage" */ './components/tools/MortgageCalculator')),
    },
    investmentCalculator: {
      path: '/investment-calculator',
      component: lazy(() => import(/* webpackChunkName: "investment" */ './components/tools/InvestmentCalculator')),
    },
    taxCalculator: {
      path: '/tax-calculator',
      component: lazy(() => import(/* webpackChunkName: "tax" */ './components/tools/TaxCalculator')),
    },
    codeFormatter: {
      path: '/code-formatter',
      component: lazy(() => import(/* webpackChunkName: "code-format" */ './components/tools/CodeFormatter')),
    },
    jsonValidator: {
      path: '/json-validator',
      component: lazy(() => import(/* webpackChunkName: "json" */ './components/tools/JsonValidator')),
    },
    curlGenerator: {
      path: '/curl-generator',
      component: lazy(() => import(/* webpackChunkName: "curl" */ './components/tools/CurlGenerator')),
    },
    socialMediaAnalyzer: {
      path: '/social-media-analyzer',
      component: lazy(() => import(/* webpackChunkName: "social" */ './components/tools/SocialMediaAnalyzer')),
    },
    hashtagGenerator: {
      path: '/hashtag-generator',
      component: lazy(() => import(/* webpackChunkName: "hashtag" */ './components/tools/HashtagGenerator')),
    },
    markdownToHtml: {
      path: '/markdown-to-html',
      component: lazy(() => import(/* webpackChunkName: "markdown" */ './components/tools/MarkdownToHtml')),
    },
    netIncomeTaxCalculator: {
      path: '/net-income-tax-calculator',
      component: lazy(() => import(/* webpackChunkName: "net-tax" */ './components/tools/NetIncomeTaxCalculator')),
    },
    piholeRegexGenerator: {
      path: '/pihole-regex-generator',
      component: lazy(() => import(/* webpackChunkName: "pihole" */ './components/tools/PiholeRegexGenerator')),
    },
    crontabGenerator: {
      path: '/crontab-generator',
      component: lazy(() => import(/* webpackChunkName: "crontab" */ './components/tools/CrontabGenerator')),
    },
  },
  pages: {
    home: {
      path: '/',
      component: lazy(() => import(/* webpackChunkName: "home" */ './components/Home')),
    },
    notFound: {
      path: '*',
      component: lazy(() => import(/* webpackChunkName: "404" */ './components/NotFound')),
    },
    terms: {
      path: '/terms',
      component: lazy(() => import(/* webpackChunkName: "terms" */ './components/pages/TermsAndConditions')),
    },
    privacy: {
      path: '/privacy',
      component: lazy(() => import(/* webpackChunkName: "privacy" */ './components/pages/PrivacyPolicy')),
    },
    contact: {
      path: '/contact',
      component: lazy(() => import(/* webpackChunkName: "contact" */ './components/pages/ContactUs')),
    },
  },
}; 