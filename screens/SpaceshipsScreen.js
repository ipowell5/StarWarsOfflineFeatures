import React, { useEffect, useState } from 'react';
import spaceshipsHeader from '../assets/spaceships-header.png';


import {
  View,
  Text,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';


import { Swipeable } from 'react-native-gesture-handler';
import TwinklingStar from '../components/TwinklingStar';   // Add the stars!

export default function SpaceshipsScreen() {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [swipedItem, setSwipedItem] = useState('');

  useEffect(() => {
    fetch("https://www.swapi.tech/api/starships/")
      .then(res => res.json())
      .then(data => {
        setShips(data.results);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      {/* Stars */}
      <TwinklingStar style={{ top: 40, left: 20 }} size={80} />
      <TwinklingStar style={{ top: 120, right: 50 }} size={70} />
      <TwinklingStar style={{ bottom: 90, left: 60 }} size={90} />
      <TwinklingStar style={{ bottom: 40, right: 30 }} size={75} />
      <Image source={spaceshipsHeader} style={styles.headerImage} />


      {/* Search Section */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search ships..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        <Button title="Search" onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {swipedItem ? (
            <Text style={styles.modalText}>You swiped: {swipedItem}</Text>
          ) : (
            <Text style={styles.modalText}>You searched for: {searchTerm}</Text>
          )}
          <Button title="Close" onPress={() => {
            setModalVisible(false);
            setSwipedItem('');
          }} />
        </View>
      </Modal>

      <Text style={styles.title}>Star Wars Spaceships</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={ships}
          keyExtractor={item => item.uid}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <View style={styles.swipeAction}>
                  <Text style={styles.swipeText}>👈 Swipe Detected!</Text>
                </View>
              )}
              onSwipeableOpen={() => {
                setSwipedItem(item.name);
                setModalVisible(true);
              }}
            >
              <Text style={styles.item}>{item.name}</Text>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#4b0082',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
    marginRight: 10,
  },
  modalView: {
    margin: 20,
    padding: 35,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#A0F0ED'
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#fff',   // White block around text
    padding: 10,
    borderRadius: 5,
  },
  swipeAction: {
    backgroundColor: '#add8e6',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  swipeText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
