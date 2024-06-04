import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Text, Card, Avatar, List } from 'react-native-paper';
import BottomMenu from './BottomMenu';

const baseURL = 'http://192.168.100.9:3000';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`${baseURL}/user/${userId}`);
          if (response.data.fullName) {
            setUserName(response.data.fullName);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${baseURL}/plants/search?q=${searchQuery}`);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  };

  const onChangeSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      handleSearch();
    }
  };

  const onSubmitSearch = () => {
    if (searchQuery.length > 2) {
      handleSearch();
    }
  };

  const handleSearchResultClick = async (plantName) => {
    try {
      console.log(plantName);
      const response = await fetch(`http://192.168.100.9:3000/plants/identify?name=${encodeURIComponent(plantName)}`);
      const result = await response.json();
      navigation.navigate('PlantIdentificationResult', { result });
    } catch (error) {
      console.error('Failed to identify plant:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hello, {userName}</Text>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
        <TextInput
          mode="outlined"
          placeholder="Search for plants"
          value={searchQuery}
          onChangeText={onChangeSearch}
          onSubmitEditing={onSubmitSearch}
          style={styles.searchInput}
        />
      </View>

      {searchResults.length > 0 && (
        <List.Section title="Search Results">
          {searchResults.map((item, index) => (
            <TouchableOpacity key={index.toString()} onPress={() => handleSearchResultClick(item.entity_name)}>
              <List.Item
                title={item.matched_in}
                description={item.entity_name}
                left={() => <List.Icon icon="leaf" />}
                style={styles.resultItem}
              />
            </TouchableOpacity>
          ))}
        </List.Section>
      )}

      <Text style={styles.subHeading}>Explore your options</Text>
      <View style={styles.optionsContainer}>
        <Card style={styles.option} onPress={() => {}}>
          <Card.Content style={styles.optionContent}>
            <Avatar.Icon size={30} icon="help" />
            <Text style={styles.optionText}>Take quiz</Text>
          </Card.Content>
        </Card>
        <Card style={styles.option} onPress={() => {}}>
          <Card.Content style={styles.optionContent}>
            <Avatar.Icon size={30} icon="flower" />
            <Text style={styles.optionText}>See your plants</Text>
          </Card.Content>
        </Card>
      </View>

      <Text style={styles.subHeading}>Search Categories</Text>
      <View style={styles.categoriesContainer}>
        <Card style={styles.categoryCard} onPress={() => {}}>
          <Card.Cover source={require('./assets/ferns.jpg')} style={styles.categoryImage} />
          <Card.Content>
            <Text style={styles.categoryText}>Ferns</Text>
          </Card.Content>
        </Card>
        <Card style={styles.categoryCard} onPress={() => {}}>
          <Card.Cover source={require('./assets/homeplant.jpg')} style={styles.categoryImage} />
          <Card.Content>
            <Text style={styles.categoryText}>Home Plants</Text>
          </Card.Content>
        </Card>
      </View>

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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  option: {
    flex: 1,
    margin: 5,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryCard: {
    flex: 1,
    margin: 5,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  categoryImage: {
    height: 150,
    borderRadius: 10,
  },
});

export default HomeScreen;