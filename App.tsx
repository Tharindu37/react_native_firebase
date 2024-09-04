/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import database from '@react-native-firebase/database';
import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';


function App(): React.JSX.Element {

  const addUser = async (userId, name, email) =>{
    try{
      await database().ref(`/users/${userId}`).set({name:name, email:email});
      console.log('User added successfully.')
    }catch(error){
      console.log(error);
    }
  }

  const getUser = async (userId) => {
    try {
      const snapshot = await 
        database()
        .ref(`/users/${userId}`)
        .once('value');
      console.log('User data: ', snapshot.val());
    } catch (error) {
      console.log(error);
    }
  };
  
  const subscribeToUser = (userId) => {
   database()
      .ref(`/users/${userId}`)
      .on('value', (snapshot) => {
        console.log('User data: ', snapshot.val());
      });
  };
  
  // Don't forget to unsubscribe when you no longer need the data
  const unsubscribe = () => {
    database().ref(`/users/${userId}`).off('value');
  };
  
  const updateUser = async (userId, name) => {
    try {
      await 
        database()
        .ref(`/users/${userId}`)
        .update({
          name: name,
        });
      console.log('User updated successfully');
    } catch (error) {
      console.log(error);
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      await database().ref(`/users/${userId}`).remove();
      console.log('User deleted successfully');
    } catch (error) {
      console.log(error);
    }
  };
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('1'); // Example user ID

  useEffect(() => {
    // Fetch user data when the component mounts
    getUser(userId);

    // Subscribe to real-time updates
    subscribeToUser(userId);

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  const handleAddUser = () => {
    addUser(userId, name, email);
  };

  const handleUpdateUser = () => {
    updateUser(userId, name);
  };

  const handleDeleteUser = () => {
    deleteUser(userId);
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Add User" onPress={handleAddUser} />
      <Button title="Update User" onPress={handleUpdateUser} />
      <Button title="Delete User" onPress={handleDeleteUser} />
    </View>
  );
}


export default App;
