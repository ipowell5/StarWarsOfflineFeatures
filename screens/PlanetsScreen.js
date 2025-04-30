
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import TwinklingStar from '../components/TwinklingStar';
import { Image } from 'react-native';
import headerImage from '../assets/header.png';


export default function PlanetsScreen() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [swipedItem, setSwipedItem] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    checkConnectionAndFetch();

    return () => unsubscribe();
  }, []);

  const checkConnectionAndFetch = async () => {
    const netState = await NetInfo.fetch();
    if (netState.isConnected) {
      fetch("https://www.swapi.tech/api/planets/")
        .then(res => res.json())
        .then(data => {
          setPlanets(data.results);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Error", "Failed to fetch data.");
          setLoading(false);
        });
    } else {
      Alert.alert("No Internet", "You are offline. Please check your network connection.");
      setLoading(false);
    }
  };

  const filteredPlanets = planets.filter(planet =>
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TwinklingStar />
      <Image source={headerImage} style={styles.headerImage} />


      {!isConnected && (
        <Text style={styles.offlineText}>You are currently offline</Text>
      )}

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search planets..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
        <Button title="Search" onPress={() => setModalVisible(true)} />
      </View>

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

      <Text style={styles.title}>Star Wars Planets</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredPlanets}
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
  container: {
    flex: 1,
    backgroundColor: '#000', 
    padding: 10
  },
  offlineText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: 'bold'
  },
  headerImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
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
    color: '#fff',
    textAlign: 'center',
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    color: '#000',
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
