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
    emiCalculator: {
      path: '/emi-calculator',
      component: lazy(() => import(/* webpackChunkName: "emi-calculator" */ './components/tools/emi')),
    },
    roiCalculator: {
      path: '/roi-calculator',
      component: lazy(() => import(/* webpackChunkName: "roi-calculator" */ './components/tools/roi')),
    },
    twitterCardGenerator: {
      path: '/twitter-card-generator',
      component: lazy(() => import(/* webpackChunkName: "twitter-card-generator" */ './components/tools/twitter-card-generator')),
    },
    FlashcardApp: {
      path: '/flashcard-app',
      component: lazy(() => import(/* webpackChunkName: "flashcard-app" */ './components/tools/FlashcardApp')),
    },
    RobotsTxtGenerator: {
      path: '/robots-txt-generator',
      component: lazy(() => import(/* webpackChunkName: "robots-txt-generator" */ './components/tools/RobotsTxtGenerator')),
    },
    XMLSitemapGenerator: {
      path: '/xml-sitemap-generator',
      component: lazy(() => import(/* webpackChunkName: "xml-sitemap-generator" */ './components/tools/XMLSitemapGenerator')),
    },
    KeywordDensityChecker: {
      path: '/keyword-density-checker',
      component: lazy(() => import(/* webpackChunkName: "keyword-density-checker" */ './components/tools/KeywordDensityChecker')),
    },
    AltTextFinder: {
      path: '/alt-text-finder',
      component: lazy(() => import(/* webpackChunkName: "alt-text-finder" */ './components/tools/AltTextFinder')),
    },
    CanonicalTagGenerator: {
      path: '/canonical-tag-generator',
      component: lazy(() => import(/* webpackChunkName: "canonical-tag-generator" */ './components/tools/CanonicalTagGenerator')),
    },
    HreflangGenerator: {
      path: '/hreflang-generator',
      component: lazy(() => import(/* webpackChunkName: "hreflang-generator" */ './components/tools/HreflangGenerator')),
    },
    MapsEmbedGenerator: {
      path: '/maps-embed-generator',
      component: lazy(() => import(/* webpackChunkName: "maps-embed-generator" */ './components/tools/MapsEmbedGenerator')),
    },
    BMICalculator: {
      path: '/bmi-calculator',
      component: lazy(() => import(/* webpackChunkName: "bmi-calculator" */ './components/tools/BMICalculator')),
    },
    FaviconGenerator: {
      path: '/favicon-generator',
      component: lazy(() => import(/* webpackChunkName: "favicon-generator" */ './components/tools/FaviconGenerator')),
    },
    ExifTool: {
      path: '/exif-tool',
      component: lazy(() => import(/* webpackChunkName: "exif-tool" */ './components/tools/ExifTool')),
    },
    CodeDiffTool: {
      path: '/code-diff-tool',
      component: lazy(() => import(/* webpackChunkName: "code-diff-tool" */ './components/tools/CodeDiffTool')),
    },
    LogFileAnalyzer: {
      path: '/log-file-analyzer',
      component: lazy(() => import(/* webpackChunkName: "log-file-analyzer" */ './components/tools/LogFileAnalyzer')),
    },
    ZipFileManager: {
      path: '/zip-file-manager',
      component: lazy(() => import(/* webpackChunkName: "zip-file-manager" */ './components/tools/ZipRarViewer')),
    },
    PasswordStrengthTester: {
      path: '/password-strength-tester',
      component: lazy(() => import(/* webpackChunkName: "password-strength-tester" */ './components/tools/PasswordStrengthTester')),
    },
    JWTGeneratorValidator: {
      path: '/jwt-generator-validator',
      component: lazy(() => import(/* webpackChunkName: "jwt-generator-validator" */ './components/tools/JWTGeneratorValidator')),
    },
    PDFSplitMergeTool: {
      path: '/pdf-split-merge',
      component: lazy(() => import(/* webpackChunkName: "pdf-split-merge" */ './components/tools/PDFSplitMergeTool')),
    },
    ImageFormatConverter: {
      path: '/image-format-converter',
      component: lazy(() => import(/* webpackChunkName: "image-format-converter" */ './components/tools/ImageFormatConverter')),
    },
    StrongPasswordGenerator: {
      path: '/strong-password-generator',
      component: lazy(() => import(/* webpackChunkName: "strong-password-generator" */ './components/tools/StrongPasswordGenerator')),
    },
    IpGeolocationFinder: {
      path: '/ip-geolocation-finder',
      component: lazy(() => import(/* webpackChunkName: "ip-geolocation-finder" */ './components/tools/IpGeolocationFinder')),
    },
    CSSGradientGenerator: {
      path: '/css-gradient-generator',
      component: lazy(() => import(/* webpackChunkName: "css-gradient-generator" */ './components/tools/CSSGradientGenerator')),
    },
    GlassmorphismGenerator: {
      path: '/glassmorphism-generator',
      component: lazy(() => import(/* webpackChunkName: "glassmorphism-generator" */ './components/tools/GlassmorphismGenerator')),
    },
    BoxShadowGenerator: {
      path: '/box-shadow-generator',
      component: lazy(() => import(/* webpackChunkName: "box-shadow-generator" */ './components/tools/BoxShadowGenerator')),
    },
    SvgIconConverter: {
      path: '/svg-icon-converter',
      component: lazy(() => import(/* webpackChunkName: "svg-icon-converter" */ './components/tools/SvgIconConverter')),
    },
    AsciiArtGenerator: {
      path: '/ascii-art-generator',
      component: lazy(() => import(/* webpackChunkName: "ascii-art-generator" */ './components/tools/AsciiArtGenerator')),
    },
    WorldClockTimezoneConverter: {
      path: '/world-clock-timezone-converter',
      component: lazy(() => import(/* webpackChunkName: "world-clock-timezone-converter" */ './components/tools/WorldClockTimezoneConverter')),
    },
    AgeCalculator: {
      path: '/age-calculator',
      component: lazy(() => import(/* webpackChunkName: "age-calculator" */ './components/tools/AgeCalculator')),
    },
    DateDifferenceCalculator: {
      path: '/date-difference-calculator',
      component: lazy(() => import(/* webpackChunkName: "date-difference-calculator" */ './components/tools/DateDifferenceCalculator')),
    },
    DomainNameGenerator: {
      path: '/domain-name-generator',
      component: lazy(() => import(/* webpackChunkName: "domain-name-generator" */ './components/tools/DomainNameGenerator')),
    },
    UnitConverter: {
      path: '/unit-converter',
      component: lazy(() => import(/* webpackChunkName: "unit-converter" */ './components/tools/UnitConverter')),
    },
    RecipeScaler: {
      path: '/recipe-scaler',
      component: lazy(() => import(/* webpackChunkName: "recipe-scaler" */ './components/tools/RecipeScaler')),
    },
    ExpenseSplitterTool: {
      path: '/expense-splitter',
      component: lazy(() => import(/* webpackChunkName: "expense-splitter" */ './components/tools/ExpenseSplitterTool')),
    },
    JsonBeautifierValidator: {
      path: '/json-beautifier-validator',
      component: lazy(() => import(/* webpackChunkName: "json-beautifier-validator" */ './components/tools/JsonBeautifierValidator')),
    },
    PingLatencyChecker: {
      path: '/ping-latency-checker',
      component: lazy(() => import(/* webpackChunkName: "ping-latency-checker" */ './components/tools/PingLatencyChecker')),
    },
    HttpRequestBuilder: {
      path: '/http-request-builder',
      component: lazy(() => import(/* webpackChunkName: "http-request-builder" */ './components/tools/HttpRequestBuilder')),
    },
    ContentReadabilityScore: {
      path: '/content-readability-score',
      component: lazy(() => import(/* webpackChunkName: "content-readability-score" */ './components/tools/ContentReadabilityScore')),
    },
    WebSocketTester: {
      path: '/web-socket-tester',
      component: lazy(() => import(/* webpackChunkName: "web-socket-tester" */ './components/tools/WebSocketTester')),
    },
    ImageEmbeddingCreator: {
      path: '/image-embedding-creator',
      component: lazy(() => import(/* webpackChunkName: "image-embedding-creator" */ './components/tools/ImageEmbeddingCreator')),
    },
    HtmlCssJsMinifier: {
      path: '/html-css-js-minifier',
      component: lazy(() => import(/* webpackChunkName: "html-css-js-minifier" */ './components/tools/HtmlCssJsMinifier')),
    },
    ColorContrastChecker: {
      path: '/color-contrast-checker',
      component: lazy(() => import(/* webpackChunkName: "color-contrast-checker" */ './components/tools/ColorContrastChecker')),
    },
    ImageToPixelArtGenerator: {
      path: '/image-to-pixel-art-generator',
      component: lazy(() => import(/* webpackChunkName: "image-to-pixel-art-generator" */ './components/tools/ImageToPixelArtGenerator')),
    },
    RssFeedChecker: {
      path: '/rss-feed-checker',
      component: lazy(() => import(/* webpackChunkName: "rss-feed-checker" */ './components/tools/RssFeedChecker')),
    },
    TwitterEmbedCreator: {
      path: '/twitter-embed-creator',
      component: lazy(() => import(/* webpackChunkName: "twitter-embed-creator" */ './components/tools/TwitterEmbedCreator')),
    },
    MorseCodeTranslator: {
      path: '/morse-code-translator',
      component: lazy(() => import(/* webpackChunkName: "morse-code-translator" */ './components/tools/MorseCodeTranslator')),
    },
    FileMetadataExtractorEditorViewer: {
      path: '/file-metadata-extractor-editor-viewer',
      component: lazy(() => import(/* webpackChunkName: "file-metadata-extractor-editor-viewer" */ './components/tools/FileMetadataExtractorEditorViewer')),
    },
    ChecklistTool: {
      path: '/checklist-tool',
      component: lazy(() => import(/* webpackChunkName: "checklist-tool" */ './components/tools/ChecklistCard')),
    },
    AudioPitchSpeedChanger: {
      path: '/audio-pitch-speed-changer',
      component: lazy(() => import(/* webpackChunkName: "audio-pitch-speed-changer" */ './components/tools/AudioPitchSpeedChanger')),
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