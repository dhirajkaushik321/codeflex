'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SuccessCelebration from './SuccessCelebration';

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  
  // Skills
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  softSkills: string[];
  
  // Experience
  experienceLevel: string;
  yearsOfExperience: string;
  currentRole: string;
  company: string;
  
  // Education
  educationLevel: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
  
  // Interests
  preferredJobRoles: string[];
  codingInterests: string[];
  preferredTechnologies: string[];
  careerGoals: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  linkedinUrl: '',
  githubUrl: '',
  programmingLanguages: [],
  frameworks: [],
  databases: [],
  tools: [],
  softSkills: [],
  experienceLevel: '',
  yearsOfExperience: '',
  currentRole: '',
  company: '',
  educationLevel: '',
  institution: '',
  fieldOfStudy: '',
  graduationYear: '',
  preferredJobRoles: [],
  codingInterests: [],
  preferredTechnologies: [],
  careerGoals: '',
};

const steps = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Skills', icon: '⚡' },
  { id: 3, title: 'Experience', icon: '💼' },
  { id: 4, title: 'Education', icon: '🎓' },
  { id: 5, title: 'Interests', icon: '🎯' },
];

const programmingLanguages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Dart'
];

const frameworks = [
  'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
  'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI'
];

const databases = [
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
  'Cassandra', 'DynamoDB', 'Firebase', 'Supabase'
];

const tools = [
  'Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'GCP',
  'Figma', 'Postman', 'VS Code', 'IntelliJ', 'Eclipse'
];

const softSkills = [
  'Problem Solving', 'Communication', 'Teamwork', 'Leadership', 'Time Management',
  'Critical Thinking', 'Adaptability', 'Creativity', 'Analytical Skills'
];

const jobRoles = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
  'Data Scientist', 'Machine Learning Engineer', 'Mobile Developer', 'QA Engineer',
  'Product Manager', 'UI/UX Designer', 'System Administrator', 'Cloud Engineer'
];

const codingInterests = [
  'Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'DevOps',
  'Cybersecurity', 'Game Development', 'Blockchain', 'IoT', 'Cloud Computing'
];

export default function DeveloperSignupForm({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData] = useState<FormData>(initialFormData);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // First, create the basic account if not already done
      // In a real app, you'd call: await apiService.signup(signupData);
      console.log('Form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success celebration
      setShowSuccessCelebration(true);
      
      // Call the completion callback after celebration
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 4000); // Wait for celebration to complete

      // Update user profile completion
      updateUser({ isProfileComplete: true });
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error - show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} />;
      case 2:
        return <SkillsStep formData={formData} />;
      case 3:
        return <ExperienceStep formData={formData} />;
      case 4:
        return <EducationStep formData={formData} />;
      case 5:
        return <InterestsStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Your Profile
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Help us tailor the perfect content and questions for your learning journey
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <motion.div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${
                        currentStep >= step.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 transition-all duration-300 ${
                        currentStep > step.id
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8"
          >
            {renderStepContent()}
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={() => {
                // Save progress functionality
                console.log('Saving progress...');
              }}
              className="px-6 py-3 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
            >
              Save Progress
            </button>

            {currentStep === steps.length ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Completing...
                  </div>
                ) : (
                  'Complete Profile'
                )}
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                }}
                className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Next
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Success Celebration */}
      <SuccessCelebration
        isVisible={showSuccessCelebration}
        onComplete={() => setShowSuccessCelebration(false)}
        message="Profile completed successfully! Welcome to CodeVeer. Let&apos;s start your learning journey!"
      />
    </>
  );
}

// Step Components
function BasicInfoStep({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Let&apos;s start with your basic information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, firstName: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, lastName: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, email: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, phone: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, location: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="City, Country"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.linkedinUrl}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, githubUrl: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>
    </div>
  );
}

function SkillsStep({ formData }: { formData: FormData }) {
  const renderSkillSection = (title: string, skills: string[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {skills.map((skill) => (
          <motion.button
            key={skill}
            type="button"
            onClick={() => {
              if (formData.programmingLanguages.includes(skill)) {
                setFormData(prev => ({
                  ...prev,
                  programmingLanguages: prev.programmingLanguages.filter(s => s !== skill)
                }));
              } else {
                setFormData(prev => ({
                  ...prev,
                  programmingLanguages: [...prev.programmingLanguages, skill]
                }));
              }
            }}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
              formData.programmingLanguages.includes(skill)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {skill}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          What are your skills?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select all the technologies and skills you&apos;re familiar with
        </p>
      </div>

      {renderSkillSection('Programming Languages', programmingLanguages)}
      {renderSkillSection('Frameworks & Libraries', frameworks)}
      {renderSkillSection('Databases', databases)}
      {renderSkillSection('Tools & Platforms', tools)}
      {renderSkillSection('Soft Skills', softSkills)}
    </div>
  );
}

function ExperienceStep({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Work Experience
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your professional background
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Experience Level *
          </label>
          <select
            value={formData.experienceLevel}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, experienceLevel: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="">Select experience level</option>
            <option value="entry">Entry Level (0-2 years)</option>
            <option value="mid">Mid Level (3-5 years)</option>
            <option value="senior">Senior Level (6-10 years)</option>
            <option value="lead">Lead/Principal (10+ years)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Years of Experience
          </label>
          <select
            value={formData.yearsOfExperience}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, yearsOfExperience: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="">Select years</option>
            {[...Array(21)].map((_, i) => (
              <option key={i} value={i.toString()}>
                {i} {i === 1 ? 'year' : 'years'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Current Role
          </label>
          <input
            type="text"
            value={formData.currentRole}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, currentRole: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="e.g., Senior Frontend Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, company: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="Enter company name"
          />
        </div>
      </div>
    </div>
  );
}

function EducationStep({ formData }: { formData: FormData }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Education
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your educational background
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Education Level *
          </label>
          <select
            value={formData.educationLevel}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, educationLevel: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="">Select education level</option>
            <option value="high-school">High School</option>
            <option value="associate">Associate&apos;s Degree</option>
            <option value="bachelor">Bachelor&apos;s Degree</option>
            <option value="master">Master&apos;s Degree</option>
            <option value="phd">PhD</option>
            <option value="self-taught">Self-Taught</option>
            <option value="bootcamp">Coding Bootcamp</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Institution
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, institution: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="University, College, or Bootcamp name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Field of Study
          </label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, fieldOfStudy: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="e.g., Computer Science, Software Engineering"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Graduation Year
          </label>
          <select
            value={formData.graduationYear}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, graduationYear: e.target.value }));
            }}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
          >
            <option value="">Select year</option>
            {[...Array(25)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

function InterestsStep({ formData }: { formData: FormData }) {
  const renderInterestSection = (title: string, items: string[]) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item) => (
          <motion.button
            key={item}
            type="button"
            onClick={() => {
              if (formData.preferredJobRoles.includes(item)) {
                setFormData(prev => ({
                  ...prev,
                  preferredJobRoles: prev.preferredJobRoles.filter(i => i !== item)
                }));
              } else {
                setFormData(prev => ({
                  ...prev,
                  preferredJobRoles: [...prev.preferredJobRoles, item]
                }));
              }
            }}
            className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${
              formData.preferredJobRoles.includes(item)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {item}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          What interests you?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help us personalize your learning experience
        </p>
      </div>

      {renderInterestSection('Preferred Job Roles', jobRoles)}
      {renderInterestSection('Coding Interests', codingInterests)}
      {renderInterestSection('Preferred Technologies', programmingLanguages)}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Career Goals
        </h3>
        <textarea
          value={formData.careerGoals}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, careerGoals: e.target.value }));
          }}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
          placeholder="Tell us about your career goals and what you hope to achieve..."
        />
      </div>
    </div>
  );
} 