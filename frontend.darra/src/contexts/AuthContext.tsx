import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  switchToAdmin: () => void;
  switchToUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Charger l'utilisateur depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem('darra_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        localStorage.removeItem('darra_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulation d'appel API - remplacez par votre vraie logique
      console.log('Tentative de connexion:', { email, password });
      
      // Pour la démo, créons des utilisateurs de test
      let userData: User;
      
      if (email === 'admin@darra.com' && password === 'admin123') {
        userData = {
          id: '1',
          name: 'Administrateur DARRA',
          email: email,
          role: 'admin'
        };
      } else if (email === 'user@darra.com' && password === 'user123') {
        userData = {
          id: '2',
          name: 'Utilisateur Test',
          email: email,
          role: 'user'
        };
      } else {
        // Pour tout autre email/mot de passe, créons un utilisateur normal
        userData = {
          id: Date.now().toString(),
          name: email.split('@')[0], // Utilise la partie avant @ comme nom
          email: email,
          role: 'user'
        };
      }

      // Sauvegarder dans localStorage
      localStorage.setItem('darra_user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      
      console.log('Connexion réussie:', userData);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw new Error('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      console.log('Tentative d\'inscription:', { email, password, name });
      
      // Simulation d'appel API
      const userData: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        role: 'user'
      };

      // Sauvegarder dans localStorage
      localStorage.setItem('darra_user', JSON.stringify(userData));
      
      setUser(userData);
      setIsLoggedIn(true);
      
      console.log('Inscription réussie:', userData);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw new Error('Erreur lors de l\'inscription. Veuillez réessayer.');
    }
  };

  const logout = () => {
    localStorage.removeItem('darra_user');
    setUser(null);
    setIsLoggedIn(false);
    console.log('Déconnexion réussie');
  };

  const switchToAdmin = () => {
    if (user) {
      const updatedUser = { ...user, role: 'admin' as const };
      localStorage.setItem('darra_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('Basculé en mode admin');
    }
  };

  const switchToUser = () => {
    if (user) {
      const updatedUser = { ...user, role: 'user' as const };
      localStorage.setItem('darra_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('Basculé en mode utilisateur');
    }
  };

  const value = {
    user,
    isLoggedIn,
    login,
    register,
    logout,
    switchToAdmin,
    switchToUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}