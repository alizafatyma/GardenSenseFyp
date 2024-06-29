import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const MyDropdown = ({ options, onSelect }) => {
  if (!options || options.length === 0) {
    return <Text>Loading...</Text>; // Display loading message if options are not yet available
  }

  return (
    <FlatList
      data={options}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)}>
          <View style={{ padding: 10 }}>
            <Text>{item.label}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item.id.toString()} // Assuming each option has a unique id
    />
  );
};

export default MyDropdown;
