import React, {useState} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import {getAuth, signOut} from 'firebase/auth';
import {auth} from '../../../firebase';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
import PostScreen from '../PostScreen';
import CustomButton from '../../components/CustomButton';

const HomeScreen = () => {
  const [bgColor, setBgColor] = useState('');
  const [search, setSearch] = useState('');

  const updateSearch = search => {
    setSearch(search);
  };
  const handleStorePress = () => {
    setBgColor('messages');
  };
  const handleNewPostPress = () => {
    setBgColor('newPost');
    navigation.navigate('PostScreen');
  };
  const handleSettingPress = () => {
    setBgColor('settings');
  };
  const handleSignOutPress = () => {
    setBgColor('signOut');
    signOutUser();
  };
  const navigation = useNavigation();
  const signOutUser = async () => {
    try {
      await signOut(auth).then(() => {
        navigation.navigate('SignIn');
      });
    } catch (error) {
      console.warn(error.message);
    }
  };

  const newPost = () => {
    // navigation.navigate('PostScreen');
  };

  const home = () => {
    // navigation.navigate('PostScreen');
  };

  const settings = () => {
    // navigation.navigate('PostScreen');
  };

  return (
    // <NavigationContainer independent={true}>
    //   <Navbar></Navbar>
    // </NavigationContainer>
    <View style={{flex: 1}}>
      <View style={{alignItems: 'center', width: '100%'}}>
        <Text style={styles.appButtonContainer}>Store</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: bgColor === 'messages' ? '#FF597B' : '#B2B2B2'},
            ]}
            onPress={handleStorePress}>
            <Text style={styles.text}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: bgColor === 'newPost' ? '#FF597B' : '#B2B2B2'},
            ]}
            onPress={handleNewPostPress}>
            <Text style={styles.postText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: bgColor === 'settings' ? '#FF597B' : '#B2B2B2'},
            ]}
            onPress={handleSettingPress}>
            <Text style={styles.text}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: bgColor === 'signOut' ? '#FF597B' : '#B2B2B2'},
            ]}
            onPress={handleSignOutPress}>
            <Text style={styles.text}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = {
  button: {
    backgroundColor: '#B2B2B2',
    padding: 10,
    gep: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70,
    width: '23%',
    height: 60,
    elevation: 5,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    // borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    borderBottomRightRadius: 6,
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  text: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  postText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
  },
};
