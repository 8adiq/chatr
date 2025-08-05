// Helper function to format dates
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Generate random avatar based on username
export const getRandomAvatar = (username) => {
  const colors = [
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
    '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#a8edea', '#fed6e3',
    '#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef', '#fecfef', '#fad0c4'
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const initials = username.substring(0, 2).toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${randomColor.substring(1)}&color=fff&size=128&bold=true&font-size=0.4`;
}; 