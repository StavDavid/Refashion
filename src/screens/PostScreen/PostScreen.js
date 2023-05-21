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
import { auth, db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadString,
  uploadBytes,
  updateMetadata,
} from "firebase/storage";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/CustomInput";
import { Feather } from "@expo/vector-icons";
const PostScreen = () => {
  const [filePath, setFilePath] = useState({});
  const [uid, setUid] = useState({});
  const [isImageSelected, setIsImageSelected] = useState(false);
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const { control, handleSubmit } = useForm();
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [intArray, setIntArray] = useState([0, 0, 0, 0, 0]);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "Men's Clothing",
      value: "mens_clothing",
      subcategories: [
        { label: "Shirts", value: "mens_shirts" },
        { label: "Pants", value: "mens_pants" },
        { label: "Jackets", value: "mens_jackets" },
        { label: "Suits", value: "mens_suits" },
      ],
    },
    {
      label: "Women's Clothing",
      value: "womens_clothing",
      subcategories: [
        { label: "Dresses", value: "womens_dresses" },
        { label: "Tops", value: "womens_tops" },
        { label: "Bottoms", value: "womens_bottoms" },
        { label: "Outerwear", value: "womens_outerwear" },
      ],
    },
    {
      label: "Kids' Clothing",
      value: "kids_clothing",
      subcategories: [
        { label: "Tops", value: "kids_tops" },
        { label: "Bottoms", value: "kids_bottoms" },
        { label: "Dresses", value: "kids_dresses" },
        { label: "Outerwear", value: "kids_outerwear" },
      ],
    },
    {
      label: "Shoes",
      value: "shoes",
      subcategories: [
        { label: "Men's Shoes", value: "mens_shoes" },
        { label: "Women's Shoes", value: "womens_shoes" },
        { label: "Kids' Shoes", value: "kids_shoes" },
        { label: "Athletic Shoes", value: "athletic_shoes" },
      ],
    },
    {
      label: "Accessories",
      value: "accessories",
      subcategories: [
        { label: "Hats", value: "hats" },
        { label: "Bags", value: "bags" },
        { label: "Belts", value: "belts" },
        { label: "Jewelry", value: "jewelry" },
      ],
    },
  ]);
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Oops", "Permissions must be granted to upload a photo");
      return;
    }
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
      // console.warn(uid);
    } catch (e) {
      Alert.alert("Oops", e.message);
    }

    // console.warn(result["assets"]);
  };

  const uploadPhoto = async (data) => {
    const { itemName } = data;
    setLoading(true);
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const name =
      data.itemName + "." + uid + "." + today.toISOString().slice(0, 16);

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, name);
      await uploadBytes(storageRef, blob);

      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      const itemRef = ref(storage, name);
      const metadata = {
        customMetadata: {
          archive: "false",
          item_name: data.itemName,
          item_description: data.itemDescription,
          item_uid: name,
          category: selectedCategory,
          subcategory: selectedSubcategory,
          phone_number: userData.phone_number,
          email: userData.email,
        },
      };
      await updateMetadata(itemRef, metadata);

      const imageRef = doc(db, `users/${auth.currentUser.uid}`);
      await updateDoc(imageRef, { items: arrayUnion(name) }, { merge: true });

      await setDoc(doc(db, "items", name), {
        item_name: data.itemName,
        item_description: data.itemDescription,
        rating: intArray,
      });

      Alert.alert("Uploaded!");
      navigation.navigate("Home");
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
        }}
      />
      <CustomInput
        name="itemDescription"
        placeholder="Item Description"
        control={control}
        rules={{
          required: "Item Description is required",
        }}
      />
      <View style={{ flexDirection: "row" }}>
        <DropDownPicker
          open={categoryOpen}
          value={selectedCategory}
          items={items}
          setOpen={setCategoryOpen}
          setValue={setSelectedCategory}
          setItems={setItems}
          placeholder="Select a category"
          onChangeValue={(value) => {
            setSelectedCategory(value);
            setSelectedSubcategory("");
            setShowSubcategory(true);
          }}
          containerStyle={{ flex: 1, marginRight: 5 }}
        />

        {showSubcategory && (
          <DropDownPicker
            open={subcategoryOpen}
            value={selectedSubcategory}
            items={
              items.find((item) => item.value === selectedCategory)
                ?.subcategories || []
            }
            placeholder="Select a subcategory"
            setOpen={setSubcategoryOpen}
            setValue={setSelectedSubcategory}
            setItems={setItems}
            containerStyle={{ flex: 1, marginLeft: 5 }}
          />
        )}
      </View>
      <View style={styles.container}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imageStyle} />
        ) : (
          <Image source={{ uri: image }} style={styles.imagePlaceholder} />
        )}
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="upload" size={24} color="#393E46" />
            <Text
              style={[
                styles.textStyle,
                isImageSelected ? null : styles.textStyleDisabled,
              ]}
              text={loading ? "Loading..." : "Upload"}
            >
              {loading ? "Loading..." : "Upload"}
            </Text>
          </View>
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
    backgroundColor: "white",
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
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center", // Center the title vertically
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
    backgroundColor: "#cfc5ae",
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
    width: 250,
    height: 300,
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: "#cfc5ae",
    color: "black",
    borderRadius: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  categoryText: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerStyle: {
    flex: 1,
    height: 40,
    borderColor: "gray", // Update the border color
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  headerContainer: {
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center", // Center the title vertically
  },
  imagePlaceholder: {
    width: 250,
    height: 300,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
