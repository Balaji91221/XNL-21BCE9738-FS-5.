
// This is a simple localStorage-based database service
// In a real app, you would use a real database like Supabase, Firebase, etc.

// User-related operations
export interface DBUser {
  id: string;
  username: string;
  email: string;
  password: string; // In a real app, you would never store plaintext passwords
  displayName: string;
  avatarUrl?: string;
  coverUrl?: string;
  bio?: string;
  followers: number;
  following: number;
  likes: number;
  createdAt: string;
}

export interface Video {
  id: string;
  userId: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
}

export const db = {
  // User operations
  getUsers: (): DBUser[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },
  
  getUserById: (id: string): DBUser | null => {
    const users = db.getUsers();
    return users.find(user => user.id === id) || null;
  },
  
  getUserByEmail: (email: string): DBUser | null => {
    const users = db.getUsers();
    return users.find(user => user.email === email) || null;
  },
  
  getUserByUsername: (username: string): DBUser | null => {
    const users = db.getUsers();
    return users.find(user => user.username === username) || null;
  },
  
  createUser: (user: Omit<DBUser, 'id' | 'createdAt'>): DBUser => {
    const newUser: DBUser = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const users = db.getUsers();
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return newUser;
  },
  
  updateUser: (id: string, updates: Partial<DBUser>): DBUser | null => {
    const users = db.getUsers();
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;
    
    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    localStorage.setItem('users', JSON.stringify(users));
    
    return updatedUser;
  },
  
  // Video operations
  getVideos: (): Video[] => {
    const videos = localStorage.getItem('videos');
    return videos ? JSON.parse(videos) : [];
  },
  
  getVideosByUserId: (userId: string): Video[] => {
    const videos = db.getVideos();
    return videos.filter(video => video.userId === userId);
  },
  
  createVideo: (video: Omit<Video, 'id' | 'createdAt' | 'views' | 'likes'>): Video => {
    const newVideo: Video = {
      ...video,
      id: `video_${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };
    
    const videos = db.getVideos();
    videos.push(newVideo);
    localStorage.setItem('videos', JSON.stringify(videos));
    
    return newVideo;
  },
  
  updateVideo: (id: string, updates: Partial<Video>): Video | null => {
    const videos = db.getVideos();
    const index = videos.findIndex(video => video.id === id);
    
    if (index === -1) return null;
    
    const updatedVideo = { ...videos[index], ...updates };
    videos[index] = updatedVideo;
    localStorage.setItem('videos', JSON.stringify(videos));
    
    return updatedVideo;
  },
  
  deleteVideo: (id: string): boolean => {
    const videos = db.getVideos();
    const filtered = videos.filter(video => video.id !== id);
    
    if (filtered.length === videos.length) return false;
    
    localStorage.setItem('videos', JSON.stringify(filtered));
    return true;
  },
  
  // Initialize the database with some sample data
  initialize: () => {
    // Only initialize if there's no data yet
    if (db.getUsers().length === 0) {
      const sampleUsers: DBUser[] = [
        {
          id: 'user_1',
          username: 'alexsmith',
          email: 'alex@example.com',
          password: 'password123', // Would be hashed in a real app
          displayName: 'Alex Smith',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
          coverUrl: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
          bio: 'Digital creator • Filmmaker • Exploring the world one video at a time ✨',
          followers: 12340,
          following: 450,
          likes: 485600,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'user_2',
          username: 'janedoe',
          email: 'jane@example.com',
          password: 'password123',
          displayName: 'Jane Doe',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80',
          coverUrl: 'https://images.unsplash.com/photo-1604537529428-15bcbeecfe4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80',
          bio: 'Adventure seeker • Travel vlogger • Living life to the fullest 🌍',
          followers: 8250,
          following: 320,
          likes: 195000,
          createdAt: new Date().toISOString(),
        },
      ];
      
      localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
  },
};

// Initialize the database when the service is loaded
db.initialize();
