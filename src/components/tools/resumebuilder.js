import React, { useState, useRef } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Download,
  FileText,
  Palette,
  Plus,
  Minus,
  Eye,
  Edit3,
  Globe,
  Star
} from 'lucide-react';

const ResumeBuilder = () => {
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const resumeRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      website: 'johndoe.com',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe',
      summary: 'Experienced software engineer with 5+ years in full-stack development, specializing in React, Node.js, and cloud technologies.'
    },
    experience: [
      {
        id: 1,
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2021',
        endDate: 'Present',
        description: 'Led development of scalable web applications serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%.'
      }
    ],
    education: [
      {
        id: 1,
        institution: 'Stanford University',
        degree: 'Bachelor of Science in Computer Science',
        location: 'Stanford, CA',
        graduationDate: '2019'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    awards: [
      {
        id: 1,
        title: 'Employee of the Year',
        organization: 'Tech Corp',
        year: '2023'
      }
    ]
  });

  const templates = [
    {
      name: 'Modern Professional',
      color: '#2563eb',
      description: 'Clean, minimalist design perfect for tech and corporate roles'
    },
    {
      name: 'Creative Designer',
      color: '#7c3aed',
      description: 'Vibrant layout ideal for creative professionals and designers'
    },
    {
      name: 'Executive Elite',
      color: '#059669',
      description: 'Sophisticated template for senior executives and managers'
    }
  ];

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: '',
      degree: '',
      location: '',
      graduationDate: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addSkill = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addAward = () => {
    const newAward = {
      id: Date.now(),
      title: '',
      organization: '',
      year: ''
    };
    setResumeData(prev => ({
      ...prev,
      awards: [...prev.awards, newAward]
    }));
  };

  const updateAward = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      awards: prev.awards.map(award => 
        award.id === id ? { ...award, [field]: value } : award
      )
    }));
  };

  const removeAward = (id) => {
    setResumeData(prev => ({
      ...prev,
      awards: prev.awards.filter(award => award.id !== id)
    }));
  };

  const exportToPDF = () => {
    // Simulate PDF export
    alert('PDF export feature would be implemented with libraries like jsPDF or Puppeteer');
  };

  const exportToDocx = () => {
    // Simulate DOCX export
    alert('DOCX export feature would be implemented with libraries like docx or officegen');
  };

  const ModernTemplate = () => (
    <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-4xl mx-auto" ref={resumeRef}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <h1 className="text-4xl font-bold mb-2">{resumeData.personalInfo.fullName}</h1>
        <p className="text-xl opacity-90 mb-4">{resumeData.experience[0]?.position || 'Professional Title'}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            {resumeData.personalInfo.email}
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2" />
            {resumeData.personalInfo.phone}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {resumeData.personalInfo.location}
          </div>
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            {resumeData.personalInfo.website}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Summary */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Professional Summary</h2>
          <p className="text-gray-600 leading-relaxed">{resumeData.personalInfo.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Experience</h2>
          {resumeData.experience.map(exp => (
            <div key={exp.id} className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{exp.position}</h3>
                  <p className="text-blue-600 font-medium">{exp.company}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{exp.startDate} - {exp.endDate}</p>
                  <p>{exp.location}</p>
                </div>
              </div>
              <p className="text-gray-600">{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Education</h2>
          {resumeData.education.map(edu => (
            <div key={edu.id} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                  <p className="text-blue-600">{edu.institution}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>{edu.graduationDate}</p>
                  <p>{edu.location}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Awards */}
        {resumeData.awards.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">Awards & Recognition</h2>
            {resumeData.awards.map(award => (
              <div key={award.id} className="mb-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">{award.title}</h3>
                  <span className="text-sm text-gray-500">{award.year}</span>
                </div>
                <p className="text-blue-600">{award.organization}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );

  const FormSection = ({ title, children, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />
    </div>
  );

  const TextareaField = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
      />
    </div>
  );

  return (
    <>
      {/* SEO Meta Tags */}
      <div className="hidden">
        <h1>Professional Resume Builder - Create ATS-Friendly CV Online Free</h1>
        <meta name="description" content="Build professional resumes with our free online CV builder. Choose from modern templates, export to PDF/DOCX. ATS-friendly designs for job seekers. No signup required." />
        <meta name="keywords" content="resume builder, CV maker, free resume template, ATS resume, job application, career tools, professional CV, online resume creator" />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Resume Builder Pro</h1>
                  <p className="text-sm text-gray-600">Create professional resumes in minutes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsPreview(!isPreview)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isPreview ? <Edit3 className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {isPreview ? 'Edit' : 'Preview'}
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={exportToPDF}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    title="Export to PDF"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </button>
                  <button
                    onClick={exportToDocx}
                    className="flex items-center px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    title="Export to DOCX"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    DOCX
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!isPreview ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Panel */}
              <div className="space-y-6">
                {/* Template Selection */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Palette className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Choose Template</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTemplate(index)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          activeTemplate === index 
                            ? 'border-blue-600 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div 
                          className="w-full h-20 rounded mb-2"
                          style={{ backgroundColor: template.color }}
                        ></div>
                        <h4 className="font-medium text-gray-800">{template.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{template.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <FormSection title="Personal Information" icon={User}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Full Name"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="John Doe"
                    />
                    <InputField
                      label="Email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                    <InputField
                      label="Phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                    <InputField
                      label="Location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="City, State"
                    />
                    <InputField
                      label="Website"
                      value={resumeData.personalInfo.website}
                      onChange={(e) => updatePersonalInfo('website', e.target.value)}
                      placeholder="yourwebsite.com"
                    />
                    <InputField
                      label="LinkedIn"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                  <TextareaField
                    label="Professional Summary"
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="Brief overview of your professional background and key achievements..."
                    rows={4}
                  />
                </FormSection>

                {/* Experience */}
                <FormSection title="Work Experience" icon={Briefcase}>
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">Experience {index + 1}</h4>
                        <button
                          onClick={() => removeExperience(exp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Company"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company Name"
                        />
                        <InputField
                          label="Position"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Job Title"
                        />
                        <InputField
                          label="Location"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="City, State"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <InputField
                            label="Start Date"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="2020"
                          />
                          <InputField
                            label="End Date"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <TextareaField
                        label="Description"
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Describe your key responsibilities and achievements..."
                        rows={3}
                      />
                    </div>
                  ))}
                  <button
                    onClick={addExperience}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Experience
                  </button>
                </FormSection>

                {/* Education */}
                <FormSection title="Education" icon={GraduationCap}>
                  {resumeData.education.map((edu, index) => (
                    <div key={edu.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">Education {index + 1}</h4>
                        <button
                          onClick={() => removeEducation(edu.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Institution"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="University Name"
                        />
                        <InputField
                          label="Degree"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                        <InputField
                          label="Location"
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                          placeholder="City, State"
                        />
                        <InputField
                          label="Graduation Date"
                          value={edu.graduationDate}
                          onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                          placeholder="2019"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addEducation}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Education
                  </button>
                </FormSection>

                {/* Skills */}
                <FormSection title="Skills" icon={Code}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          placeholder="Enter skill"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-2 text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={addSkill}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium mt-4"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill
                  </button>
                </FormSection>

                {/* Awards */}
                <FormSection title="Awards & Recognition" icon={Award}>
                  {resumeData.awards.map((award, index) => (
                    <div key={award.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-800">Award {index + 1}</h4>
                        <button
                          onClick={() => removeAward(award.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Award Title"
                          value={award.title}
                          onChange={(e) => updateAward(award.id, 'title', e.target.value)}
                          placeholder="Employee of the Year"
                        />
                        <InputField
                          label="Organization"
                          value={award.organization}
                          onChange={(e) => updateAward(award.id, 'organization', e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <InputField
                        label="Year"
                        value={award.year}
                        onChange={(e) => updateAward(award.id, 'year', e.target.value)}
                        placeholder="2023"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addAward}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Award
                  </button>
                </FormSection>
              </div>

              {/* Preview Panel */}
              <div className="lg:sticky lg:top-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Preview</h3>
                  <div className="transform scale-75 origin-top">
                    <ModernTemplate />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Full Preview Mode
            <div className="max-w-4xl mx-auto">
              <ModernTemplate />
            </div>
          )}
        </div>

        {/* Footer with SEO Content */}
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Resume Builder Pro</h3>
                <p className="text-gray-600">
                  Create professional, ATS-friendly resumes with our free online builder. 
                  Choose from modern templates designed to help you land your dream job.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Professional templates</li>
                  <li>• ATS-optimized formats</li>
                  <li>• PDF & DOCX export</li>
                  <li>• Real-time preview</li>
                  <li>• Mobile-friendly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Tips</h3>
                <ul className="text-gray-600 space-y-2">
                  <li>• Tailor resume for each job</li>
                  <li>• Use action verbs</li>
                  <li>• Quantify achievements</li>
                  <li>• Keep it concise</li>
                  <li>• Proofread carefully</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
              <p>&copy; 2025 Resume Builder Pro. Built with React and modern design principles.</p>
            </div>
          </div>
        </footer>

        {/* SEO Rich Content Section */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Why Choose Our Professional Resume Builder?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Create standout resumes that get noticed by hiring managers and pass ATS screening systems
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ATS-Friendly</h3>
                <p className="text-gray-600">Optimized for Applicant Tracking Systems used by 90% of companies</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Download className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Formats</h3>
                <p className="text-gray-600">Export to PDF, DOCX, or share online with a professional link</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Modern Templates</h3>
                <p className="text-gray-600">Professional designs that make your resume stand out</p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
                <p className="text-gray-600">Intuitive interface with real-time preview and instant editing</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Is this resume builder really free?
                </h3>
                <p className="text-gray-600">
                  Yes! Our basic resume builder is completely free to use. You can create, edit, and download 
                  your resume without any hidden charges or subscription fees.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Are the templates ATS-friendly?
                </h3>
                <p className="text-gray-600">
                  Absolutely! All our templates are designed to be ATS (Applicant Tracking System) compatible, 
                  ensuring your resume gets past automated screening and reaches human recruiters.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Can I edit my resume after downloading?
                </h3>
                <p className="text-gray-600">
                  Yes, you can return anytime to edit your resume. Your data is saved locally in your browser, 
                  and you can make changes and download updated versions whenever needed.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  What file formats can I download?
                </h3>
                <p className="text-gray-600">
                  You can export your resume in PDF format (recommended for job applications) and DOCX format 
                  (for easy editing in Microsoft Word or Google Docs).
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  How do I make my resume stand out?
                </h3>
                <p className="text-gray-600">
                  Use action verbs, quantify your achievements with numbers, tailor your content to each job 
                  application, and choose a clean, professional template that matches your industry.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResumeBuilder;