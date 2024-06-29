import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';

export default function PlantIdentificationResult({ route }) {
  const { result } = route.params;
  console.log(result);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const plantData = {
    id: result.id || result.entity_id,
    plant_name: result.plant_name || result.name,
    common_names: result.common_names,
    taxonomy: result.taxonomy,
    description: result.description,
    image: result.image?.value || result.image,
    edible_parts: result.edible_parts,
    propagation_methods: result.propagation_methods,
    watering: result.watering,
  };

  const handleAddToList = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      const response = await axios.post(`${BASE_URL}/user/${userId}/save-plant`, plantData);
      console.log('Plant added to the list:', response.data);
      setSuccessMessage('Plant added to your list successfully!');
    } catch (error) {
      console.error('Failed to add plant to the list:', error);
      setErrorMessage('Failed to add plant to the list. Please try again.');
    }
  };

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No plant information available.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {plantData.image ? (
        <Image source={{ uri: plantData.image }} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>Image not available</Text>
      )}
      <Text style={styles.plantName}>{plantData.plant_name || 'Unknown Plant'}</Text>
      <Text style={styles.commonNames}>{plantData.common_names ? plantData.common_names.join(', ') : 'No common names available'}</Text>
      <Text style={styles.sectionTitle}>Plant Overview</Text>
      <Text style={styles.description}>{plantData.description?.value || 'No description available'}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddToList}>
        <MaterialIcons name="playlist-add" size={24} color="white" />
        <Text style={styles.buttonText}>Add to the list</Text>
      </TouchableOpacity>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 10,
    borderRadius: 8,
  },
  plantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commonNames: {
    fontStyle: 'italic',
    marginBottom: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  description: {
    textAlign: 'left',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#006400',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginVertical: 10,
  },
});
