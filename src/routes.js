import path from 'path-browserify';
import { lazy } from 'react';

// Tool components with more granular splitting
export const routes = {
  tools: {
    browserInfoDetector: {
      path: '/browser-info-detector',
      component: lazy(() => import(/* webpackChunkName: "browser-info" */ './components/tools/BrowserInfoDetector')),
    },
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
    wysiwygMarkdownNotes: {
      path: '/wysiwyg-markdown-notes',
      component: lazy(() => import(/* webpackChunkName: "wysiwyg-notes" */ './components/tools/WysiwygMarkdownNotes')),
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
    uuidGenerator: {
      path: '/uuid-generator',
      component: lazy(() => import(/* webpackChunkName: "uuid" */ './components/tools/UuidGenerator')),
    },
    portGenerator: {
      path: '/port-generator',
      component: lazy(() => import(/* webpackChunkName: "port" */ './components/tools/PortGenerator')),
    },
    dockerConverter: {
      path: '/docker-converter',
      component: lazy(() => import(/* webpackChunkName: "docker" */ './components/tools/DockerConverter')),
    },
    stringObfuscator: {
      path: '/string-obfuscator',
      component: lazy(() => import(/* webpackChunkName: "obfuscator" */ './components/tools/StringObfuscator')),
    },
    base64Converter: {
      path: '/base64-converter',
      component: lazy(() => import(/* webpackChunkName: "base64" */ './components/tools/Base64Converter')),
    },
    chmodCalculator: {
      path: '/chmod-calculator',
      component: lazy(() => import(/* webpackChunkName: "chmod" */ './components/tools/ChmodCalculator')),
    },
    yamlFormatter: {
      path: '/yaml-formatter',
      component: lazy(() => import(/* webpackChunkName: "yaml" */ './components/tools/YamlFormatter')),
    },
    adminDashboard: {
      path: '/admin',
      component: lazy(() => import(/* webpackChunkName: "admin" */ './components/tools/AdminDashboard')),
    },
    base64FileConverter: {
      path: '/base64-file-converter',
      component: lazy(() => import(/* webpackChunkName: "base64-file" */ './components/tools/Base64FileConverter')),
    },
    googleDorkGenerator: {
      path: '/google-dork-generator',
      component: lazy(() => import(/* webpackChunkName: "dork" */ './components/tools/GoogleDorkGenerator')),
    },
    webcamTester: {
      path: '/webcam-tester',
      component: lazy(() => import('./components/tools/WebcamTester')),
    },
    screenRecorder: {
      path: '/screen-recorder',
      component: lazy(() => import(/* webpackChunkName: "screen-recorder" */ './components/tools/ScreenRecorder')),
    },
    audioRecorder: {
      path: '/audio-recorder',
      component: lazy(() => import(/* webpackChunkName: "audio-recorder" */ './components/tools/AudioRecorder')),
    },
    youtubeThumbnailDownloader: {
      path: '/youtube-thumbnail-downloader',
      component: lazy(() => import(/* webpackChunkName: "youtube-thumbnail" */ './components/tools/ytthumbnail')),
    },
    youtubeCaptionDownloader: {
      path: '/youtube-caption-downloader',
      component: lazy(() => import(/* webpackChunkName: "youtube-caption" */ './components/tools/ytSRT')),
    },
    resumeBuilder: {
      path: '/resume-builder',
      component: lazy(() => import(/* webpackChunkName: "resume" */ './components/tools/resumebuilder')),
    },
    imageCompressor: {
      path: '/image-compressor',
      component: lazy(() => import(/* webpackChunkName: "image-compressor" */ './components/tools/image-compress')),
    },
    videoGifConverter: {
      path: '/video-gif-converter',
      component: lazy(() => import(/* webpackChunkName: "video-gif" */ './components/tools/videotogif')),
    },
    csvToExcel: {
      path: '/csv-to-excel',
      component: lazy(() => import(/* webpackChunkName: "csv-to-excel" */ './components/tools/csvtoexl')),
    },
    colorPaletteGenerator: {
      path: '/color-palette-generator',
      component: lazy(() => import(/* webpackChunkName: "color-palette" */ './components/tools/color-palet')),
    },
    csvGraphs: {
      path: '/csv-graphs',
      component: lazy(() => import(/* webpackChunkName: "csv-graphs" */ './components/tools/csvgraphs')),
    },
    regexPlayground: {
      path: '/regex-playground',
      component: lazy(() => import(/* webpackChunkName: "regex-playground" */ './components/tools/regex-playground')),
    },
    weatherDashboard: {
      path: '/weather-dashboard',
      component: lazy(() => import(/* webpackChunkName: "weather-dashboard" */ './components/tools/weatherapi')),
    },
    stockCryptoTracker: {
      path: '/stock-crypto-tracker',
      component: lazy(() => import(/* webpackChunkName: "stock-crypto" */ './components/tools/market-tracker')),
    },  
    seoMetaGenerator: {
      path: '/seo-meta-generator',
      component: lazy(() => import(/* webpackChunkName: "seo-meta" */ './components/tools/meta-tag')),
    },
    currencyConverter: {
      path: '/currency-converter',
      component: lazy(() => import(/* webpackChunkName: "currency-converter" */ './components/tools/curency-conv')),
    },
    qrcodeGenerator: {
      path: '/qrcode-generator',
      component: lazy(() => import(/* webpackChunkName: "qrcode" */ './components/tools/qrcode')),
    },
    moleculesVisualizer: {
      path: '/molecules-visualizer',
      component: lazy(() => import(/* webpackChunkName: "molecules-visualizer" */ './components/tools/molecules-visual')),
    },
    typingTest: {
      path: '/typing-test',
      component: lazy(() => import(/* webpackChunkName: "typing-test" */ './components/tools/typing-test')),
    },
    piholeRegexPlayground: {
      path: '/pihole-regex-playground',
      component: lazy(() => import(/* webpackChunkName: "pihole-regex-playground" */ './components/tools/pihole-regex-playground')),
    },
    pomodaroTimer: {
      path: '/pomodaro-timer',
      component: lazy(() => import(/* webpackChunkName: "pomodaro-timer" */ './components/tools/pomodaro-timer')),
    },
    ytEmbading: {
      path: '/yt-embading',
      component: lazy(() => import(/* webpackChunkName: "yt-embading" */ './components/tools/yt-embading')),
    },
    invoiceGenerator: {
      path: '/invoice-generator',
      component: lazy(() => import(/* webpackChunkName: "invoice" */ './components/tools/invoice')),
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