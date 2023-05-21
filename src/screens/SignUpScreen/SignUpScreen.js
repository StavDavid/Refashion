import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import React, { useState } from "react";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import SocialSignInButtons from "../../components/SocialSignInButtons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";
EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PHONE_NUMBER_REGEX = /^05[0-9]-\d{7}$/;
const SignUpScreen = () => {
  const { control, handleSubmit, watch } = useForm();
  const pwd = watch("password");
  const navigation = useNavigation();
  const onRegisterPressed = async (data) => {
    const { username, password, email, name } = data;
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      ).then(async () => {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          email: data.email,
          phone_number: data.phone,
          full_name: data.name,
        });
      });
      navigation.navigate("ConfirmEmailScreen");
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  };
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };
  const onTermsOfUsePressed = () => {
    const url =
      "https://doc-hosting.flycricket.io/refashion-terms-of-use/e3f6ed7b-586b-4db5-b30b-e79d48dab90b/terms";
    Linking.openURL(url);
  };
  const onPrivacyPolicyPressed = () => {
    const url =
      "https://doc-hosting.flycricket.io/refashion-privacy-policy/6d0061fa-18c2-422f-a8ee-30873eda5f01/privacy";
    Linking.openURL(url);
  };
  return (
    <ScrollView showVerticalScrollIndicator={false}>
      <Text style={styles.appButtonContainer}>Create a user</Text>
      <CustomInput
        name="email"
        placeholder="Email"
        control={control}
        rules={{
          pattern: {
            value: EMAIL_REGEX,
            message: "Email is invalid",
          },
        }}
      />
      <CustomInput
        name="name"
        placeholder="Full Name"
        control={control}
        rules={{
          required: "Full Name is required",
          minLength: {
            value: 5,
            message:
              "Full Name should be at least 4 charachters long with space",
          },
        }}
      />
      <CustomInput
        name="phone"
        placeholder="Phone Number"
        control={control}
        rules={{
          required: "Phone number is required",
          pattern: {
            value: PHONE_NUMBER_REGEX,
            message: "Phone number is invalid, xxx-xxxxxxx",
          },
        }}
      />
      <CustomInput
        name="password"
        placeholder="Password"
        control={control}
        secureTextEntry
        rules={{
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password should be at least 8 charachters long",
          },
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            message:
              "Password must contain at least one lowercase letter, one uppercase letter, and one digit",
          },
        }}
      />
      <CustomInput
        name="password-repeat"
        placeholder="Repeat Password"
        control={control}
        secureTextEntry
        rules={{
          validate: (value) => value === pwd || "Password do not match",
        }}
      />
      <CustomButton text="Register" onPress={handleSubmit(onRegisterPressed)} />
      <Text style={styles.text}>
        By registering, you confirm that you accept our{" "}
        <Text style={styles.link} onPress={onTermsOfUsePressed}>
          Terms of Use
        </Text>{" "}
        and
        <Text style={styles.link} onPress={onPrivacyPolicyPressed}>
          {" "}
          Privacy Policy
        </Text>
      </Text>
      {/* <SocialSignInButtons /> */}
      <CustomButton
        text="Have an account? Sign in"
        onPress={onSignInPressed}
        type="TERTIARY"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
  appButtonContainer: {
    backgroundColor: "#cfc5ae",
    paddingHorizontal: 20,
    paddingTop: 20, // Decreased the top padding to lower the height
    paddingBottom: 10, // Decreased the bottom padding to lower the height
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center the title horizontally
    borderBottomWidth: 1,
    borderBottomColor: "#B2B2B2",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center", // Center the title vertically
  },
});

export default SignUpScreen;
