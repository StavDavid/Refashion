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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { storage } from "../../../firebase";
import { auth, db } from "../../../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
  getDoc,
  arrayRemove,
} from "firebase/firestore";
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
  listAll,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const History = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState("");
  const [gallery, setGallery] = useState([]);
  const [names, setNames] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const getData = async () => {
        const docRef = doc(db, `users/${auth.currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        setItems(docSnap.data().items);
        getGalleryImages();
      };
      getData();
    }
  }, [isFocused]);

  const deleteItem = async (itemUid) => {
    Alert.alert("Confirmation", "Are you sure you want to delete this item?", [
      { text: "No", style: "cancel" },
      { text: "Yes", onPress: () => handleDeleteConfirm(itemUid) },
    ]);
  };

  const handleDeleteConfirm = async (itemUid) => {
    const desertRef = ref(storage, "/" + itemUid);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        Alert.alert("Item Deleted");
      })
      .catch((error) => {
        Alert.alert("Oh no! an error occured");
      });

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        items: arrayRemove(itemUid),
      });
      setRefresh(!refresh);
    } catch (error) {
      // Handle error
    }
  };

  const getGalleryImages = async () => {
    const storageRef = ref(storage, "/");
    const images = await listAll(storageRef);
    const urls = await Promise.all(
      images.items.map((imageRef) => getDownloadURL(imageRef))
    );
    const metadata = await Promise.all(
      images.items.map((imageRef) => getMetadata(imageRef))
    );
    const namesWithMetadata = await Promise.all(
      images.items.map(async (imageRef) => {
        const metadata = await getMetadata(imageRef);
        return metadata.customMetadata;
      })
    );
    setNames(namesWithMetadata);
    const filteredUrls = urls.filter((url, index) =>
      items.includes(namesWithMetadata[index].item_uid)
    );
    setGallery(filteredUrls);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text style={styles.appButtonContainer}>History</Text>
      </View>
      <ScrollView showVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          {gallery.map((image, index) => (
            <View key={index} style={styles.item}>
              <Image source={{ uri: image }} style={styles.image} />
              <View style={styles.itemDetails}>
                <View>
                  <Text>Name: {names[index].item_name}</Text>
                  <Text>Description: {names[index].item_description}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => deleteItem(names[index].item_uid)}
                >
                  <AntDesign name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 15,
  },
  image: {
    width: 300,
    height: 300,
    margin: 10,
  },
  itemDetails: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default History;
