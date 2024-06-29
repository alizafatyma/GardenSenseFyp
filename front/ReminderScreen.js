import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { DefaultTheme, Provider as PaperProvider, Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const ReminderScreen = ({ route }) => {
  const { plant } = route.params; // Ensure plant object is correctly passed via route params
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState('none');
  const [showFrequencyOptions, setShowFrequencyOptions] = useState(false);

  const categories = [
    { id: 1, label: 'Watering' },
    { id: 2, label: 'Fertilizing' },
    { id: 3, label: 'Pruning' },
    { id: 4, label: 'Repotting' },
    { id: 5, label: 'Pest Control' },
    { id: 6, label: 'Sunlight' },
  ];

  const frequencies = ['none', 'daily', 'weekly', 'monthly'];

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Close date picker on iOS
    setDate(currentDate);
    setSelectedDateTime(currentDate); // Update selectedDateTime state
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryOptions(!showCategoryOptions);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryOptions(false);
  };

  const toggleFrequencyDropdown = () => {
    setShowFrequencyOptions(!showFrequencyOptions);
  };

  const handleSelectFrequency = (frequency) => {
    setSelectedFrequency(frequency);
    setShowFrequencyOptions(false);
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#4CAF50', // Dark green
      background: '#F5F5F5', // Off-white background
    },
  };

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="alarm" size={36} color="#4CAF50" />
          <Text style={styles.title}>Set Reminder</Text>
        </View>
        <View style={styles.plantInfoContainer}>
          <Image source={{ uri: plant.image }} style={styles.plantImage} />
          <Text style={styles.plantName}>{plant.plant_name}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Button
            mode="contained"
            onPress={() => showMode('date')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Select Date
          </Button>
          <Button
            mode="contained"
            onPress={() => showMode('time')}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Select Time
          </Button>
        </View>
        {selectedDateTime && (
          <Text style={styles.dateTimeText}>
            {selectedDateTime.toLocaleDateString()} {selectedDateTime.toLocaleTimeString()}
          </Text>
        )}
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
        <View style={styles.dropdownContainer}>
          <Button
            mode="contained"
            onPress={toggleCategoryDropdown}
            style={styles.dropdownHeader}
            labelStyle={styles.dropdownHeaderText}
          >
            {selectedCategory ? selectedCategory.label : 'Select Category'}
          </Button>
          {showCategoryOptions && (
            <View style={styles.optionsContainer}>
              {categories.map((option) => (
                <Button
                  key={option.id}
                  mode="text"
                  onPress={() => handleSelectCategory(option)}
                  style={styles.optionItem}
                  labelStyle={styles.optionText}
                >
                  {option.label}
                </Button>
              ))}
            </View>
          )}
        </View>
        <View style={styles.dropdownContainer}>
          <Button
            mode="contained"
            onPress={toggleFrequencyDropdown}
            style={styles.dropdownHeader}
            labelStyle={styles.dropdownHeaderText}
          >
            {selectedFrequency === 'none' ? 'Select Frequency' : selectedFrequency}
          </Button>
          {showFrequencyOptions && (
            <View style={styles.optionsContainer}>
              {frequencies.map((freq) => (
                <Button
                  key={freq}
                  mode="text"
                  onPress={() => handleSelectFrequency(freq)}
                  style={styles.optionItem}
                  labelStyle={styles.optionText}
                >
                  {freq}
                </Button>
              ))}
            </View>
          )}
        </View>
        <Button
          mode="contained"
          onPress={() => {} /* Add your functionality here */}
          style={[styles.addButton, { backgroundColor: '#6D4C41' }]} // Slightly lighter dark brown
          labelStyle={styles.buttonLabel}
        >
          ADD
        </Button>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5', // Off-white background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4CAF50', // Dark green
  },
  plantInfoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plantName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark grey
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonLabel: {
    fontSize: 16,
  },
  dateTimeText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333', // Dark grey
  },
  dropdownContainer: {
    width: '100%',
    marginTop: 20,
  },
  dropdownHeader: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#4CAF50', // Dark green
    borderRadius: 5,
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: 'white',
  },
  optionsContainer: {
    marginTop: 5,
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 14,
    color: '#3E2723', // Dark brown
  },
  addButton: {
    marginTop: 20,
    width: '100%',
    borderRadius: 5,
  },
});

export default ReminderScreen;
