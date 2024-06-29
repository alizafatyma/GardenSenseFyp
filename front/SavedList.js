import React, { useState, useEffect } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import axios from 'axios';
import { BASE_URL } from '@env';

const SavedList = ({ navigation }) => {
  const [savedPlants, setSavedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPlants = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); // Use AsyncStorage to get the userId
        const response = await axios.get(`${BASE_URL}/user/${userId}/saved-plants`);
        setSavedPlants(response.data || []);
      } catch (error) {
        console.error('Failed to fetch saved plants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPlants();
  }, []);

  const navigateToReminder = (plant) => {
    navigation.navigate('ReminderScreen', { plant });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Please wait while we get your plants...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {savedPlants.map((plant) => (
            <TouchableOpacity key={plant.id} onPress={() => navigateToReminder(plant)}>
              <View style={styles.card}>
                <Image source={{ uri: plant.image }} style={styles.image} />
                <Text style={styles.name}>{plant.plant_name}</Text>
                {plant.common_names && plant.common_names.map((name, index) => (
                  <Text key={index} style={styles.commonName}>{name}</Text>
                ))}
                <TouchableOpacity onPress={() => navigateToReminder(plant)} style={styles.reminderButton}>
                  <Text style={styles.buttonText}>Add Reminder</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          {savedPlants.length === 0 && <Text style={styles.emptyList}>No saved plants yet</Text>}
        </ScrollView>
      )}
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
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 7,
    marginBottom: 8,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commonName: {
    fontSize: 16,
    color: 'gray',
  },
  reminderButton: {
    backgroundColor: '#3E2723', // Dark brown color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyList: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#388E3C', // Parrot grass green color
  },
});

export default SavedList;
