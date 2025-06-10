'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useAuth } from '../contexts/AuthContext';
import SuccessCelebration from './SuccessCelebration';
import ProfilePictureUpload from './ProfilePictureUpload';
import { 
  Plus, 
  X, 
  Edit3, 
  Trash2, 
  Calendar,
  Building,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Database,
  Wrench,
  Users,
  Globe,
  Target
} from 'lucide-react';

// Experience interface
interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  technologies?: string[];
}

// Education interface
interface Education {
  id: string;
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  gpa?: string;
  description?: string;
}

interface FormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  profilePicture: string;
  
  // Skills
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  softSkills: string[];
  
  // Experience (legacy + new)
  experienceLevel: string;
  yearsOfExperience: string;
  currentRole: string;
  company: string;
  experiences: Experience[];
  
  // Education (legacy + new)
  educationLevel: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
  education: Education[];
  
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
  profilePicture: '',
  programmingLanguages: [],
  frameworks: [],
  databases: [],
  tools: [],
  softSkills: [],
  experienceLevel: '',
  yearsOfExperience: '',
  currentRole: '',
  company: '',
  experiences: [],
  educationLevel: '',
  institution: '',
  fieldOfStudy: '',
  graduationYear: '',
  education: [],
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
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [customSkills, setCustomSkills] = useState<Record<string, string>>({});
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const { updateUser } = useAuth();

  // Load existing profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('/api/developer/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          
          // Update form data with existing profile information
          setFormData(prev => ({
            ...prev,
            firstName: profileData.firstName || prev.firstName,
            lastName: profileData.lastName || prev.lastName,
            email: profileData.email || prev.email,
            phone: profileData.phone || prev.phone,
            location: profileData.location || prev.location,
            linkedinUrl: profileData.linkedinUrl || prev.linkedinUrl,
            githubUrl: profileData.githubUrl || prev.githubUrl,
            profilePicture: profileData.profilePicture || prev.profilePicture,
            programmingLanguages: profileData.programmingLanguages || prev.programmingLanguages,
            frameworks: profileData.frameworks || prev.frameworks,
            databases: profileData.databases || prev.databases,
            tools: profileData.tools || prev.tools,
            softSkills: profileData.softSkills || prev.softSkills,
            experienceLevel: profileData.experienceLevel || prev.experienceLevel,
            yearsOfExperience: profileData.yearsOfExperience || prev.yearsOfExperience,
            currentRole: profileData.currentRole || prev.currentRole,
            company: profileData.company || prev.company,
            experiences: profileData.experiences || prev.experiences,
            educationLevel: profileData.educationLevel || prev.educationLevel,
            institution: profileData.institution || prev.institution,
            fieldOfStudy: profileData.fieldOfStudy || prev.fieldOfStudy,
            graduationYear: profileData.graduationYear || prev.graduationYear,
            education: profileData.education || prev.education,
            preferredJobRoles: profileData.preferredJobRoles || prev.preferredJobRoles,
            codingInterests: profileData.codingInterests || prev.codingInterests,
            preferredTechnologies: profileData.preferredTechnologies || prev.preferredTechnologies,
            careerGoals: profileData.careerGoals || prev.careerGoals,
          }));
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      updateFormData(field, currentArray.filter(item => item !== value));
    } else {
      updateFormData(field, [...currentArray, value]);
    }
  };

  const addCustomSkill = (field: keyof FormData, value: string) => {
    if (!value.trim()) return;
    
    const currentArray = formData[field] as string[];
    if (!currentArray.includes(value.trim())) {
      updateFormData(field, [...currentArray, value.trim()]);
    }
    setCustomSkills(prev => ({ ...prev, [field]: '' }));
  };

  const removeSkill = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    updateFormData(field, currentArray.filter(item => item !== value));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Send the complete form data to the backend
      const response = await fetch('/api/developer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      console.log('Profile updated successfully:', updatedProfile);
      
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
      // Show error message to user - you can add a toast notification here
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to update profile'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <SkillsStep formData={formData} updateFormData={updateFormData} handleArrayToggle={handleArrayToggle} addCustomSkill={addCustomSkill} removeSkill={removeSkill} customSkills={customSkills} setCustomSkills={setCustomSkills} />;
      case 3:
        return <ExperienceStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <EducationStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <InterestsStep formData={formData} updateFormData={updateFormData} handleArrayToggle={handleArrayToggle} addCustomSkill={addCustomSkill} removeSkill={removeSkill} customSkills={customSkills} setCustomSkills={setCustomSkills} />;
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
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 1
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Previous
            </button>

            <div className="flex gap-4">
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
                  onClick={nextStep}
                  className="px-8 py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Next
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Celebration */}
      <SuccessCelebration
        isVisible={showSuccessCelebration}
        onComplete={() => setShowSuccessCelebration(false)}
        message="Profile completed successfully! Welcome to CodeVeer. Let's start your learning journey!"
      />
    </>
  );
}

// Step Components
function BasicInfoStep({ formData, updateFormData }: { formData: FormData; updateFormData: (field: keyof FormData, value: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Let's start with your basic information
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="mb-8">
        <ProfilePictureUpload
          currentImage={formData.profilePicture}
          onImageUpload={(imageUrl) => updateFormData('profilePicture', imageUrl)}
          onImageRemove={() => updateFormData('profilePicture', '')}
          className="max-w-md mx-auto"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
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
            onChange={(e) => updateFormData('lastName', e.target.value)}
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
            onChange={(e) => updateFormData('email', e.target.value)}
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
            onChange={(e) => updateFormData('phone', e.target.value)}
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
            onChange={(e) => updateFormData('location', e.target.value)}
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
            onChange={(e) => updateFormData('linkedinUrl', e.target.value)}
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
            onChange={(e) => updateFormData('githubUrl', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            placeholder="https://github.com/yourusername"
          />
        </div>
      </div>
    </div>
  );
}

function SkillsStep({ formData, updateFormData, handleArrayToggle, addCustomSkill, removeSkill, customSkills, setCustomSkills }: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void;
  handleArrayToggle: (field: keyof FormData, value: string) => void;
  addCustomSkill: (field: keyof FormData, value: string) => void;
  removeSkill: (field: keyof FormData, value: string) => void;
  customSkills: Record<string, string>;
  setCustomSkills: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const renderSkillBadge = (skill: string, color: string, onRemove?: () => void) => (
    <motion.div
      key={skill}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      <span>{skill}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );

  const renderSkillSection = (title: string, skills: string[], field: keyof FormData, color: string, availableSkills: string[]) => {
    const currentSkills = formData[field] as string[];
    const customSkill = customSkills[field] || '';

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {field === 'programmingLanguages' && <Code className="w-5 h-5 text-blue-600" />}
          {field === 'frameworks' && <Wrench className="w-5 h-5 text-green-600" />}
          {field === 'databases' && <Database className="w-5 h-5 text-purple-600" />}
          {field === 'tools' && <Wrench className="w-5 h-5 text-orange-600" />}
          {field === 'softSkills' && <Users className="w-5 h-5 text-gray-600" />}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        {/* Selected Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {currentSkills.map((skill) => 
            renderSkillBadge(
              skill, 
              color, 
              () => removeSkill(field, skill)
            )
          )}
        </div>
        
        {/* Available Skills */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add from list:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableSkills
              .filter(skill => !currentSkills.includes(skill))
              .map(skill => (
                <motion.button
                  key={skill}
                  onClick={() => handleArrayToggle(field, skill)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={12} />
                  {skill}
                </motion.button>
              ))}
          </div>
        </div>
        
        {/* Custom Skill Input */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add custom skill:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkills(prev => ({ ...prev, [field]: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addCustomSkill(field, customSkill);
                }
              }}
              placeholder="Enter custom skill"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={() => addCustomSkill(field, customSkill)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          What are your skills?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select all the technologies and skills you're familiar with
        </p>
      </div>

      {renderSkillSection(
        'Programming Languages', 
        programmingLanguages, 
        'programmingLanguages',
        'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
        programmingLanguages
      )}
      {renderSkillSection(
        'Frameworks & Libraries', 
        frameworks, 
        'frameworks',
        'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
        frameworks
      )}
      {renderSkillSection(
        'Databases', 
        databases, 
        'databases',
        'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
        databases
      )}
      {renderSkillSection(
        'Tools & Platforms', 
        tools, 
        'tools',
        'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
        tools
      )}
      {renderSkillSection(
        'Soft Skills', 
        softSkills, 
        'softSkills',
        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        softSkills
      )}
    </div>
  );
}

function ExperienceStep({ formData, updateFormData }: { formData: FormData; updateFormData: (field: keyof FormData, value: any) => void }) {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: []
    };
    updateFormData('experiences', [...formData.experiences, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updatedExperiences = formData.experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    updateFormData('experiences', updatedExperiences);
  };

  const removeExperience = (id: string) => {
    updateFormData('experiences', formData.experiences.filter(exp => exp.id !== id));
  };

  const addTechnology = (experienceId: string, technology: string) => {
    if (!technology.trim()) return;
    const experience = formData.experiences.find(exp => exp.id === experienceId);
    if (experience && !experience.technologies?.includes(technology.trim())) {
      updateExperience(experienceId, 'technologies', [...(experience.technologies || []), technology.trim()]);
    }
  };

  const removeTechnology = (experienceId: string, technology: string) => {
    const experience = formData.experiences.find(exp => exp.id === experienceId);
    if (experience) {
      updateExperience(experienceId, 'technologies', experience.technologies?.filter(tech => tech !== technology) || []);
    }
  };

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

      {/* Legacy Experience Fields (for backward compatibility) */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Quick Experience Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => updateFormData('experienceLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              onChange={(e) => updateFormData('yearsOfExperience', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select years</option>
              {[...Array(21)].map((_, i) => (
                <option key={i} value={i.toString()}>
                  {i} {i === 1 ? 'year' : 'years'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Multiple Experiences */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Detailed Work Experience
          </h3>
          <motion.button
            onClick={addExperience}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Add Experience
          </motion.button>
        </div>

        <AnimatePresence>
          {formData.experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                  Experience #{index + 1}
                </h4>
                <button
                  onClick={() => removeExperience(experience.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={experience.title}
                    onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Senior Frontend Developer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={experience.location || ''}
                    onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="City, Country"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="month"
                      value={experience.startDate}
                      onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={experience.endDate || ''}
                      onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                      disabled={experience.isCurrent}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={experience.isCurrent}
                    onChange={(e) => updateExperience(experience.id, 'isCurrent', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    I currently work here
                  </span>
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={experience.description || ''}
                  onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe your role and responsibilities..."
                />
              </div>

              {/* Technologies Used */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Technologies Used
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {experience.technologies?.map((tech) => (
                    <motion.div
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 rounded-full text-sm"
                    >
                      <span>{tech}</span>
                      <button
                        onClick={() => removeTechnology(experience.id, tech)}
                        className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add technology"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTechnology(experience.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addTechnology(experience.id, input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {formData.experiences.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EducationStep({ formData, updateFormData }: { formData: FormData; updateFormData: (field: keyof FormData, value: any) => void }) {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: '',
      description: ''
    };
    updateFormData('education', [...formData.education, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    const updatedEducation = formData.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    updateFormData('education', updatedEducation);
  };

  const removeEducation = (id: string) => {
    updateFormData('education', formData.education.filter(edu => edu.id !== id));
  };

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

      {/* Legacy Education Fields (for backward compatibility) */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          Quick Education Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Education Level
            </label>
            <select
              value={formData.educationLevel}
              onChange={(e) => updateFormData('educationLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select education level</option>
              <option value="high-school">High School</option>
              <option value="associate">Associate's Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
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
              onChange={(e) => updateFormData('institution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              onChange={(e) => updateFormData('fieldOfStudy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Computer Science, Software Engineering"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Graduation Year
            </label>
            <select
              value={formData.graduationYear}
              onChange={(e) => updateFormData('graduationYear', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

      {/* Multiple Education */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Detailed Education
          </h3>
          <motion.button
            onClick={addEducation}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Add Education
          </motion.button>
        </div>

        <AnimatePresence>
          {formData.education.map((education, index) => (
            <motion.div
              key={education.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900 dark:text-white">
                  Education #{index + 1}
                </h4>
                <button
                  onClick={() => removeEducation(education.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Degree/Certificate *
                  </label>
                  <input
                    type="text"
                    value={education.degree}
                    onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Bachelor of Science, Master's Degree"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    value={education.institution}
                    onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="University, College, or Bootcamp name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    value={education.fieldOfStudy}
                    onChange={(e) => updateEducation(education.id, 'fieldOfStudy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Computer Science, Software Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GPA (Optional)
                  </label>
                  <input
                    type="text"
                    value={education.gpa || ''}
                    onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., 3.8/4.0"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="month"
                      value={education.startDate}
                      onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="month"
                      value={education.endDate || ''}
                      onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                      disabled={education.isCurrent}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={education.isCurrent}
                    onChange={(e) => updateEducation(education.id, 'isCurrent', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    I'm currently studying here
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={education.description || ''}
                  onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Describe your studies, achievements, or relevant coursework..."
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {formData.education.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No education added yet.</p>
            <p className="text-sm">Click "Add Education" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InterestsStep({ formData, updateFormData, handleArrayToggle, addCustomSkill, removeSkill, customSkills, setCustomSkills }: { 
  formData: FormData; 
  updateFormData: (field: keyof FormData, value: any) => void;
  handleArrayToggle: (field: keyof FormData, value: string) => void;
  addCustomSkill: (field: keyof FormData, value: string) => void;
  removeSkill: (field: keyof FormData, value: string) => void;
  customSkills: Record<string, string>;
  setCustomSkills: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const renderInterestBadge = (item: string, color: string, onRemove?: () => void) => (
    <motion.div
      key={item}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color}`}
    >
      <span>{item}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </motion.div>
  );

  const renderInterestSection = (title: string, items: string[], field: keyof FormData, color: string, availableItems: string[]) => {
    const currentItems = formData[field] as string[];
    const customItem = customSkills[field] || '';

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {field === 'preferredJobRoles' && <Briefcase className="w-5 h-5 text-teal-600" />}
          {field === 'codingInterests' && <Code className="w-5 h-5 text-indigo-600" />}
          {field === 'preferredTechnologies' && <Wrench className="w-5 h-5 text-pink-600" />}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        {/* Selected Items */}
        <div className="flex flex-wrap gap-2 mb-4">
          {currentItems.map((item) => 
            renderInterestBadge(
              item, 
              color, 
              () => removeSkill(field, item)
            )
          )}
        </div>
        
        {/* Available Items */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Add from list:</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {availableItems
              .filter(item => !currentItems.includes(item))
              .map(item => (
                <motion.button
                  key={item}
                  onClick={() => handleArrayToggle(field, item)}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={12} />
                  {item}
                </motion.button>
              ))}
          </div>
        </div>
        
        {/* Custom Item Input */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add custom item:</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={customItem}
              onChange={(e) => setCustomSkills(prev => ({ ...prev, [field]: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addCustomSkill(field, customItem);
                }
              }}
              placeholder="Enter custom item"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            />
            <button
              onClick={() => addCustomSkill(field, customItem)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

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

      {renderInterestSection(
        'Preferred Job Roles', 
        jobRoles, 
        'preferredJobRoles',
        'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
        jobRoles
      )}
      {renderInterestSection(
        'Coding Interests', 
        codingInterests, 
        'codingInterests',
        'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
        codingInterests
      )}
      {renderInterestSection(
        'Preferred Technologies', 
        programmingLanguages, 
        'preferredTechnologies',
        'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
        programmingLanguages
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Career Goals
          </h3>
        </div>
        <textarea
          value={formData.careerGoals}
          onChange={(e) => updateFormData('careerGoals', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-none"
          placeholder="Tell us about your career goals and what you hope to achieve..."
        />
      </div>
    </div>
  );
} 