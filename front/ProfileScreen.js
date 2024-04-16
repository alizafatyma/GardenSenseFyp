import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
  const [editableBio, setEditableBio] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePicture(result.uri);
    }
  };

  const handleBioEdit = () => {
    setEditableBio(!editableBio);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity onPress={pickImage}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePictureText}>Upload Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.editButton}>
          <TouchableOpacity onPress={handleBioEdit}>
            <Text style={styles.editButtonText}>{editableBio ? 'Save' : 'Edit Bio'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bioContainer}>
        {editableBio ? (
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={styles.editableBio}
            multiline={true}
            placeholder="Enter your bio"
          />
        ) : (
          <Text style={styles.bioText}>{bio}</Text>
        )}
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
      <View style={styles.followersContainer}>
        <Text style={styles.followersLabel}>Followers:</Text>
        <Text style={styles.followersCount}>100K</Text>
      </View>
      <View style={styles.scoreLevelContainer}>
        <Text style={styles.scoreLabel}>Score:</Text>
        <Text style={styles.scoreValue}>500</Text>
        <Text style={styles.levelLabel}>Level:</Text>
        <Text style={styles.levelValue}>10</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  profilePicturePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#444',
    borderRadius: 75,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureText: {
    color: '#fff',
    fontSize: 16,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#8B4513', // Dark brown
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff', // White text color
    fontSize: 12,
    fontWeight: 'bold',
  },
  bioContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  bioText: {
    fontSize: 16,
    marginBottom: 10,
  },
  editableBio: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    fontSize: 16,
    height: 100,
  },
  followButton: {
    backgroundColor: '#008000', // Dark green
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  followButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  followersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  followersLabel: {
    color: '#000',
    marginRight: 5,
  },
  followersCount: {
    color: '#000',
    fontWeight: 'bold',
  },
  scoreLevelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#000',
    marginRight: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreValue: {
    color: '#000',
    marginRight: 20,
    fontSize: 18,
  },
  levelLabel: {
    color: '#000',
    marginRight: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelValue: {
    color: '#000',
    fontSize: 18,
  },
});

export default ProfileScreen;