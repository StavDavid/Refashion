import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Logo from '../../../assets/images/Logo2.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {Auth} from 'aws-amplify';
const SignInScreen = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSignInPressed = async data => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const response = await Auth.signIn(data.username, data.password);
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
    setLoading(false);
    // navigation.navigate('Home');
  };
  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPasswordScreen');
  };
  const onSignUpPressed = () => {
    navigation.navigate('SignUp');
  };
  return (
    <ScrollView showVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, {height: height * 0.3}]}
          resizeMode="contain"
        />
        <CustomInput
          name="username"
          placeholder="שם משתמש"
          control={control}
          rules={{required: 'יש להזין שם משתמש'}}
        />
        <CustomInput
          name="password"
          placeholder="סיסמא"
          secureTextEntry
          control={control}
          rules={{
            required: 'יש להזין סיסמא',
            minLength: {
              value: 8,
              message: 'יש להזין סיסמא בעלת לפחות 8 תווים',
            },
          }}
        />

        <CustomButton
          text={loading ? 'טוען...' : 'התחבר'}
          onPress={handleSubmit(onSignInPressed)}
        />
        <CustomButton
          text="שכחתי סיסמא"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />
        {/* <SocialSignInButtons /> */}
        <CustomButton
          text="עדיין לא נרשמת? הרשם עכשיו"
          onPress={onSignUpPressed}
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
  logo: {
    width: '60%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;
