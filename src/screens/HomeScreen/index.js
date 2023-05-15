import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { storage } from "../../../firebase";
import { auth } from "../../../firebase";
import { getDownloadURL } from "firebase/storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import PostScreen from "../PostScreen";
import CustomButton from "../../components/CustomButton";
import { db } from "../../../firebase";
import { getDoc, doc, setDoc, arrayUnion } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { getStorage, ref, listAll, getMetadata } from "firebase/storage";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import { Rating } from "react-native-ratings";
import { Card } from "react-native-elements";
const HomeScreen = () => {
  const [bgColor, setBgColor] = useState("");
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [names, setNames] = useState([]);
  const isFocused = useIsFocused();
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportInput, setReportInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);
  const [showSubcategory, setShowSubcategory] = useState(false);
  const [selectedItemUid, setSelectedItemUid] = useState("");
  const [userName, setUserName] = useState("");
  const [timestamps, setTimestamps] = useState([]);
  const [ratings, setRatings] = useState({});
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
    // Fetch ratings for all item UIDs
    const fetchRatings = async () => {
      const newRatings = {};
      for (const name of names) {
        const rating = await getRating(name.item_uid);
        newRatings[name.item_uid] = rating;
      }
      setRatings(newRatings);
    };

    fetchRatings();
  }, [names]);
  useEffect(() => {
    const getData = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, `users/${auth.currentUser.uid}`);
        const docSnap = await getDoc(docRef);
        setUserName(docSnap.data().full_name);
      }
    };

    getData();
  }, [isFocused]);
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

        // Filter out items with archive: "true"
        const filteredNames = namesWithMetadata.filter(
          (item) => item && item.archive !== "true"
        );
        const filteredUrls = filteredNames.map((_, index) => urls[index]);
        const filteredTimestamps = filteredNames.map(
          (_, index) => imageTimestamps[index]
        );

        setNames(filteredNames);
        setGallery(filteredUrls);
        setTimestamps(filteredTimestamps);
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
  const handleReport = (itemUid) => {
    Alert.alert("Confirmation", "Are you sure you want to report this item?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          setSelectedItemUid(itemUid);
          setShowReportInput(true);
        },
      },
    ]);
  };

  const handleReportUser = async () => {
    const startIndex = selectedItemUid.indexOf(".") + 1; // Get the index after the first dot
    const endIndex = selectedItemUid.indexOf(".", startIndex); // Get the index of the second dot
    const substring = selectedItemUid.substring(startIndex, endIndex);
    const docRef = doc(db, `reports/${selectedItemUid}`);
    await setDoc(
      docRef,
      {
        reports: arrayUnion(userName + ": " + reportInput),
        item_uid: selectedItemUid,
      },
      { merge: true }
    );
    setReportInput("");
    setShowReportInput(false);
  };
  const getRating = async (itemUid) => {
    try {
      const docRef = doc(db, `items/${itemUid}`);
      const docSnap = await getDoc(docRef);
      const ratingArray = docSnap.data().rating;

      if (Array.isArray(ratingArray) && ratingArray.length === 5) {
        const itemScore =
          1 * ratingArray[0] +
          2 * ratingArray[1] +
          3 * ratingArray[2] +
          4 * ratingArray[3] +
          5 * ratingArray[4];
        return itemScore;
      } else {
        // Handle the case when ratingArray is not an array or doesn't have the expected length
        return 0; // Return a default value or handle the error appropriately
      }
    } catch (error) {
      console.error("Error getting rating:", error);
      return 0; // Return a default value or handle the error appropriately
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
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={15} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
        />
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

            const nameMatches =
              search === "" ||
              names[index].item_name
                .toLowerCase()
                .includes(search.toLowerCase());

            if (categoryMatches && subcategoryMatches && nameMatches) {
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
                    <View style={styles.ratingContainer}>
                      <Rating
                        showRating={false}
                        startingValue={ratings[names[index].item_uid]} // Replace with the actual rating value
                        imageSize={20}
                        readonly
                        style={styles.rating}
                      />
                      <TouchableOpacity
                        onPress={() => handleReport(names[index].item_uid)}
                      >
                        <MaterialCommunityIcons
                          name="flag"
                          size={24}
                          color="gray"
                          style={styles.reportIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Card>
              );
            }

            return null;
          })}
        </View>
      </ScrollView>
      <View>
        <Modal visible={showReportInput} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Report Item</Text>
              <TextInput
                style={styles.reportInput}
                placeholder="Enter your report"
                onChangeText={setReportInput}
                value={reportInput}
              />
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowReportInput(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleReportUser}
                >
                  <Text style={styles.modalButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  rating: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 5,
    marginRight: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportIcon: {
    marginLeft: 200,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  reportInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalButton: {
    backgroundColor: "#cfc5ae",
    padding: 10,
    marginHorizontal: 40,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  reportButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: "#ebebeb",
    borderRadius: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
  },
};
