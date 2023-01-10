import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';

const NewPasswordScreen = () => {
  const {control, handleSubmit} = useForm();
  const navigation = useNavigation();
  const onSubmitPressed = async data => {
    try {
      await Auth.forgotPasswordSubmit(data.username, data.code, data.password);
      navigation.navigate('SignIn');
    } catch (e) {
      Alert.alert('אופס', e.message);
    }
  };
  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };
  return (
    <ScrollView showVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset Your Password</Text>
        <CustomInput
          name="username"
          placeholder="Username"
          control={control}
          rules={{required: 'Username is required'}}
        />
        <CustomInput
          name="code"
          placeholder="Code"
          control={control}
          rules={{required: 'Code is required'}}
        />
        <CustomInput
          name="password"
          control={control}
          placeholder="Enter your new password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 charachters long',
            },
          }}
        />
        <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} />
        <CustomButton
          text="Back to Sign In"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default NewPasswordScreen;
