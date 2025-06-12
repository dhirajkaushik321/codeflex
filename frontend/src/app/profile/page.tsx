'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { 
  Edit3, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Briefcase, 
  GraduationCap,
  Target,
  Code,
  Database,
  Wrench,
  Users,
  Award,
  Calendar,
  Building,
  Globe,
  ExternalLink,
  Save,
  X,
  Plus,
  Trash2,
  Upload,
  FileText,
  User,
  CheckCircle,
  Star,
  Zap,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Rocket,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import { getSignedImageUrl } from '../../utils/imageUtils';
import Footer from '../../components/Footer';
import EnhancedProfileForm from '../../components/EnhancedProfileForm';

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

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  profilePicture?: string;
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  tools: string[];
  softSkills: string[];
  // Legacy experience fields
  experienceLevel?: string;
  yearsOfExperience?: string;
  currentRole?: string;
  company?: string;
  // New multiple experiences
  experiences?: Experience[];
  // Legacy education fields
  educationLevel?: string;
  institution?: string;
  fieldOfStudy?: string;
  graduationYear?: string;
  // New multiple education
  education?: Education[];
  preferredJobRoles: string[];
  codingInterests: string[];
  preferredTechnologies: string[];
  careerGoals?: string;
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [signedProfilePicture, setSignedProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [customSkills, setCustomSkills] = useState<Record<string, string>>({});
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load profile data
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
          const data = await response.json();
          setProfileData(data);
          
          // Get signed URL for profile picture if it exists
          if (data.profilePicture) {
            try {
              const signedUrl = await getSignedImageUrl(data.profilePicture);
              setSignedProfilePicture(signedUrl);
            } catch (error) {
              console.error('Error getting signed URL for profile picture:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const startEditing = (section: string, data: any) => {
    setEditingSection(section);
    
    // Initialize editing data based on the section being edited
    let initialData = { ...data };
    
    if (section === 'skills' && profileData) {
      initialData = {
        ...initialData,
        programmingLanguages: [...profileData.programmingLanguages],
        frameworks: [...profileData.frameworks],
        databases: [...profileData.databases],
        tools: [...profileData.tools]
      };
    } else if (section === 'interests' && profileData) {
      initialData = {
        ...initialData,
        codingInterests: [...profileData.codingInterests],
        preferredJobRoles: [...profileData.preferredJobRoles],
        preferredTechnologies: [...profileData.preferredTechnologies]
      };
    } else if (section === 'softSkills' && profileData) {
      initialData = {
        ...initialData,
        softSkills: [...profileData.softSkills]
      };
    } else if (section === 'experience' && profileData) {
      initialData = {
        ...initialData,
        experiences: profileData.experiences ? [...profileData.experiences] : [],
        experienceLevel: profileData.experienceLevel || '',
        yearsOfExperience: profileData.yearsOfExperience || '',
        currentRole: profileData.currentRole || '',
        company: profileData.company || ''
      };
    } else if (section === 'education' && profileData) {
      initialData = {
        ...initialData,
        education: profileData.education ? [...profileData.education] : [],
        educationLevel: profileData.educationLevel || '',
        institution: profileData.institution || '',
        fieldOfStudy: profileData.fieldOfStudy || '',
        graduationYear: profileData.graduationYear || ''
      };
    }
    
    setEditingData(initialData);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditingData({});
    setCustomSkills({});
  };

  const saveChanges = async () => {
    if (!profileData) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      // Merge the editing data with existing profile data
      const updatedData = { ...profileData, ...editingData };

      const response = await fetch('/api/developer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfileData(updatedProfile);
      setEditingSection(null);
      setEditingData({});
      setCustomSkills({});
      setSaveMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage(`Error: ${error instanceof Error ? error.message : 'Failed to save'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleArrayToggle = (field: keyof ProfileData, value: string) => {
    // Check if we're editing this specific field or if the parent section is being edited
    const isParentEditing = (editingSection === 'skills' && ['programmingLanguages', 'frameworks', 'databases', 'tools'].includes(field)) ||
                           (editingSection === 'interests' && ['codingInterests', 'preferredJobRoles', 'preferredTechnologies'].includes(field)) ||
                           (editingSection === 'softSkills' && field === 'softSkills');
    
    if (!editingData[field] && (editingSection === field || isParentEditing)) {
      setEditingData((prev: any) => ({ ...prev, [field]: profileData?.[field] || [] }));
    }
    
    const currentArray = editingData[field] || profileData?.[field] || [];
    const newArray = currentArray.includes(value) 
      ? currentArray.filter((item: string) => item !== value)
      : [...currentArray, value];
    
    setEditingData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const addCustomSkill = (field: keyof ProfileData, value: string) => {
    if (!value.trim()) return;
    
    // Check if we're editing this specific field or if the parent section is being edited
    const isParentEditing = (editingSection === 'skills' && ['programmingLanguages', 'frameworks', 'databases', 'tools'].includes(field)) ||
                           (editingSection === 'interests' && ['codingInterests', 'preferredJobRoles', 'preferredTechnologies'].includes(field)) ||
                           (editingSection === 'softSkills' && field === 'softSkills');
    
    if (!editingData[field] && (editingSection === field || isParentEditing)) {
      setEditingData((prev: any) => ({ ...prev, [field]: profileData?.[field] || [] }));
    }
    
    const currentArray = editingData[field] || profileData?.[field] || [];
    if (!currentArray.includes(value.trim())) {
      setEditingData((prev: any) => ({ ...prev, [field]: [...currentArray, value.trim()] }));
    }
  };

  const removeSkill = (field: keyof ProfileData, value: string) => {
    // Check if we're editing this specific field or if the parent section is being edited
    const isParentEditing = (editingSection === 'skills' && ['programmingLanguages', 'frameworks', 'databases', 'tools'].includes(field)) ||
                           (editingSection === 'interests' && ['codingInterests', 'preferredJobRoles', 'preferredTechnologies'].includes(field)) ||
                           (editingSection === 'softSkills' && field === 'softSkills');
    
    if (!editingData[field] && (editingSection === field || isParentEditing)) {
      setEditingData((prev: any) => ({ ...prev, [field]: profileData?.[field] || [] }));
    }
    
    const currentArray = editingData[field] || profileData?.[field] || [];
    const newArray = currentArray.filter((item: string) => item !== value);
    setEditingData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  // Experience management functions
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
    setEditingData((prev: any) => ({ 
      ...prev, 
      experiences: [...(prev.experiences || []), newExperience] 
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setEditingData((prev: any) => ({
      ...prev,
      experiences: (prev.experiences || []).map((exp: Experience) => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setEditingData((prev: any) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((exp: Experience) => exp.id !== id)
    }));
  };

  const addExperienceTechnology = (experienceId: string, technology: string) => {
    if (!technology.trim()) return;
    setEditingData((prev: any) => ({
      ...prev,
      experiences: (prev.experiences || []).map((exp: Experience) => {
        if (exp.id === experienceId) {
          const technologies = exp.technologies || [];
          if (!technologies.includes(technology.trim())) {
            return { ...exp, technologies: [...technologies, technology.trim()] };
          }
        }
        return exp;
      })
    }));
  };

  const removeExperienceTechnology = (experienceId: string, technology: string) => {
    setEditingData((prev: any) => ({
      ...prev,
      experiences: (prev.experiences || []).map((exp: Experience) => {
        if (exp.id === experienceId) {
          return { 
            ...exp, 
            technologies: (exp.technologies || []).filter((tech: string) => tech !== technology) 
          };
        }
        return exp;
      })
    }));
  };

  // Education management functions
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
    setEditingData((prev: any) => ({ 
      ...prev, 
      education: [...(prev.education || []), newEducation] 
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    setEditingData((prev: any) => ({
      ...prev,
      education: (prev.education || []).map((edu: Education) => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setEditingData((prev: any) => ({
      ...prev,
      education: (prev.education || []).filter((edu: Education) => edu.id !== id)
    }));
  };

  const handleResumeDataExtracted = (parsedData: any) => {
    // This function is no longer needed since we removed resume upload
    console.log('Resume data extraction removed');
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">No profile data found.</p>
        </div>
      </div>
    );
  }

  const renderSkillBadge = (skill: string, color: string, isEditing = false, onRemove?: () => void) => (
    <motion.span
      key={skill}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2 ${color} ${isEditing ? 'pr-8 relative' : ''}`}
    >
      {skill}
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={12} />
        </button>
      )}
    </motion.span>
  );

  const renderEditableSkills = (title: string, field: keyof ProfileData, skills: string[], color: string, availableSkills: string[]) => {
    // Check if we're editing this specific field or if the parent section is being edited
    const isEditing = editingSection === field || 
                     (editingSection === 'skills' && ['programmingLanguages', 'frameworks', 'databases', 'tools'].includes(field)) ||
                     (editingSection === 'interests' && ['codingInterests', 'preferredJobRoles', 'preferredTechnologies'].includes(field));
    
    const currentSkills = editingData[field] || skills;
    const customSkill = customSkills[field] || '';

    const updateCustomSkill = (value: string) => {
      setCustomSkills((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <div className="flex flex-wrap mb-3">
          {currentSkills.map((skill: string) => 
            renderSkillBadge(
              skill, 
              color, 
              isEditing, 
              isEditing ? () => removeSkill(field, skill) : undefined
            )
          )}
        </div>
        
        {isEditing && (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add from list:</h4>
              <div className="flex flex-wrap gap-2">
                {availableSkills
                  .filter(skill => !currentSkills.includes(skill))
                  .map(skill => (
                    <button
                      key={skill}
                      onClick={() => handleArrayToggle(field, skill)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus size={12} className="inline mr-1" />
                      {skill}
                    </button>
                  ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Add custom skill:</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => updateCustomSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addCustomSkill(field, customSkill);
                      updateCustomSkill('');
                    }
                  }}
                  placeholder="Enter custom skill"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={() => {
                    addCustomSkill(field, customSkill);
                    updateCustomSkill('');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode, editKey?: string) => {
    const isEditing = editingSection === editKey;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              {icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          </div>
          {editKey && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveChanges}
                    disabled={isSaving}
                    className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={cancelEditing}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startEditing(editKey, {})}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit3 size={16} />
                </motion.button>
              )}
            </div>
          )}
        </div>
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Save Message */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              saveMessage.includes('Error') 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}
          >
            {saveMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Your professional information and skills
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8"
            >
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {signedProfilePicture ? (
                    <Image
                      src={signedProfilePicture}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                      fill
                      className="rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </span>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                {profileData.currentRole && (
                  <p className="text-gray-600 dark:text-gray-300">{profileData.currentRole}</p>
                )}
                {profileData.company && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{profileData.company}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                {profileData.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{profileData.email}</span>
                  </div>
                )}
                {profileData.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{profileData.phone}</span>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-700 dark:text-gray-300">{profileData.location}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(profileData.linkedinUrl || profileData.githubUrl) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Social Links</h3>
                  {profileData.linkedinUrl && (
                    <a
                      href={profileData.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                  {profileData.githubUrl && (
                    <a
                      href={profileData.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                    >
                      <Github size={16} />
                      <span>GitHub</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2">
            {/* Experience Section */}
            {renderSection(
              'Experience',
              <Briefcase className="w-5 h-5 text-blue-600" />,
              <div className="space-y-4">
                {editingSection === 'experience' ? (
                  <div className="space-y-6">
                    {/* Legacy Experience Fields */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Role
                          </label>
                          <input
                            type="text"
                            value={editingData.currentRole || profileData.currentRole || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, currentRole: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Senior Developer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={editingData.company || profileData.company || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, company: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Tech Corp"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Experience Level
                          </label>
                          <select
                            value={editingData.experienceLevel || profileData.experienceLevel || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, experienceLevel: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="">Select level</option>
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
                          <input
                            type="text"
                            value={editingData.yearsOfExperience || profileData.yearsOfExperience || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, yearsOfExperience: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., 5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Multiple Experiences */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Experience</h4>
                        <motion.button
                          onClick={addExperience}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus size={14} />
                          Add Experience
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(editingData.experiences || []).map((experience: Experience, index: number) => (
                          <motion.div
                            key={experience.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-md font-medium text-gray-900 dark:text-white">
                                Experience #{index + 1}
                              </h5>
                              <button
                                onClick={() => removeExperience(experience.id)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Job Title *
                                </label>
                                <input
                                  type="text"
                                  value={experience.title}
                                  onChange={(e) => updateExperience(experience.id, 'title', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="e.g., Senior Frontend Developer"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Company *
                                </label>
                                <input
                                  type="text"
                                  value={experience.company}
                                  onChange={(e) => updateExperience(experience.id, 'company', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="Company name"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={experience.location || ''}
                                  onChange={(e) => updateExperience(experience.id, 'location', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="City, Country"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Start Date *
                                  </label>
                                  <input
                                    type="month"
                                    value={experience.startDate}
                                    onChange={(e) => updateExperience(experience.id, 'startDate', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    End Date
                                  </label>
                                  <input
                                    type="month"
                                    value={experience.endDate || ''}
                                    onChange={(e) => updateExperience(experience.id, 'endDate', e.target.value)}
                                    disabled={experience.isCurrent}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={experience.isCurrent}
                                  onChange={(e) => updateExperience(experience.id, 'isCurrent', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  I currently work here
                                </span>
                              </label>
                            </div>

                            <div className="mb-3">
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description
                              </label>
                              <textarea
                                value={experience.description || ''}
                                onChange={(e) => updateExperience(experience.id, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                                placeholder="Describe your role and responsibilities..."
                              />
                            </div>

                            {/* Technologies */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Technologies Used
                              </label>
                              <div className="flex flex-wrap gap-1 mb-2">
                                {(experience.technologies || []).map((tech: string) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full flex items-center gap-1"
                                  >
                                    {tech}
                                    <button
                                      onClick={() => removeExperienceTechnology(experience.id, tech)}
                                      className="hover:text-red-600"
                                    >
                                      <X size={10} />
                                    </button>
                                  </span>
                                ))}
                              </div>
                              <div className="flex gap-1">
                                <input
                                  type="text"
                                  placeholder="Add technology"
                                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      const target = e.target as HTMLInputElement;
                                      if (target.value.trim()) {
                                        addExperienceTechnology(experience.id, target.value.trim());
                                        target.value = '';
                                      }
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                    if (input.value.trim()) {
                                      addExperienceTechnology(experience.id, input.value.trim());
                                      input.value = '';
                                    }
                                  }}
                                  className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {(editingData.experiences || []).length === 0 && (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No detailed experience added yet.</p>
                          <p className="text-xs">Click "Add Experience" to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Legacy Experience Display */}
                    {(profileData.currentRole || profileData.company || profileData.experienceLevel) ? (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Summary</h4>
                        {profileData.currentRole && (
                          <h3 className="font-semibold text-gray-900 dark:text-white">{profileData.currentRole}</h3>
                        )}
                        {profileData.company && (
                          <div className="flex items-center gap-2 mt-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{profileData.company}</span>
                          </div>
                        )}
                        {profileData.experienceLevel && (
                          <div className="flex items-center gap-2 mt-1">
                            <Award className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{profileData.experienceLevel}</span>
                          </div>
                        )}
                        {profileData.yearsOfExperience && (
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{profileData.yearsOfExperience} years of experience</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No experience information added yet.</p>
                        <p className="text-xs">Click the edit button to add your experience.</p>
                      </div>
                    )}

                    {/* Multiple Experience Display */}
                    {profileData.experiences && profileData.experiences.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience History</h4>
                        {profileData.experiences.map((experience: Experience) => (
                          <div key={experience.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900 dark:text-white">{experience.title}</h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {experience.isCurrent ? 'Current' : `${experience.startDate} - ${experience.endDate || 'Present'}`}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{experience.company}</p>
                            {experience.location && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{experience.location}</p>
                            )}
                            {experience.description && (
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{experience.description}</p>
                            )}
                            {experience.technologies && experience.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {experience.technologies.map((tech: string) => (
                                  <span
                                    key={tech}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>,
              'experience'
            )}

            {/* Education Section */}
            {renderSection(
              'Education',
              <GraduationCap className="w-5 h-5 text-blue-600" />,
              <div className="space-y-4">
                {editingSection === 'education' ? (
                  <div className="space-y-6">
                    {/* Legacy Education Fields */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Summary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Education Level
                          </label>
                          <select
                            value={editingData.educationLevel || profileData.educationLevel || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, educationLevel: e.target.value }))}
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
                            value={editingData.institution || profileData.institution || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, institution: e.target.value }))}
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
                            value={editingData.fieldOfStudy || profileData.fieldOfStudy || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, fieldOfStudy: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Computer Science"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Graduation Year
                          </label>
                          <input
                            type="text"
                            value={editingData.graduationYear || profileData.graduationYear || ''}
                            onChange={(e) => setEditingData((prev: any) => ({ ...prev, graduationYear: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., 2020"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Multiple Education */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Education</h4>
                        <motion.button
                          onClick={addEducation}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus size={14} />
                          Add Education
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {(editingData.education || []).map((education: Education, index: number) => (
                          <motion.div
                            key={education.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="text-md font-medium text-gray-900 dark:text-white">
                                Education #{index + 1}
                              </h5>
                              <button
                                onClick={() => removeEducation(education.id)}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Degree/Certificate *
                                </label>
                                <input
                                  type="text"
                                  value={education.degree}
                                  onChange={(e) => updateEducation(education.id, 'degree', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="e.g., Bachelor of Science"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Institution *
                                </label>
                                <input
                                  type="text"
                                  value={education.institution}
                                  onChange={(e) => updateEducation(education.id, 'institution', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="University, College, or Bootcamp name"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Field of Study *
                                </label>
                                <input
                                  type="text"
                                  value={education.fieldOfStudy}
                                  onChange={(e) => updateEducation(education.id, 'fieldOfStudy', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="e.g., Computer Science"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  GPA (Optional)
                                </label>
                                <input
                                  type="text"
                                  value={education.gpa || ''}
                                  onChange={(e) => updateEducation(education.id, 'gpa', e.target.value)}
                                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  placeholder="e.g., 3.8/4.0"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Start Date *
                                  </label>
                                  <input
                                    type="month"
                                    value={education.startDate}
                                    onChange={(e) => updateEducation(education.id, 'startDate', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    End Date
                                  </label>
                                  <input
                                    type="month"
                                    value={education.endDate || ''}
                                    onChange={(e) => updateEducation(education.id, 'endDate', e.target.value)}
                                    disabled={education.isCurrent}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <label className="flex items-center gap-2 mb-2">
                                <input
                                  type="checkbox"
                                  checked={education.isCurrent}
                                  onChange={(e) => updateEducation(education.id, 'isCurrent', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                  I'm currently studying here
                                </span>
                              </label>
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Description (Optional)
                              </label>
                              <textarea
                                value={education.description || ''}
                                onChange={(e) => updateEducation(education.id, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                                placeholder="Describe your studies, achievements, or relevant coursework..."
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {(editingData.education || []).length === 0 && (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No detailed education added yet.</p>
                          <p className="text-xs">Click "Add Education" to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Legacy Education Display */}
                    {(profileData.educationLevel || profileData.institution || profileData.fieldOfStudy) ? (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Summary</h4>
                        {profileData.educationLevel && (
                          <h3 className="font-semibold text-gray-900 dark:text-white">{profileData.educationLevel}</h3>
                        )}
                        {profileData.institution && (
                          <div className="flex items-center gap-2 mt-2">
                            <Building className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{profileData.institution}</span>
                          </div>
                        )}
                        {profileData.fieldOfStudy && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{profileData.fieldOfStudy}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm">No education information added yet.</p>
                        <p className="text-xs">Click the edit button to add your education.</p>
                      </div>
                    )}

                    {/* Multiple Education Display */}
                    {profileData.education && profileData.education.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Education History</h4>
                        {profileData.education.map((education: Education) => (
                          <div key={education.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-semibold text-gray-900 dark:text-white">{education.degree}</h5>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {education.isCurrent ? 'Current' : `${education.startDate} - ${education.endDate || 'Present'}`}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{education.institution}</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{education.fieldOfStudy}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>,
              'education'
            )}

            {/* Skills Section */}
            {renderSection(
              'Technical Skills',
              <Code className="w-5 h-5 text-blue-600" />,
              <div className="space-y-4">
                {renderEditableSkills(
                  'Programming Languages',
                  'programmingLanguages',
                  profileData.programmingLanguages,
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                  ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Dart']
                )}
                {renderEditableSkills(
                  'Frameworks & Libraries',
                  'frameworks',
                  profileData.frameworks,
                  'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                  ['React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI']
                )}
                {renderEditableSkills(
                  'Databases',
                  'databases',
                  profileData.databases,
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
                  ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Cassandra', 'DynamoDB', 'Firebase', 'Supabase']
                )}
                {renderEditableSkills(
                  'Tools & Platforms',
                  'tools',
                  profileData.tools,
                  'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
                  ['Git', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Figma', 'Postman', 'VS Code', 'IntelliJ', 'Eclipse']
                )}
              </div>,
              'skills'
            )}

            {/* Soft Skills Section */}
            {renderSection(
              'Soft Skills',
              <Users className="w-5 h-5 text-blue-600" />,
              renderEditableSkills(
                'Soft Skills',
                'softSkills',
                profileData.softSkills,
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
                ['Problem Solving', 'Communication', 'Teamwork', 'Leadership', 'Time Management', 'Critical Thinking', 'Adaptability', 'Creativity', 'Analytical Skills']
              ),
              'softSkills'
            )}

            {/* Career Goals Section */}
            {renderSection(
              'Career Goals',
              <Target className="w-5 h-5 text-blue-600" />,
              editingSection === 'careerGoals' ? (
                <div>
                  <textarea
                    value={editingData.careerGoals || profileData.careerGoals || ''}
                    onChange={(e) => setEditingData((prev: any) => ({ ...prev, careerGoals: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    placeholder="Describe your career goals..."
                  />
                </div>
              ) : (
                <div>
                  {profileData.careerGoals ? (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profileData.careerGoals}
                    </p>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">No career goals added yet.</p>
                      <p className="text-xs">Click the edit button to add your career goals.</p>
                    </div>
                  )}
                </div>
              ),
              'careerGoals'
            )}

            {/* Interests Section */}
            {renderSection(
              'Interests & Preferences',
              <Globe className="w-5 h-5 text-blue-600" />,
              <div className="space-y-4">
                {renderEditableSkills(
                  'Coding Interests',
                  'codingInterests',
                  profileData.codingInterests,
                  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300',
                  ['Web Development', 'Mobile Development', 'AI/ML', 'Data Science', 'DevOps', 'Cybersecurity', 'Game Development', 'Blockchain', 'IoT', 'Cloud Computing']
                )}
                {renderEditableSkills(
                  'Preferred Job Roles',
                  'preferredJobRoles',
                  profileData.preferredJobRoles,
                  'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300',
                  ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer', 'Mobile Developer', 'QA Engineer', 'Product Manager', 'UI/UX Designer', 'System Administrator', 'Cloud Engineer']
                )}
                {renderEditableSkills(
                  'Preferred Technologies',
                  'preferredTechnologies',
                  profileData.preferredTechnologies,
                  'bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300',
                  ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB', 'TypeScript', 'GraphQL', 'Kubernetes', 'Machine Learning', 'Blockchain', 'IoT']
                )}
              </div>,
              'interests'
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 