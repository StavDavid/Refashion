import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  Image,
  fetch,
} from "react-native";
import React, { useState, useEffect } from "react";
import { decode } from "base-64";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { launchImageLibrary } from "react-native-image-picker";
import { storage } from "../../../firebase";
import { auth } from "../../../firebase";
// import * as ImagePicker from "expo-image-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  putString,
} from "firebase/storage";

const PostScreen = () => {
  const [filePath, setFilePath] = useState({});
  const [uid, setUid] = useState({});
  const [isImageSelected, setIsImageSelected] = useState(false);
  const navigation = useNavigation();
  const chooseFile = (type) => {
    // console.warn(auth);

    // setUid(auth["currentUser"]["uid"]);
    // console.warn(uid);
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true,
    };
    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);

      if (response.didCancel) {
        Alert.alert("User cancelled camera picker");
        return;
      } else if (response.errorCode == "permission") {
        Alert.alert("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        Alert.alert(response.errorMessage);
        return;
      }
      setFilePath(response);
      setIsImageSelected(true);
      // console.warn(filePath['assets'][0]['uri']);
    });
  };
  useEffect(() => {
    // setUid(auth['currentUser']['uid']);
  }, [filePath]);

  const uploadPhoto = async () => {
    console.warn(filePath);
    // var base64 = require('base-64');
    // var image = base64.decode(filePath['assets'][0]['base64']);
    // console.warn(image);
    // const metadata = {
    //   contentType: filePath['assets'][0]['type'],
    // };
    // try {
    //   const storageRef = ref(storage, filePath['assets'][0]['fileName']);
    //   try {
    //     await storageRef.putString(image, 'base64', {contentType: 'image/jpg'});
    //   } catch (e) {
    //     console.warn(e.message);
    //   }
    //   setFilePath(null);
    // } catch (e) {
    //   console.warn(e.message);
    // }

    // 'file' comes from the Blob or File API
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.appButtonContainer}>Post New Item!</Text>
      <View style={styles.container}>
        {/* <Image source={{uri: filePath.uri}} style={styles.imageStyle} /> */}
        {/* <Text style={styles.textStyle}>{filePath.uri}</Text> */}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => chooseFile("photo")}
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
          onPress={uploadPhoto}
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
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.textStyle}>Back to store</Text>
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
