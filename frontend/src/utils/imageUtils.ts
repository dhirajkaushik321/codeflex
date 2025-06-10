export async function getSignedImageUrl(imageUrl: string): Promise<string> {
  try {
    // Check if the URL is already a signed URL (contains query parameters)
    if (imageUrl.includes('?') && imageUrl.includes('X-Amz-')) {
      return imageUrl;
    }

    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch('/api/developer/signed-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fileUrl: imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate signed URL');
    }

    const data = await response.json();
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed image URL:', error);
    // Return the original URL as fallback
    return imageUrl;
  }
} 