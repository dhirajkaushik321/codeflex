'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Camera, Upload, X, Check, AlertCircle, Edit3 } from 'lucide-react';
import { getSignedImageUrl } from '../utils/imageUtils';

interface ProfilePictureUploadProps {
  currentImage?: string;
  onImageUpload: (imageUrl: string) => void;
  onImageRemove: () => void;
  className?: string;
}

export default function ProfilePictureUpload({
  currentImage,
  onImageUpload,
  onImageRemove,
  className = '',
}: ProfilePictureUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [signedImageUrl, setSignedImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate signed URL for current image
  useEffect(() => {
    if (currentImage && !currentImage.includes('?') && !currentImage.includes('X-Amz-')) {
      getSignedImageUrl(currentImage)
        .then(signedUrl => {
          setSignedImageUrl(signedUrl);
        })
        .catch(error => {
          console.error('Failed to get signed URL:', error);
          setSignedImageUrl(currentImage); // Fallback to original URL
        });
    } else if (currentImage) {
      setSignedImageUrl(currentImage);
    } else {
      setSignedImageUrl(null);
    }
  }, [currentImage]);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    
    if (!validateFile(file)) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Please log in to upload a profile picture');
      }

      // Generate presigned URL
      const response = await fetch('/api/developer/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate upload URL');
      }

      const { uploadUrl, fileUrl } = await response.json();

      // Upload to S3
      console.log('Uploading to S3 with URL:', uploadUrl);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      try {
        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          body: file,
          headers: {
            'Content-Type': file.type,
          },
        });

        console.log('S3 upload response status:', uploadResponse.status);
        console.log('S3 upload response headers:', Object.fromEntries(uploadResponse.headers.entries()));
        
        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('S3 upload error response:', errorText);
          throw new Error(`Failed to upload image to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }
        
        console.log('S3 upload successful!');
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown upload error';
        throw new Error(`S3 upload failed: ${errorMessage}`);
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Update profile picture in database
      const updateResponse = await fetch('/api/developer/profile-picture', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          profilePicture: fileUrl,
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Failed to update profile picture');
      }

      onImageUpload(fileUrl);
      setPreviewImage(null);
      
      // Reset after success
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
      setPreviewImage(null);
    }
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to remove profile picture');
        return;
      }

      const response = await fetch('/api/developer/profile-picture', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove profile picture');
      }

      onImageRemove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove profile picture');
    }
  };

  const displayImage = previewImage || signedImageUrl;

  return (
    <div className={`relative ${className}`}>
      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
          >
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto hover:text-red-900"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Picture Container */}
      <div className="relative">
        {/* Current/Preview Image */}
        {displayImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-32 h-32 mx-auto mb-4 group"
          >
            <Image
              src={displayImage}
              alt="Profile picture"
              fill
              className="rounded-full object-cover border-4 border-white shadow-lg"
            />
            
            {/* Edit icon overlay */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Edit3 size={16} />
            </motion.button>
            
            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <X size={16} />
            </motion.button>
          </motion.div>
        )}

        {/* Upload Area - Only show if no image is displayed */}
        {!displayImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
              isDragging
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Upload Progress */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 rounded-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - uploadProgress / 100)}`}
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Uploading...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Upload Content */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-white" />
              </motion.div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Upload Profile Picture
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Drag and drop your image here, or click to browse
                </p>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <p>Supported formats: JPEG, PNG, WebP</p>
                  <p>Maximum size: 5MB</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Choose Image
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
} 