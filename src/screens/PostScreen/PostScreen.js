import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import React from 'react';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
const PostScreen = () => {
  const navigation = useNavigation();
  const handleStorePress = () => {
    navigation.navigate('Home');
  };
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center', width: '100%'}}>
          <Text style={styles.header}>Post Your Item</Text>
        </View>
      </View>
      <View
        style={{
          alignItems: 'center',
          width: '100%',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
          style={styles.appButtonContainer}
          onPress={handleStorePress}>
          <Text style={styles.appButtonText}>Store</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  // ...
  header: {
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#FF597B',
    // borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '25%',
    borderRadius: 6,
    justifyContent: 'flex-end',
    bottom: 0,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    // textTransform: 'uppercase',
  },
});
