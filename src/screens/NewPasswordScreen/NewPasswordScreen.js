import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {Auth} from 'aws-amplify';
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
        <Text style={styles.title}>אפס סיסמא</Text>
        <CustomInput
          name="username"
          placeholder="שם משתמש"
          control={control}
          rules={{required: 'Username is required'}}
        />
        <CustomInput
          name="code"
          placeholder="קוד"
          control={control}
          rules={{required: 'Code is required'}}
        />
        <CustomInput
          name="password"
          control={control}
          placeholder="הזן סיסמא חדשה"
          rules={{
            required: 'יש להזין סיסמא',
            minLength: {
              value: 8,
              message: 'יש להזין סיסמא עם 8 תווים או יותר',
            },
          }}
        />
        <CustomButton text="Submit" onPress={handleSubmit(onSubmitPressed)} />
        <CustomButton
          text="חזרה למסך ההתחברות"
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
