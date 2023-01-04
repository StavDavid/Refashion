import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useState} from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {Auth} from 'aws-amplify';
EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const SignUpScreen = () => {
  const {control, handleSubmit, watch} = useForm();
  const pwd = watch('password');
  const navigation = useNavigation();
  const onRegisterPressed = async data => {
    const {username, password, email, name} = data;
    try {
      const response = await Auth.signUp({
        username,
        password,
        attributes: {email, name, preferred_username: username},
      });
      navigation.navigate('ConfirmEmailScreen', {username});
    } catch (e) {
      Alert.alert('אופס', e.message);
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
        <Text style={styles.title}>יצירת משתמש</Text>
        <CustomInput
          name="name"
          control={control}
          placeholder="שם ושם משפחה"
          rules={{
            required: 'שם הכרחי',
            minLength: {
              value: 3,
              message: 'יש להזין משתמש בעל לפחות 3 תווים',
            },
            maxLength: {
              value: 24,
              message: 'יש להזין שם ושם משפחה בעל פחות מ24 תווים',
            },
          }}
        />
        <CustomInput
          name="username"
          control={control}
          placeholder="שם משתמש"
          rules={{
            required: 'שם משתמש חובה',
            minLength: {
              value: 3,
              message: 'יש להזין שם משתמש בעל לפחות 3 תווים',
            },
            maxLength: {
              value: 24,
              message: 'יש להזין משתמש בעל פחות מ24 תווים',
            },
          }}
        />
        <CustomInput
          name="email"
          placeholder="אימייל"
          control={control}
          rules={{pattern: {value: EMAIL_REGEX, message: 'אימייל לא חוקי'}}}
        />
        <CustomInput
          name="password"
          placeholder="סיסמא"
          control={control}
          secureTextEntry
          rules={{
            required: 'יש להזין סיסמא',
            minLength: {
              value: 8,
              message: 'יש להזין סיסמא בעלת לפחות 8 תווים',
            },
          }}
        />
        <CustomInput
          name="password-repeat"
          placeholder="הזן סיסמא שנית"
          control={control}
          secureTextEntry
          rules={{
            validate: value => value === pwd || 'סיסמא לא תואמת',
          }}
        />
        <CustomButton text="הרשם" onPress={handleSubmit(onRegisterPressed)} />
        <Text style={styles.text}>
          בהרשמה הנך מסכים{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            לתנאי השימוש
          </Text>{' '}
          וגם
          <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
            {' '}
            למדיניות הפרטיות
          </Text>
        </Text>
        {/* <SocialSignInButtons /> */}
        <CustomButton
          text="מעבר למסך ההתחברות"
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
