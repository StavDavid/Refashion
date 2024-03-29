import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import SocialSignInButtons from "../../components/SocialSignInButtons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useRoute } from "@react-navigation/native";
import { auth } from "../../../firebase";
import { sendEmailVerification } from "firebase/auth";
const ConfirmEmailScreen = () => {
  const route = useRoute();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { username: route?.params?.username },
  });

  const username = watch("username");

  const navigation = useNavigation();

  const onConfirmPressed = async (data) => {
    try {
      // const auth = getAuth();
      sendEmailVerification(auth.currentUser).then(() => {
        Alert.alert("Success! Verification Email sent");
      });
      navigation.navigate("SignIn");
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
    // navigation.navigate('Home');
  };
  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };
  // const onResendPressed = async () => {
  //   try {
  //     await Auth.resendSignUp(username);
  //     Alert.alert('Success', 'Code was resent to your email');
  //   } catch (e) {
  //     Alert.alert('Oops', e.message);
  //   }
  // };
  return (
    <ScrollView showVerticalScrollIndicator={false}>
      <Text style={styles.appButtonContainer}>Please Confirm Your Email</Text>
      {/* <CustomInput
          name="code"
          control={control}
          placeholder="Enter your confirmation code"
          rules={{required: 'Confirmation code is required'}}
        /> */}
      <CustomButton
        text="Send Verification Email"
        onPress={handleSubmit(onConfirmPressed)}
      />
      {/* <CustomButton
          text="Send Verification Email"
          onPress={onResendPressed}
          type="SECONDARY"
        /> */}
      <CustomButton
        text="Back to Sign In"
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

export default ConfirmEmailScreen;
