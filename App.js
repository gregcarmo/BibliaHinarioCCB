// App.js
import React, { useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, StatusBar, TextInput } from 'react-native';
import { bookContent } from './bookContent';


const Stack = createNativeStackNavigator();

// Home Screen Component (Book Selection)
const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  const handleBookPress = (bookId) => {
    navigation.navigate('ChapterSelection', { bookId });
    setSearchQuery(''); // Clear the search
  };

  const filteredBooks = Object.keys(bookContent).filter(bookId => 
    normalizeString(bookContent[bookId].title.toLowerCase()).includes(normalizeString(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <TextInput
        style={styles.searchBar}
        placeholder="Pesquisar"
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView contentContainerStyle={styles.buttonContainer} keyboardShouldPersistTaps={'handled'}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={styles.contentTitle}>Antigo Testamento</Text>
          {filteredBooks.filter(bookId => bookId <= 39).map(bookId => (
            <TouchableOpacity 
              key={bookId}
              style={styles.button}
              onPress={() => handleBookPress(bookId)}
            >
              <Text style={styles.buttonText}>{bookContent[bookId].title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={styles.contentTitle}>Novo Testamento</Text>
          {filteredBooks.filter(bookId => bookId > 39).map(bookId => (
            <TouchableOpacity 
              key={bookId}
              style={styles.button}
              onPress={() => handleBookPress(bookId)}
            >
              <Text style={styles.buttonText}>{bookContent[bookId].title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Chapter Selection Screen
const ChapterSelectionScreen = ({ navigation, route }) => {
  const { bookId } = route.params;
  const book = bookContent[bookId];
  
  // Get the list of chapter IDs for the book
  const chapterIds = Object.keys(book.chapters).map(id => parseInt(id));

  // Create arrays for four columns
  const column1Chapters = chapterIds.filter((_, index) => index % 4 === 0);
  const column2Chapters = chapterIds.filter((_, index) => index % 4 === 1);
  const column3Chapters = chapterIds.filter((_, index) => index % 4 === 2);
  const column4Chapters = chapterIds.filter((_, index) => index % 4 === 3);

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>Capítulos</Text>
      <ScrollView contentContainerStyle={styles.buttonContainer}>
        {/* Column 1 */}
        <View style={styles.columnSmall}>
          {column1Chapters.map(chapterId => (
            <TouchableOpacity 
              key={chapterId}
              style={styles.button}
              onPress={() => navigation.navigate('BookContent', { bookId, chapterId })}
            >
              <Text style={styles.buttonText}>
                {book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Column 2 */}
        <View style={styles.columnSmall}>
          {column2Chapters.map(chapterId => (
            <TouchableOpacity 
              key={chapterId}
              style={styles.button}
              onPress={() => navigation.navigate('BookContent', { bookId, chapterId })}
            >
              <Text style={styles.buttonText}>
                {book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Column 3 */}
        <View style={styles.columnSmall}>
          {column3Chapters.map(chapterId => (
            <TouchableOpacity 
              key={chapterId}
              style={styles.button}
              onPress={() => navigation.navigate('BookContent', { bookId, chapterId })}
            >
              <Text style={styles.buttonText}>
                {book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Column 4 */}
        <View style={styles.columnSmall}>
          {column4Chapters.map(chapterId => (
            <TouchableOpacity 
              key={chapterId}
              style={styles.button}
              onPress={() => navigation.navigate('BookContent', { bookId, chapterId })}
            >
              <Text style={styles.buttonText}>
                {book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Book Content Screen Component
const BookContentScreen = ({ route }) => {
  const { bookId, chapterId } = route.params;
  const chapter = bookContent[bookId].chapters[chapterId];
  
  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={styles.contentText}>{chapter.content}</Text>
    </ScrollView>
  );
};

// Main App Component
const App = () => {
  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Bíblia CCB - Livros',
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
          }}
        />
        <Stack.Screen 
          name="ChapterSelection" 
          component={ChapterSelectionScreen}
          options={({ route }) => ({ 
            title: bookContent[route.params.bookId].title,
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#4A90E2',
            }, 
          })}
        />
        <Stack.Screen 
          name="BookContent" 
          component={BookContentScreen}
          options={({ route }) => ({ 
            title: `Capítulo ${route.params.chapterId}`,
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
              backgroundColor: '#4A90E2',
            }, 
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#191919',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    backgroundColor: '#191919',
  },
  column: {
    width: '45%',
  },
  columnSmall: {
    width: '22%',
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chapterContainer: {
    width: '80%',
    marginTop: 20,
  },
  chapterButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#191919',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
    color: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#4A90E2',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 25,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: '#333',
  },
});

export default App;