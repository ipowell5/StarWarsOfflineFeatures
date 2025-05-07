import React, { useEffect, useState } from 'react';
import filmsHeader from '../assets/films-header.png';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import TwinklingStar from '../components/TwinklingStar';

export default function FilmsScreen() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFilms = films.filter(film =>
    film.properties.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetch("https://www.swapi.tech/api/films/")
      .then(res => res.json())
      .then(data => {
        setFilms(data.result);
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <View style={styles.container}>
      <TwinklingStar style={{ top: 40, left: 20 }} size={80} />
      <TwinklingStar style={{ top: 120, right: 50 }} size={70} />
      <TwinklingStar style={{ bottom: 90, left: 60 }} size={90} />
      <TwinklingStar style={{ bottom: 40, right: 30 }} size={75} />
      <Image source={filmsHeader} style={styles.headerImage} />

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search films..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      <Text style={styles.title}>Star Wars Films</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredFilms}
          keyExtractor={item => item.uid}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={() => (
                <View style={styles.swipeAction}>
                  <Text style={styles.swipeText}>👈 Swipe Detected!</Text>
                </View>
              )}
            >
              <Text style={styles.item}>{item.properties.title}</Text>
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
    backgroundColor: '#0b3d91',
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
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#A0F0ED',
    textAlign: 'center'
  },
  item: {
    fontSize: 18,
    marginBottom: 10,
    backgroundColor: '#fff',
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
