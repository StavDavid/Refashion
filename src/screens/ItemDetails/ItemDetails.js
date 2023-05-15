import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { Card } from "react-native-elements";
import { auth, db } from "../../../firebase";
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";
const ItemDetails = ({ route }) => {
  const navigation = useNavigation();
  const { Name, Description, Uri, Uid, Email, Phone } = route.params;
  const [showOptions, setShowOptions] = useState(false);
  const [showAdditionalButton, setShowAdditionalButton] = useState(false);
  const handlePurchasePress = () => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to purchase this item?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setShowOptions(true);
            setShowAdditionalButton(true);
          },
        },
      ]
    );
  };

  const updatePurchases = async () => {
    const imageRef = doc(db, `users/${auth.currentUser.uid}`);
    await updateDoc(imageRef, { purchases: arrayUnion(Uid) }, { merge: true });
    navigation.navigate("Purchases");
  };

  const handleOption1Press = () => {
    if (Phone) {
      Linking.openURL(`tel:${Phone}`);
    }
  };

  const handleOption2Press = () => {
    if (Email) {
      Linking.openURL(`mailto:${Email}`);
    }
  };
  const handleAdditionalButtonPress = () => {
    Alert.alert("Confirmation", "Did you coordinate with the seller?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          updatePurchases();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.appButtonContainer}>Item</Text>
      <View style={styles.gallery}>
        <Card containerStyle={styles.cardContainer}>
          <Card.Title style={styles.cardTitle}>Item Details</Card.Title>
          <Card.Image source={{ uri: Uri }} style={styles.image} />
          <Text style={styles.itemName}>{Name}</Text>
          <Text style={styles.cardDescription}>{Description}</Text>
        </Card>
        <TouchableOpacity style={styles.button} onPress={handlePurchasePress}>
          <FontAwesome name="cart-plus" size={24} color="black" />
          <Text>Purchase</Text>
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleOption1Press}
            >
              <Text>{"Contact by phone"}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleOption2Press}
            >
              <Text>Contact by email</Text>
            </TouchableOpacity>
          </View>
        )}
        {showAdditionalButton && (
          <TouchableOpacity
            style={styles.additionalButton}
            onPress={handleAdditionalButtonPress}
          >
            <Text>Confirm Purchase</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.backButtonStyle}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.backTextStyle}>Back to store</Text>
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
    backgroundColor: "white",
    padding: 15,
    gep: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
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
  appButtonContainer1: {
    // elevation: 8,
    marginTop: "2%",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 2,
    width: "100%",
    // borderRadius: 100,
    // borderBottomRightRadius: 6,
    fontSize: 18,
    color: "black",
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
    marginVertical: 5,
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
  cardContainer: {
    margin: 5,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: "white",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    width: "45%",
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  additionalButton: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 60,
    borderRadius: 8,
    width: "40%",
    height: 40,
    elevation: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
});

export default ItemDetails;
