import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../../assets/images/Logo2.png";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import SocialSignInButtons from "../../components/SocialSignInButtons";
import { useNavigation } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import {
  doc,
  getDocs,
  collection,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../firebase";

const SignInScreen = () => {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSignInPressed = async (data) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // navigation.navigate('Home');
      checkVerification();
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
    setLoading(false);
    // navigation.navigate('Home');
    // navigation.navigate('Home');
  };
  const checkVerification = async () => {
    if (auth.currentUser.emailVerified === false) {
      Alert.alert("Please Verify Your Email");
    } else {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.ban === 1) {
          Alert.alert("You are banned. Please contact support.");
        } else {
          navigation.navigate("Home");
        }
      } else {
        Alert.alert("User document does not exist");
      }
    }
  };
  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPasswordScreen");
  };
  const onSignUpPressed = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ScrollView showVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <CustomInput
          name="email"
          placeholder="Email"
          control={control}
          rules={{ required: "Email is required" }}
        />
        <CustomInput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{
            required: "Password is requierd",
            minLength: {
              value: 8,
              message: "Password should be minimum 8 charachter long",
            },
          }}
        />

        <CustomButton
          text={loading ? "Loading..." : "Sign In"}
          onPress={handleSubmit(onSignInPressed)}
        />
        <CustomButton
          text="Forgot Password"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />
        {/* <SocialSignInButtons /> */}
        <CustomButton
          text="Don't have an account? Create one now!"
          onPress={onSignUpPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "60%",
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;
