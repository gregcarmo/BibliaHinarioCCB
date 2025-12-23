// App.js
import React, { useState } from "react";
import { NavigationContainer, DarkTheme, DefaultTheme, useTheme } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, StatusBar, TextInput, useColorScheme } from "react-native";
import { bookContent } from "./bookContent";
import { hinoContent } from "./hinoContent";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

// Home Screen Component (Book Selection)
const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleBookPress = (bookId) => {
    navigation.navigate("ChapterSelection", { bookId });
    setSearchQuery(""); // Clear the search
  };

  const filteredBooks = Object.keys(bookContent).filter((bookId) => normalizeString(bookContent[bookId].title.toLowerCase()).includes(normalizeString(searchQuery.toLowerCase())));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <TextInput style={[styles.searchBar, { color: colors.text, backgroundColor: colorScheme === "dark" ? "#333" : "#eee", borderColor: "#4A90E2" }]} placeholder="Pesquisar" placeholderTextColor="#888" value={searchQuery} onChangeText={setSearchQuery} />
      <ScrollView contentContainerStyle={[styles.buttonContainer, { backgroundColor: colors.background }]} keyboardShouldPersistTaps={"handled"}>
        {/* Left Column */}
        <View style={styles.column}>
          <Text style={[styles.contentTitle, { color: colors.text }]}>Antigo{"\n"}Testamento</Text>
          {filteredBooks
            .filter((bookId) => bookId <= 39)
            .map((bookId) => (
              <TouchableOpacity key={bookId} style={styles.button} onPress={() => handleBookPress(bookId)}>
                <Text style={styles.buttonText}>{bookContent[bookId].title}</Text>
              </TouchableOpacity>
            ))}
        </View>

        {/* Right Column */}
        <View style={styles.column}>
          <Text style={[styles.contentTitle, { color: colors.text }]}>Novo{"\n"}Testamento</Text>
          {filteredBooks
            .filter((bookId) => bookId > 39)
            .map((bookId) => (
              <TouchableOpacity key={bookId} style={styles.button} onPress={() => handleBookPress(bookId)}>
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
  const { colors } = useTheme();
  const { bookId } = route.params;
  const book = bookContent[bookId];

  // Get the list of chapter IDs for the book
  const chapterIds = Object.keys(book.chapters).map((id) => parseInt(id));

  // Create arrays for four columns
  const column1Chapters = chapterIds.filter((_, index) => index % 4 === 0);
  const column2Chapters = chapterIds.filter((_, index) => index % 4 === 1);
  const column3Chapters = chapterIds.filter((_, index) => index % 4 === 2);
  const column4Chapters = chapterIds.filter((_, index) => index % 4 === 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.bookTitle, { color: colors.text }]}>Capítulos</Text>
      <ScrollView contentContainerStyle={[styles.buttonContainer, { backgroundColor: colors.background }]}>
        {/* Column 1 */}
        <View style={styles.columnSmall}>
          {column1Chapters.map((chapterId) => (
            <TouchableOpacity key={chapterId} style={styles.button} onPress={() => navigation.navigate("BookContent", { bookId, chapterId })}>
              <Text style={styles.buttonText}>{book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Column 2 */}
        <View style={styles.columnSmall}>
          {column2Chapters.map((chapterId) => (
            <TouchableOpacity key={chapterId} style={styles.button} onPress={() => navigation.navigate("BookContent", { bookId, chapterId })}>
              <Text style={styles.buttonText}>{book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Column 3 */}
        <View style={styles.columnSmall}>
          {column3Chapters.map((chapterId) => (
            <TouchableOpacity key={chapterId} style={styles.button} onPress={() => navigation.navigate("BookContent", { bookId, chapterId })}>
              <Text style={styles.buttonText}>{book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Column 4 */}
        <View style={styles.columnSmall}>
          {column4Chapters.map((chapterId) => (
            <TouchableOpacity key={chapterId} style={styles.button} onPress={() => navigation.navigate("BookContent", { bookId, chapterId })}>
              <Text style={styles.buttonText}>{book.chapters[chapterId]?.title || `Capítulo ${chapterId}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Book Content Screen Component
const BookContentScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { bookId, chapterId } = route.params;
  const chapter = bookContent[bookId].chapters[chapterId];
  const chapterIds = Object.keys(bookContent[bookId].chapters).map((id) => parseInt(id));
  const currentChapterIndex = chapterIds.indexOf(chapterId);
  const isLastChapter = currentChapterIndex === chapterIds.length - 1;

  const handleNextChapter = () => {
    if (!isLastChapter) {
      const nextChapterId = chapterIds[currentChapterIndex + 1];
      navigation.replace("BookContent", { bookId, chapterId: nextChapterId });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.contentText, { color: colors.text }]}>
        {chapter.content.split("\n").map((line, index) => {
          const trimmedLine = line.trim();
          // Check if the line starts with a number - passage titles don't start with numbers
          const isVerse = /^\d/.test(trimmedLine);

          return (
            <Text key={index} style={!isVerse && trimmedLine.length > 0 ? { fontStyle: "italic", fontWeight: "bold" } : {}}>
              {line}
              {"\n"}
            </Text>
          );
        })}
      </Text>
      {!isLastChapter && (
        <TouchableOpacity style={styles.button} onPress={handleNextChapter}>
          <Text style={styles.buttonText}>Próximo capítulo</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

// Home screen for Hinario
const HinarioScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleHinoPress = (hinoId) => {
    navigation.navigate("HinoContent", { hinoId });
    setSearchQuery(""); // Clear the search
  };

  const filteredHinos = Object.keys(hinoContent).filter((hinoId) => normalizeString(hinoContent[hinoId].title.toLowerCase()).includes(normalizeString(searchQuery.toLowerCase())));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="#4A90E2" />
      <TextInput style={[styles.searchBar, { color: colors.text, backgroundColor: colorScheme === "dark" ? "#333" : "#eee", borderColor: "#4A90E2" }]} placeholder="Pesquisar" placeholderTextColor="#888" value={searchQuery} onChangeText={setSearchQuery} />
      <ScrollView contentContainerStyle={[styles.buttonContainer, { backgroundColor: colors.background }]} keyboardShouldPersistTaps={"handled"}>
        {/* Only Column */}
        <View style={styles.columnBig}>
          {filteredHinos.map((hinoId) => (
            <TouchableOpacity key={hinoId} style={styles.button} onPress={() => handleHinoPress(hinoId)}>
              <Text style={styles.buttonText}>{hinoContent[hinoId].title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Hino Content Screen Component
const HinoContentScreen = ({ route }) => {
  const { colors } = useTheme();
  const { hinoId } = route.params;
  const hino = hinoContent[hinoId];

  return (
    <ScrollView contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.background }]}>
      <Text style={[styles.contentText, { color: colors.text }]}>
        {hino.content.split("\n").map((line, index) => (
          <Text key={index} style={line.startsWith("    ") ? { fontWeight: "bold" } : {}}>
            {line}
            {"\n"}
          </Text>
        ))}
      </Text>
    </ScrollView>
  );
};

// Wrap existing Stack navigator in a new component
const BibliaStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Bíblia CCB - Livros",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
        }}
      />
      <Stack.Screen
        name="ChapterSelection"
        component={ChapterSelectionScreen}
        options={({ route }) => ({
          title: bookContent[route.params.bookId].title,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
        })}
      />
      <Stack.Screen
        name="BookContent"
        options={({ route }) => ({
          title: `Capítulo ${route.params.chapterId}`,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
        })}
      >
        {(props) => <BookContentScreen {...props} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const HinarioStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HinarioHome"
        component={HinarioScreen}
        options={{
          title: "Hinário CCB",
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
        }}
      />
      <Stack.Screen
        name="HinoContent"
        component={HinoContentScreen}
        options={({ route }) => ({
          title: hinoContent[route.params.hinoId].title,
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#4A90E2",
          },
        })}
      />
    </Stack.Navigator>
  );
};

const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffffff",
    text: "#000",
    card: "#4A90E2",
    primary: "#4A90E2",
    border: "#ccc",
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#191919",
    text: "#fff",
    card: "#4A90E2",
    primary: "#4A90E2",
    border: "#333",
  },
};

// Main App Component
const App = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? MyDarkTheme : MyLightTheme;

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        tabBarPosition="bottom"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
          tabBarActiveTintColor: "#4A90E2",
          tabBarInactiveTintColor: "#888",
          tabBarIndicatorStyle: {
            backgroundColor: "#4A90E2",
            position: "top",
          },
          tabBarLabelStyle: {
            textTransform: "none", // Prevents uppercase transformation
            fontSize: 14,
          },
        }}
      >
        <Tab.Screen
          name="Biblia"
          component={BibliaStack}
          options={{
            tabBarLabel: "Bíblia",
          }}
        />
        <Tab.Screen
          name="Hinario"
          component={HinarioStack}
          options={{
            tabBarLabel: "Hinário",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#191919",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#191919",
  },
  column: {
    width: "45%",
  },
  columnSmall: {
    width: "22%",
  },
  columnBig: {
    width: "90%",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chapterContainer: {
    width: "80%",
    marginTop: 20,
  },
  chapterButton: {
    backgroundColor: "#4A90E2",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "#191919",
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    color: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "#4A90E2",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 25,
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "#333",
  },
});

export default App;
