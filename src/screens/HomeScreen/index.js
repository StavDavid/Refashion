import React from 'react';
import {View, Text} from 'react-native';
import {getAuth, signOut} from 'firebase/auth';
import {auth} from '../../../firebase';
import {useNavigation} from '@react-navigation/native';
import {NavigationContainer} from '@react-navigation/native';
const HomeScreen = () => {
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

  return (
    // <NavigationContainer independent={true}>
    //   <Navbar></Navbar>
    // </NavigationContainer>
    <View style={{flex: 1}}>
      <Text style={{fontSize: 24, alignSelf: 'center'}}>Store</Text>
      <Text
        onPress={signOutUser}
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'red',
          marginTop: 'auto',
          marginVertical: 20,
          fontSize: 20,
        }}>
        Sign Out
      </Text>
    </View>
  );
};

export default HomeScreen;
