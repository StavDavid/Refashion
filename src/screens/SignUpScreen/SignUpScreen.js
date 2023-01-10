import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../../../firebase';
EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const SignUpScreen = () => {
  const {control, handleSubmit, watch} = useForm();
  const pwd = watch('password');
  const navigation = useNavigation();
  const onRegisterPressed = async data => {
    const {username, password, email, name} = data;
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      navigation.navigate('ConfirmEmailScreen');
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };
  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };
  const onTermsOfUsePressed = () => {
    console.warn('TermsOfUse');
  };
  const onPrivacyPolicyPressed = () => {
    console.warn('PrivacyPolicy');
  };
  return (
    <ScrollView showVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create a user</Text>
        {/* <CustomInput
          name="name"
          control={control}
          placeholder="Full name"
          rules={{
            required: 'Full name is required',
            minLength: {
              value: 3,
              message: 'Full name should be at least 3 charachters long',
            },
            maxLength: {
              value: 24,
              message: 'Full name should be maximum 24 charachters long',
            },
          }}
        />
        <CustomInput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username should be at least 3 charachters long',
            },
            maxLength: {
              value: 24,
              message: 'Username should be maximum 24 charachters long',
            },
          }}
        /> */}
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{pattern: {value: EMAIL_REGEX, message: 'Email is invalid'}}}
        />
        <CustomInput
          name="password"
          placeholder="Password"
          control={control}
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 charachters long',
            },
          }}
        />
        <CustomInput
          name="password-repeat"
          placeholder="Repeat Password"
          control={control}
          secureTextEntry
          rules={{
            validate: value => value === pwd || 'Password do not match',
          }}
        />
        <CustomButton
          text="Register"
          onPress={handleSubmit(onRegisterPressed)}
        />
        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and
          <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
            {' '}
            Privacy Policy
          </Text>
        </Text>
        {/* <SocialSignInButtons /> */}
        <CustomButton
          text="Have an account? Sign in"
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

export default SignUpScreen;
