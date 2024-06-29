// PlantCard.js

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const PlantCard = ({ plant, onPress, navigateToReminder }) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress}>
        <Image source={{ uri: plant.image }} style={styles.image} />
        <Text style={styles.name}>{plant.plant_name}</Text>
        {plant.common_names && plant.common_names.map((name, index) => (
          <Text key={index} style={styles.commonName}>{name}</Text>
        ))}
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToReminder} style={styles.reminderButton}>
        <Text style={styles.buttonText}>Add Reminder</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#8B4513', // Dark brown color
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
});

export default PlantCard;
