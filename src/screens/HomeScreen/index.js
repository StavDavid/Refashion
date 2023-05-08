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
const HomeScreen = () => {
  const [bgColor, setBgColor] = useState("");
  const [search, setSearch] = useState("");
  const [photos, setPhotos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [names, setNames] = useState([]);
  const isFocused = useIsFocused();

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
        setNames(namesWithMetadata);
        setGallery(urls);
      };
      getGalleryImages();
    }
  }, [isFocused]);

  const updateSearch = (search) => {
    setSearch(search);
  };
  const handleStorePress = () => {
    setBgColor("messages");
  };
  const handleNewPostPress = () => {
    setBgColor("newPost");
    navigation.navigate("PostScreen");
  };
  const handleSettingPress = () => {
    setBgColor("settings");
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

  const newPost = () => {
    // navigation.navigate('PostScreen');
  };

  const home = () => {
    // navigation.navigate('PostScreen');
  };

  const settings = () => {
    // navigation.navigate('PostScreen');
  };

  return (
    // <NavigationContainer independent={true}>
    //   <Navbar></Navbar>
    // </NavigationContainer>
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center", width: "100%" }}>
        <Text style={styles.appButtonContainer}>Store</Text>
      </View>
      <ScrollView showVerticalScrollIndicator={false}>
        <View style={styles.gallery}>
          {gallery.map((image, index) => (
            <View key={index} style={styles.item}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ItemDetails", {
                    Name: names[index].item_name,
                    Description: names[index].item_description,
                    Uri: image,
                    Uid: names[index].item_uid,
                  })
                }
              >
                <Image source={{ uri: image }} style={styles.image} />
                <Text>Name: {names[index].item_name}</Text>
                <Text>Description: {names[index].item_description}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: bgColor === "messages" ? "#FF597B" : "#B2B2B2",
              },
            ]}
            onPress={handleStorePress}
          >
            <MaterialCommunityIcons
              name="chat-plus-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: bgColor === "newPost" ? "#FF597B" : "#B2B2B2",
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
                backgroundColor: bgColor === "settings" ? "#FF597B" : "#B2B2B2",
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
                backgroundColor: bgColor === "signOut" ? "#FF597B" : "#B2B2B2",
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
    backgroundColor: "#B2B2B2",
    padding: 10,
    gep: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 70,
    width: "23%",
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
    width: "120%",
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
};
