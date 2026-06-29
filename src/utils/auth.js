/**
 * Authentication utility functions
 */

// Validate token format
export const isValidToken = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
};

// Decode JWT token (without verification - just for reading payload)
export const decodeToken = (token) => {
  try {
    if (!isValidToken(token)) return null;
    
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now();
};

// Get user info from token
export const getUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.id,
    username: decoded.username,
    name: decoded.name,
    role: decoded.role,
  };
};

// Format user role for display
export const formatRole = (role) => {
  const roles = {
    admin: 'Administrator',
    doctor: 'Doctor',
    frontoffice: 'Front Office',
  };
  return roles[role] || role;
};

// Check if user can access a feature based on role
export const canAccess = (userRole, allowedRoles) => {
  if (!userRole || !allowedRoles) return false;
  return allowedRoles.includes(userRole);
};

// Get role badge color for UI
export const getRoleBadgeColor = (role) => {
  const colors = {
    admin: 'bg-purple-100 text-purple-800',
    doctor: 'bg-blue-100 text-blue-800',
    frontoffice: 'bg-green-100 text-green-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};
