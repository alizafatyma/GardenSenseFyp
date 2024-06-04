import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import BottomMenu from './BottomMenu';
import axios from 'axios';
export default function ImagePickerExample({ navigation }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const identifyPlant = () => {
    if (image) {
      setLoading(true);
      uploadImage(image); // Send the image to backend for identification
    } else {
      console.warn('No image selected');
    }
  };

  const uploadImage = async (uri) => {
    let formData = new FormData();
    formData.append('image', {
      uri: uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });

    try {
      let response = await fetch('http://192.168.100.9:3000/plants/identify', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let responseJson = await response.json();

      setLoading(false);
      navigation.navigate('PlantIdentificationResult', { result: responseJson });

    } catch (error) {
      setLoading(false);
      console.error('Upload failed:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#388E3C" />
        <Text style={styles.loadingText}>Be patient, we are looking for your plant...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/GardenSense-removebg-preview.png')} // Change the path to your actual logo
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <MaterialIcons name="photo-library" size={24} color="white" />
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>
      {image && (
        <Image
          source={{ uri: image }}
          style={styles.thumbnail}
        />
      )}
      <TouchableOpacity style={styles.identifyButton} onPress={identifyPlant}>
        <MaterialIcons name="search" size={24} color="white" />
        <Text style={styles.buttonText}>Identify Plant</Text>
      </TouchableOpacity>
      <BottomMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background color
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#3E2723', // Dark brown color
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  identifyButton: {
    flexDirection: 'row',
    backgroundColor: '#388E3C', // Dark green color
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 150, // Medium size
    height: 150, // Medium size
    marginBottom: 20,
  },
  thumbnail: {
    width: 150,
    height: 150,
    marginTop: 20,
    marginBottom: 20, // Added space below the thumbnail
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#388E3C', // Dark green color
  },
});
