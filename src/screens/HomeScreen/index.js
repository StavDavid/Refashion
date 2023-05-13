import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { storage } from "../../../firebase";
import { auth } from "../../../firebase";
import { getDownloadURL } from "firebase/storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import PostScreen from "../PostScreen";
import CustomButton from "../../components/CustomButton";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { getStorage, ref, listAll, getMetadata } from "firebase/storage";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import { Card } from "react-native-elements";
const HomeScreen = () => {
  const [bgColor, setBgColor] = useState("");
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [names, setNames] = useState([]);
  const isFocused = useIsFocused();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [timestamps, setTimestamps] = useState([]);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {
      label: "All",
      value: "",
      subcategories: [],
    },
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
  useEffect(() => {
    if (isFocused) {
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
        const imageTimestamps = metadata.map((item) => {
          const timestamp = moment(item.updated).format("DD.MM.YY HH:mm");
          return timestamp;
        });

        setNames(namesWithMetadata);
        setGallery(urls);
        setTimestamps(imageTimestamps);
      };

      getGalleryImages();
      setBgColor("messages");
    }
  }, [isFocused]);
  const updateSearch = (search) => {
    setSearch(search);
  };
  const handleStorePress = () => {
    setBgColor("messages");
    navigation.navigate("Home");
  };
  const handleNewPostPress = () => {
    setBgColor("newPost");
    navigation.navigate("PostScreen");
  };
  const handleSettingPress = () => {
    setBgColor("settings");
    navigation.navigate("Settings");
  };
  const handleSignOutPress = () => {
    setBgColor("signOut");
    signOutUser();
  };
  const navigation = useNavigation();
  const signOutUser = async () => {
    try {
      await signOut(auth).then(() => {
        navigation.navigate("SignIn");
      });
    } catch (error) {
      console.warn(error.message);
    }
  };

  return (
    // <NavigationContainer independent={true}>
    //   <Navbar></Navbar>
    // </NavigationContainer>
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Store</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
          containerStyle={{ flex: 1, marginLeft: 5 }}
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
            containerStyle={{ flex: 1, marginRight: 5 }}
          />
        )}
      </View>
      <ScrollView showVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          {gallery.map((image, index) => {
            const categoryMatches =
              selectedCategory === "" ||
              names[index].category === selectedCategory;
            const subcategoryMatches =
              selectedSubcategory === "" ||
              names[index].subcategory === selectedSubcategory;

            if (categoryMatches && subcategoryMatches) {
              return (
                <Card key={index} containerStyle={styles.cardContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ItemDetails", {
                        Name: names[index].item_name,
                        Description: names[index].item_description,
                        Uri: image,
                        Uid: names[index].item_uid,
                        Email: names[index].email,
                        Phone: names[index].phone_number,
                      })
                    }
                  >
                    <Image source={{ uri: image }} style={styles.image} />
                    <Text style={styles.cardTitle}>
                      {names[index].item_name}
                    </Text>
                    <Text style={styles.cardDescription}>
                      {names[index].item_description}
                    </Text>
                    <Text style={styles.cardTimestamp}>
                      {timestamps[index]}
                    </Text>
                  </TouchableOpacity>
                </Card>
              );
            }

            return null;
          })}
        </View>
      </ScrollView>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: bgColor === "messages" ? "#ab996f" : "#cfc5ae",
              },
            ]}
            onPress={handleStorePress}
          >
            <AntDesign name="appstore1" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: bgColor === "newPost" ? "#ab996f" : "#cfc5ae",
              },
            ]}
            onPress={handleNewPostPress}
          >
            {/* <Text style={styles.postText}>+</Text> */}
            <AntDesign name="pluscircleo" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: bgColor === "settings" ? "#ab996f" : "#cfc5ae",
              },
            ]}
            onPress={handleSettingPress}
          >
            <SimpleLineIcons name="settings" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: bgColor === "signOut" ? "#ab996f" : "#cfc5ae",
              },
            ]}
            onPress={handleSignOutPress}
          >
            <AntDesign name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = {
  button: {
    backgroundColor: "#cfc5ae",
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 70,
    width: 60,
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
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#EAE6D8",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: "100%",
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    marginBottom: 20,
  },
  text: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  postText: {
    fontSize: 25,
    color: "white",
    textAlign: "center",
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
    height: 200,
    margin: 5,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  item: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContainer: {
    margin: 5,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "gray",
  },
  cardTimestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 5,
    alignSelf: "flex-end",
    marginTop: "auto",
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
};
