import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { decode } from "base-64";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../../../firebase";
import { auth } from "../../../firebase";
import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  uploadBytes,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";

const PostScreen = () => {
  const [filePath, setFilePath] = useState({});
  const [uid, setUid] = useState({});
  const [isImageSelected, setIsImageSelected] = useState(false);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState({});
  const { control, handleSubmit } = useForm();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.warn(result["assets"]);

    if (!result.canceled) {
      setImage(result["assets"][0]["uri"]);
      setIsImageSelected(true);
    }
    try {
      await setUid(auth["currentUser"]["uid"]);
      console.warn(uid);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }

    console.warn(result["assets"]);
  };
  useEffect(() => {
    // setUid(auth['currentUser']['uid']);
  }, [filePath]);

  const uploadPhoto = async (data) => {
    // console.warn(filePath);
    const { itemName } = data;
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    let name = data.itemName + "." + uid + "/" + today.toISOString();
    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, name);
      // await uploadBytesResumable(storageRef, blob);
      await uploadBytes(storageRef, blob).then((snapshot) => {
        Alert.alert("Uploaded!");
      });
      return await getDownloadURL(storageRef);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.appButtonContainer}>Post a New Item!</Text>
      <CustomInput
        name="itemName"
        placeholder="Item Name"
        control={control}
        rules={{
          required: "Item Name is required",
          // minLength: {
          //   value: 8,
          //   message: "Password should be at least 8 charachters long",
          // },
        }}
      />
      {/* <TextInput
        onChangeText={(text) => setItemName(text)}
        value={itemName}
        style={{ padding: 10 }}
        placeholder="Item Name"
      /> */}
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.imageStyle} />
        {/* <Text style={styles.textStyle}>{filePath.uri}</Text> */}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={pickImage}
        >
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          disabled={!isImageSelected}
          style={[
            styles.buttonStyle,
            isImageSelected ? null : styles.buttonDisabled,
          ]}
          onPress={handleSubmit(uploadPhoto)}
        >
          <Text
            style={[
              styles.textStyle,
              isImageSelected ? null : styles.textStyleDisabled,
            ]}
          >
            Upload
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.backButtonStyle}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.backTextStyle}>Back to store</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-end",
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
});
