import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BottomMenu = () => {
  
  const navigation = useNavigation();
  const handleIdentificationPress = () => {
    navigation.navigate('PlantIdentification');
  };

  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuOption}>
        <Image source={require('./assets/community.png')} style={styles.icon} />
        <Text style={styles.menuText}>Communtity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption} onPress={handleIdentificationPress}>
        <Image source={require('./assets/identification.png')} style={styles.icon} />
        <Text style={styles.menuText}>Identification</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption}>
        <Image source={require('./assets/reminder.png')} style={styles.icon} />
        <Text style={styles.menuText}>Reminders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption}>
        <Image source={require('./assets/game.png')} style={styles.icon} />
        <Text style={styles.menuText}>Garden</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  menuOption: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
});

export default BottomMenu;
