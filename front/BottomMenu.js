import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BottomMenu = () => {
  return (
    <View style={styles.menuContainer}>
      <TouchableOpacity style={styles.menuOption}>
        <Text style={styles.menuText}>Communtity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption}>
        <Text style={styles.menuText}>Identification</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption}>
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuOption}>
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
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default BottomMenu;

