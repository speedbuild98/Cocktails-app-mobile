import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Linking,
} from "react-native";
import axios from "axios";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { FavoritesProvider, FavoritesContext } from './FavoritesContext';



const Stack = createStackNavigator();

const CocktailDetailsScreen = ({ route, navigation }) => {
  const { cocktail } = route.params;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.detailsContainer}>
      <Image
        source={{ uri: cocktail.strDrinkThumb }}
        style={styles.detailsImage}
      />
      <Text style={styles.detailsTitle}>{cocktail.strDrink}</Text>
      <Text style={styles.detailsCategory}>
        Category: {cocktail.strCategory}
      </Text>
      <Text style={styles.detailsInstructions}>
        Instructions: {cocktail.strInstructions}
      </Text>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={handleGoBack}
      >
        <Icon name="arrow-left" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [cocktails, setCocktails] = useState([]);
  const [error, setError] = useState(null);
  const { favorites, handleLike } = useContext(FavoritesContext);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const response = await axios.get(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`
        );
        const data = response.data;
        const drinks = data.drinks;
        if (drinks === null) {
          setError('Cocktail not found');
        } else {
          setError(null);
          setCocktails(drinks);
        }
      } catch (error) {
        console.error("Error fetching cocktails:", error);
      }
    };

    fetchCocktails();
  }, [search]);

  const handleSearch = (text) => {
    setSearch(text);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const renderCocktail = ({ item }) => {
    const handleCocktailPress = () => {
      navigation.navigate("CocktailDetails", { cocktail: item });
    };

    const isFavorite = favorites.find((fav) => fav.idDrink === item.idDrink);


    return (
      <TouchableOpacity
        style={styles.cocktailContainer}
        onPress={handleCocktailPress}
      >
        <Image
          source={{ uri: item.strDrinkThumb }}
          style={styles.cocktailImage}
        />
        <View style={styles.cocktailDetails}>
          <Text style={styles.cocktailTitle}>{item.strDrink}</Text>
          <Text style={styles.cocktailCategory}>
            Category: {item.strCategory}
          </Text>
          <Text style={styles.cocktailIngredients}>
            Ingredients: {item.strIngredient1}, {item.strIngredient2},{" "}
            {item.strIngredient3}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleLike(item)}>
          <Icon
            name={isFavorite ? "heart" : "heart-o"}
            size={25}
            color="#900"
            marginRight={20}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for cocktails"
          value={search}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearSearch}
        >
          <Icon name="times-circle" size={20} color={"#007BFF"}/>
        </TouchableOpacity>
      </View>

      <View style={styles.iconContainer}>
  <TouchableOpacity
    onPress={() => navigation.navigate("About")}
    style={styles.iconButton}
  >
    <Icon name="info-circle" size={25} color="#fff" />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() =>
      navigation.navigate("Favorites", { favorites, handleLike })
    }
    style={styles.iconButton}
  >
    <Icon name="heart" size={25} color="#fff" />
  </TouchableOpacity>
</View>

      {error ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={cocktails}
          renderItem={renderCocktail}
          keyExtractor={(item) => item.idDrink}
        />
      )}
    </View>
  );
};

const FavoritesScreen = ({ route, navigation }) => {
  const { favorites, handleLike } = useContext(FavoritesContext);

  const renderFavoriteCocktail = ({ item }) => {
    const isFavorite = favorites.find((fav) => fav.idDrink === item.idDrink);

    return (
      <TouchableOpacity
        style={styles.cocktailContainer}
        onPress={() =>
          navigation.navigate("CocktailDetails", { cocktail: item })
        }
      >
        <Image
          source={{ uri: item.strDrinkThumb }}
          style={styles.cocktailImage}
        />
        <View style={styles.cocktailDetails}>
          <Text style={styles.cocktailTitle}>{item.strDrink}</Text>
          <Text style={styles.cocktailCategory}>
            Category: {item.strCategory}
          </Text>
          <Text style={styles.cocktailIngredients}>
            Ingredients: {item.strIngredient1}, {item.strIngredient2},{" "}
            {item.strIngredient3}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleLike(item)}>
          <Icon
            name={isFavorite ? "heart" : "heart-o"}
            size={25}
            color="#900"
            marginRight={20}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteCocktail}
          keyExtractor={(item) => item.idDrink}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No favorites added yet</Text>
        </View>
      )}
    </View>
  );
};

const AboutScreen = ({ navigation }) => {
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon name="arrow-left" size={25} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/speedbuild98')}>
          <Image
            source={require('./assets/github.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/lautagallardogg/')}>
          <Image
            source={require('./assets/linkedin.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL('https://devgallardo.netlify.app/')}>
          <Image
            source={require('./assets/internet.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <Image
        source={require('./assets/cocktail.webp')}
        style={styles.imageCocktail}
      />
    </View>
  );
};


export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CocktailDetails" component={CocktailDetailsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  clearButton: {
    padding: 5,
    marginLeft: 5,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  cocktailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor:"#e5ecf8",
    borderRadius: 8,
  },
  cocktailImage: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  cocktailDetails: {
    flex: 1,
  },
  cocktailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cocktailCategory: {
    fontSize: 14,
    marginBottom: 5,
  },
  cocktailIngredients: {
    fontSize: 12,
  },
  noResultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center", 
  },
  detailsImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsCategory: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailsInstructions: {
    fontSize: 16,
    marginBottom: 10,
  },
  goBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "blue",
    alignItems: "center",
    borderRadius: 8,
  },
  goBackButtonText: {
    color: "white",
    fontSize: 18,
  },
  favoritesButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
  favoritesButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  aboutButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F55D3E",
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
  aboutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
  },
  icon: {
    width: 50,
    height: 50,
    margin: 10,
    tintColor: 'black',
  },
  imageCocktail: {
    width: 300, 
    height: 300, 
    alignSelf: 'center', 
    marginTop: 50, 
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007BFF",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
});
