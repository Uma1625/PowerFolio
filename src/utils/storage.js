// Storage utility functions for managing data in memory
// Note: Using in-memory storage instead of localStorage for compatibility

let storage = {
  users: [],
  projects: [],
  currentUser: null
};

// Initialize with sample data
const initializeStorage = () => {
  if (storage.users.length === 0) {
    // Add default admin user
    storage.users.push({
      id: '1',
      name: 'Admin User',
      email: 'admin@powerfolio.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString()
    });

    // Add sample projects
    storage.projects = [
      {
        id: '1',
        title: 'AI-Powered Chat Application',
        description: 'A real-time chat application with AI-powered message suggestions and sentiment analysis.',
        category: 'Web Development',
        technologies: ['React', 'Node.js', 'Socket.io', 'OpenAI'],
        githubUrl: 'https://github.com/example/ai-chat',
        liveUrl: 'https://ai-chat-demo.com',
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800',
        userId: '1',
        userName: 'Admin User',
        status: 'approved',
        likes: 45,
        views: 230,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: '2',
        title: 'E-Commerce Dashboard',
        description: 'Modern dashboard for managing e-commerce operations with real-time analytics and inventory management.',
        category: 'Full Stack',
        technologies: ['React', 'MongoDB', 'Express', 'Chart.js'],
        githubUrl: 'https://github.com/example/ecommerce-dashboard',
        liveUrl: 'https://ecommerce-dashboard.com',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        userId: '1',
        userName: 'Admin User',
        status: 'approved',
        likes: 67,
        views: 412,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: '3',
        title: 'Mobile Fitness Tracker',
        description: 'Cross-platform mobile app for tracking workouts, nutrition, and health metrics with social features.',
        category: 'Mobile Development',
        technologies: ['React Native', 'Firebase', 'Redux', 'TensorFlow'],
        githubUrl: 'https://github.com/example/fitness-tracker',
        liveUrl: '',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
        userId: '1',
        userName: 'Admin User',
        status: 'approved',
        likes: 89,
        views: 567,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
      }
    ];
  }
};

initializeStorage();

// User Management
export const getUsers = () => {
  return [...storage.users];
};

export const getUserById = (id) => {
  return storage.users.find(user => user.id === id);
};

export const getUserByEmail = (email) => {
  return storage.users.find(user => user.email === email);
};

export const createUser = (userData) => {
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  storage.users.push(newUser);
  return newUser;
};

export const updateUser = (id, updates) => {
  const index = storage.users.findIndex(user => user.id === id);
  if (index !== -1) {
    storage.users[index] = { ...storage.users[index], ...updates };
    return storage.users[index];
  }
  return null;
};

export const deleteUser = (id) => {
  const index = storage.users.findIndex(user => user.id === id);
  if (index !== -1) {
    storage.users.splice(index, 1);
    return true;
  }
  return false;
};

// Project Management
export const getProjects = (filter = {}) => {
  let projects = [...storage.projects];
  
  if (filter.status) {
    projects = projects.filter(p => p.status === filter.status);
  }
  
  if (filter.userId) {
    projects = projects.filter(p => p.userId === filter.userId);
  }
  
  if (filter.category) {
    projects = projects.filter(p => p.category === filter.category);
  }
  
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    projects = projects.filter(p => 
      p.title.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.technologies.some(t => t.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort by date (newest first)
  projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  return projects;
};

export const getProjectById = (id) => {
  return storage.projects.find(project => project.id === id);
};

export const createProject = (projectData) => {
  const newProject = {
    id: Date.now().toString(),
    ...projectData,
    status: 'pending',
    likes: 0,
    views: 0,
    createdAt: new Date().toISOString()
  };
  storage.projects.push(newProject);
  return newProject;
};

export const updateProject = (id, updates) => {
  const index = storage.projects.findIndex(project => project.id === id);
  if (index !== -1) {
    storage.projects[index] = { ...storage.projects[index], ...updates };
    return storage.projects[index];
  }
  return null;
};

export const deleteProject = (id) => {
  const index = storage.projects.findIndex(project => project.id === id);
  if (index !== -1) {
    storage.projects.splice(index, 1);
    return true;
  }
  return false;
};

export const incrementProjectViews = (id) => {
  const project = getProjectById(id);
  if (project) {
    updateProject(id, { views: project.views + 1 });
  }
};

export const toggleProjectLike = (projectId, userId) => {
  const project = getProjectById(projectId);
  if (project) {
    // Simple implementation - just increment/decrement
    // In a real app, you'd track who liked what
    const newLikes = project.likes + 1;
    updateProject(projectId, { likes: newLikes });
    return newLikes;
  }
  return 0;
};

// Current User Management
export const getCurrentUser = () => {
  return storage.currentUser;
};

export const setCurrentUser = (user) => {
  storage.currentUser = user;
};

export const clearCurrentUser = () => {
  storage.currentUser = null;
};

// Authentication
export const login = (email, password) => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    setCurrentUser(user);
    return { success: true, user };
  }
  return { success: false, message: 'Invalid email or password' };
};

export const logout = () => {
  clearCurrentUser();
};

export const signup = (userData) => {
  const existingUser = getUserByEmail(userData.email);
  if (existingUser) {
    return { success: false, message: 'Email already registered' };
  }
  
  const newUser = createUser(userData);
  setCurrentUser(newUser);
  return { success: true, user: newUser };
};

// Analytics
export const getAnalytics = () => {
  const projects = getProjects();
  const users = getUsers();
  
  return {
    totalProjects: projects.length,
    approvedProjects: projects.filter(p => p.status === 'approved').length,
    pendingProjects: projects.filter(p => p.status === 'pending').length,
    rejectedProjects: projects.filter(p => p.status === 'rejected').length,
    totalUsers: users.length,
    totalViews: projects.reduce((sum, p) => sum + p.views, 0),
    totalLikes: projects.reduce((sum, p) => sum + p.likes, 0)
  };
};

export default storage;