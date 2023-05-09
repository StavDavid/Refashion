import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { decode } from "base-64";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../../../firebase";
import { auth, db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  uploadBytes,
  updateMetadata,
  connectStorageEmulator,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { Feather } from "@expo/vector-icons";

const Settings = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");

  const handleHistoryPress = () => {
    navigation.navigate("History");
  };

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(db, `users/${auth.currentUser.uid}`);
      const docSnap = await getDoc(docRef);
      setName(docSnap.data().full_name);
    };
    getData();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text style={styles.appButtonContainer}>Settings</Text>
        <Text style={styles.appButtonContainer1}>Hi, {name}</Text>
        <TouchableOpacity style={styles.button} onPress={handleHistoryPress}>
          <FontAwesome5 name="history" size={24} color="black" />
          <Text>Upload History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    backgroundColor: "#62CDFF",
    padding: 15,
    gep: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 30,
    borderRadius: 70,
    width: "40%",
    height: 60,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  titleText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  textStyle: {
    padding: 10,
    color: "white",
    textAlign: "center",
  },
  backTextStyle: {
    padding: 10,
    color: "gray",
    textAlign: "center",
  },
  textStyleDisabled: {
    padding: 10,
    color: "black",
    textAlign: "center",
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    // borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: "100%",
    borderBottomRightRadius: 6,
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
  appButtonContainer1: {
    // elevation: 8,
    backgroundColor: "#B2B2B2",
    borderColor: "white",
    marginTop: "2%",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 2,
    width: "100%",
    // borderRadius: 100,
    // borderBottomRightRadius: 6,
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#FF597B",
    padding: 5,
    marginVertical: 10,
    width: 250,
    borderRadius: 8,
  },
  backButtonStyle: {
    alignItems: "center",
    color: "gray",
    padding: 5,
    marginVertical: 10,
    width: 250,
    // borderRadius: 8,
  },
  imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: "#B2B2B2",
    color: "black",
    borderRadius: 8,
  },
  gallery: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 15,
  },
  image: {
    width: 300,
    height: 300,
    margin: 5,
  },
});

export default Settings;
