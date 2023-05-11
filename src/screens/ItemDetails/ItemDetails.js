import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Card } from "react-native-elements";

const ItemDetails = ({ route }) => {
  const { Name, Description, Uri, Uid, Email, Phone } = route.params;
  const [showOptions, setShowOptions] = useState(false);

  const handlePurchasePress = () => {
    setShowOptions(true);
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
    backgroundColor: "#FF597B",
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
});

export default ItemDetails;
