import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Yup from 'yup';

// Define the schema for signup validation
const signUpSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required').matches(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Invalid email format'
  ),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await signUpSchema.validate({ fullName, email, password });
      // Proceed with signup logic
      setError(''); // Clear any previous error
    } catch (validationError) {
      setError(validationError.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
         source={require('./assets/GardenSense-removebg-preview.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : <Text style={styles.success}>Looks good!</Text>}
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200, // Adjust the width and height as needed
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
    fontSize: 16,
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#388E3C',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 80,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  success: {
    color: 'green',
    marginBottom: 12,
  },
});

export default SignUp;
