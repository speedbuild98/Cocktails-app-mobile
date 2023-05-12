import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Recuperar los favoritos de AsyncStorage al inicializar
    const fetchFavorites = async () => {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    };

    fetchFavorites();
  }, []);

  const handleLike = async (item) => {
    const isFavorite = favorites.find((fav) => fav.idDrink === item.idDrink);
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((fav) => fav.idDrink !== item.idDrink);
    } else {
      newFavorites = [...favorites, item];
    }
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, handleLike }}>
      {children}
    </FavoritesContext.Provider>
  );
};
