import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function PlantIdentificationResult({ route }) {
  const { result } = route.params;

  const handleAddToList = () => {
    // Function to handle adding the plant to the user's list
    console.log('Plant added to the list');
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
      {result.image ? (
        <Image source={{ uri: result.image }} style={styles.image} />
      ) : (
        <Text style={styles.errorText}>Image not available</Text>
      )}
      <Text style={styles.plantName}>{result.plant_name || 'Unknown Plant'}</Text>
      <Text style={styles.commonNames}>{result.common_names ? result.common_names.join(', ') : 'No common names available'}</Text>
      <Text style={styles.sectionTitle}>Plant Overview</Text>
      <Text style={styles.description}>{result.description?.value || 'No description available'}</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddToList}>
        <MaterialIcons name="playlist-add" size={24} color="white" />
        <Text style={styles.buttonText}>Add to the list</Text>
      </TouchableOpacity>
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
    fontWeight: 'normal',
    fontWeight: 'bold'
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
});
