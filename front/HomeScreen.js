import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Text, Card, Avatar, List } from 'react-native-paper';
import BottomMenu from './BottomMenu';
import { BASE_URL } from '@env';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const plantFacts = [
    "A sunflower looks like one large flower, but each head is made up of hundreds of tiny flowers called florets.",
    "Bamboo is the fastest-growing woody plant in the world; it can grow up to 35 inches in a single day.",
    "The world’s tallest tree is a coast redwood in California, measuring more than 379 feet tall.",
    "Banana plants are technically herbs, not trees, and their fruit is classified as a berry.",
    "Venus flytraps are carnivorous plants that can consume insects and even small animals.",
    "The Amazon Rainforest produces more than 20% of the world’s oxygen supply.",
    "Cacti can store an enormous amount of water in their thick stems to survive long droughts.",
    "There are about 200,000 edible plant species on Earth, yet we only eat about 200 of them.",
    "Plants like ferns and mosses do not produce seeds; they reproduce via spores.",
    "The African baobab tree can live for thousands of years and is known as the 'Tree of Life'."
  ];

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`${BASE_URL}/user/${userId}`);
          console.log(response.data);
          if (response.data.fullName) {
            setUserName(response.data.fullName);
          }
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };

    fetchUserName();

    const interval = setInterval(() => {
      setCurrentFactIndex((prevIndex) => (prevIndex + 1) % plantFacts.length);
    }, 5000); // Change fact every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/plants/search?q=${searchQuery}`);
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

  const handleSearchResultClick = async (access_token) => {
    try {
      const response = await axios.get(`${BASE_URL}/plants/details/${access_token}`);
      navigation.navigate('PlantIdentificationResult', { result: response.data });
    } catch (error) {
      console.error('Failed to fetch plant details:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="account-circle" size={30} color="black" />
        </TouchableOpacity>
      </View>
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
            <TouchableOpacity key={index.toString()} onPress={() => handleSearchResultClick(item.access_token)}>
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
      
      <Card style={[styles.option, { backgroundColor: '#4CAF50' }]} onPress={() => {}}>
        <Card.Content style={styles.optionContent}>
          <Avatar.Icon size={30} icon="help" style={[styles.optionIcon, { backgroundColor: '#3E2723' }]} />
          <Text style={[styles.optionText, { color: 'white' }]}>Take Quiz</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.option, { backgroundColor: '#4CAF50' }]} onPress={() => navigation.navigate('SavedList')}>
        <Card.Content style={styles.optionContent}>
          <Avatar.Icon size={30} icon="format-list-bulleted" style={[styles.optionIcon, { backgroundColor: '#3E2723' }]} />
          <Text style={[styles.optionText, { color: 'white' }]}>Saved List</Text>
        </Card.Content>
      </Card>

      <View style={styles.plantFactsContainer}>
        <Text style={styles.plantFactsTitle}>Plant Facts</Text>
        <Card style={styles.plantFactCard}>
          <Card.Content>
            <Text style={styles.plantFactText}>{plantFacts[currentFactIndex]}</Text>
          </Card.Content>
        </Card>
      </View>

      <BottomMenu navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10,
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
    marginBottom: 10,
    width: '100%',
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
  },
  option: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    backgroundColor: '#3E2723',
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  plantFactsContainer: {
    marginTop: 20,
  },
  plantFactsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  plantFactCard: {
    marginBottom: 10,
  },
  plantFactText: {
    fontSize: 18,
    lineHeight: 24,
  },
});

export default HomeScreen;
