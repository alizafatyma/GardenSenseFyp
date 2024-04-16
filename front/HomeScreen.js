import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import BottomMenu from './BottomMenu';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Explore your options</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.option}>
          <Image source={require('./assets/garden.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Visit the virtual garden</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Image source={require('./assets/quiz.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Take quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Image source={require('./assets/community.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>See your plants</Text>
        </TouchableOpacity>
      </View>

      <BottomMenu /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
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
});

export default HomeScreen;
