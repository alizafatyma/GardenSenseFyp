import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Import axios for making HTTP requests
import BottomMenu from './BottomMenu'; // Import your BottomMenu component

const baseURL = 'http://192.168.100.17:3000'; // Assuming your base URL for API requests

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        // Fetch user ID from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          // Fetch user name using the user ID
          const response = await axios.get(`${baseURL}/users/${userId}`);
          if (response.data.name) {
            setUserName(response.data.name);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hello, {userName}</Text>
      
      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Image source={require('./assets/search_icon.png')} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for plants"
          placeholderTextColor="#999"
        />
      </View>
      
      {/* Explore Options */}
      <Text style={styles.heading}>Explore your options</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Image source={require('./assets/quiz.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Take quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Image source={require('./assets/plant.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>See your plants</Text>
        </TouchableOpacity>
      </View>

      {/* Search Categories */}
      <Text style={styles.heading}>Search Categories</Text>
      
      <View style={styles.categoriesContainer}>
        {/* Ferns Category */}
        <TouchableOpacity style={styles.categoryCard}>
          <Text style={styles.categoryText}>Ferns</Text>
          <Image source={require('./assets/ferns.jpg')} style={styles.categoryImage} />
        </TouchableOpacity>

        {/* Home Plants Category */}
        <TouchableOpacity style={styles.categoryCard}>
          <Text style={styles.categoryText}>Home Plants</Text>
          <Image source={require('./assets/homeplant.jpg')} style={styles.categoryImage} />
        </TouchableOpacity>
      </View>

      {/* Bottom Menu */}
      <BottomMenu navigation={navigation} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: '100%',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%', // Adjust the width as needed
  },
  optionIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Adjust the width as needed to fit two cards side by side
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
});

export default HomeScreen;

