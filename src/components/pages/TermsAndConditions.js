import { useTheme } from '../../context/ThemeContext';

function TermsAndConditions() {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Terms and Conditions
        </h1>
        
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 space-y-6`}>
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Toolkit Website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Disclaimer</h2>
            <p className="mb-4">
              The materials on Toolkit Website are provided on an 'as is' basis. Toolkit Website makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Limitations</h2>
            <p className="mb-4">
              In no event shall Toolkit Website or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Toolkit Website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Revisions and Errata</h2>
            <p className="mb-4">
              The materials appearing on Toolkit Website could include technical, typographical, or photographic errors. Toolkit Website does not warrant that any of the materials on its website are accurate, complete or current.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Links</h2>
            <p className="mb-4">
              Toolkit Website has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Toolkit Website of the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
            <p className="mb-4">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions; 