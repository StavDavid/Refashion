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
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={styles.appButtonContainer}
        onPress={handleStorePress}>
        <Text style={styles.appButtonText}>Store</Text>
      </TouchableOpacity>
      <View></View>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  // ...
  appButtonContainer: {
    elevation: 8,
    backgroundColor: '#009688',
    // borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '25%',
    borderBottomRightRadius: 6,
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    // textTransform: 'uppercase',
  },
});
