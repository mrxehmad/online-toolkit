import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { marked } from "marked";
import MetaTags from '../MetaTags';

function MarkdownToHtml() {
  const { darkMode } = useTheme();
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [copyMessage, setCopyMessage] = useState("");

  const convertMarkdown = () => {
    setHtml(marked(markdown));
  };

  const toggleView = () => {
    setShowPreview(!showPreview);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html);
    setCopyMessage("Copied to Clipboard!");
    setTimeout(() => setCopyMessage(""), 2000);
  };

  return (
    <>
      <MetaTags
        title="Markdown to HTML Converter"
        description="Convert Markdown to HTML instantly with our online converter. Features live preview, custom styling options, and support for all standard Markdown syntax."
        keywords={[
          'markdown to html',
          'markdown converter',
          'html converter',
          'markdown editor',
          'markdown preview',
          'markdown translator',
          'markdown formatting',
          'html generator',
          'markdown parser',
          'markdown to html converter'
        ]}
        canonicalUrl="/markdown-to-html"
      />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        } py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Markdown to HTML Converter
            </h1>
            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Convert your Markdown text to HTML instantly
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg rounded-lg p-6`}
            >
              <label className="block text-sm font-medium mb-2">
                Markdown Input
              </label>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm resize-none ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your Markdown here..."
              />

              <button
                onClick={convertMarkdown}
                className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Convert to HTML
              </button>
            </div>

            {/* Output Section */}
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg rounded-lg p-6`}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">HTML Output</label>
                <div className="flex items-center">
                  <span className="mr-2 text-sm">
                    {showPreview ? "Preview" : "Code"}
                  </span>
                  <button
                    onClick={toggleView}
                    className={`relative inline-flex items-center h-6 rounded-full w-11 focus:outline-none ${
                      darkMode ? "bg-gray-600" : "bg-gray-300"
                    }`}
                  >
                    <span className="sr-only">Toggle Preview</span>
                    <span
                      className={`transform transition ease-in-out duration-200 inline-block w-5 h-5 bg-white rounded-full ${
                        showPreview ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
              {showPreview ? (
                <div
                  className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm overflow-auto ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300"
                  }`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <pre
                  className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm overflow-auto ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {html}
                </pre>
              )}
              <button
                onClick={copyToClipboard}
                className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Copy HTML to Clipboard
              </button>
              {copyMessage && (
                <span className="text-green-500 text-sm mt-2 block">
                  {copyMessage}
                </span>
              )}
            </div>
          </div>

          {/* Informational Content */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6`}
          >
            <h2 className="text-2xl font-semibold mb-4">
              Convert Markdown to HTML Effortlessly with Our Tool
            </h2>
            <p className="mb-4">
              Writing content in <strong>Markdown</strong> is simple and
              efficient, but converting it to <strong>HTML</strong> can be a
              challenge if done manually. Our{" "}
              <strong>Markdown to HTML Converter</strong> simplifies this process,
              allowing you to transform your Markdown content into clean, semantic
              HTML with just a few clicks.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Why Use Our Markdown to HTML Converter?
            </h3>
            <p className="mb-4">
              Our <strong>online Markdown converter</strong> is designed to
              streamline your workflow and ensure your content is web-ready. With
              this tool, you can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Convert Markdown to HTML instantly</li>
              <li>Generate clean, semantic, and browser-compatible HTML</li>
              <li>Save time by eliminating manual formatting errors</li>
              <li>Customize output with classes, IDs, or inline styles</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">
              How to Use the Markdown to HTML Converter
            </h3>
            <p className="mb-4">
              Using our Markdown to HTML Converter is straightforward:
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Paste your Markdown content into the input field.</li>
              <li>
                Click the "Convert" button to generate the corresponding HTML.
              </li>
              <li>Copy the formatted HTML output for use in your projects.</li>
              <li>
                Optionally, customize the output to suit your specific needs.
              </li>
            </ol>
            <p className="mb-4">
              This tool is perfect for developers, bloggers, and content creators
              who need to publish web-ready content quickly and efficiently.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Explore More Developer Tools
            </h3>
            <p className="mb-4">
              Enhance your development workflow with our additional tools:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>
                  <a
                    href="/#/tools/code-formatter"
                    className="text-indigo-600 hover:underline"
                  >
                    Code Formatter
                  </a>
                </strong>{" "}
                – Automatically format messy code for better readability.
              </li>
              <li>
                <strong>
                  <a
                    href="tools/json-validator"
                    className="text-indigo-600 hover:underline"
                  >
                    JSON Validator
                  </a>
                </strong>{" "}
                – Validate and debug your JSON data effortlessly.
              </li>
              <li>
                <strong>
                  <a
                    href="/curl-generator"
                    className="text-indigo-600 hover:underline"
                  >
                    Curl Generator
                  </a>
                </strong>{" "}
                – Generate `curl` commands for API testing and automation.
              </li>
            </ul>
            <p className="mb-4">
              By using these tools together, you can streamline your development
              process and focus on what truly matters—building great software.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Start Converting Markdown to HTML Today!
            </h3>
            <p>
              Don't waste time manually converting Markdown to HTML. Use our{" "}
              <strong>Markdown to HTML Converter</strong> to instantly generate
              clean, professional-grade HTML. Try it now and explore our other
              helpful tools to supercharge your workflow!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MarkdownToHtml;
