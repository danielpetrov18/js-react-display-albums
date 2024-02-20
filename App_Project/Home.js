// Importing needed components and hooks from react.
import React, {useState, useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    TextInput, 
    View, 
    TouchableOpacity,
    SafeAreaView, 
    ScrollView, 
    Image
  }  from 'react-native';

// Home page with navigation and route used to navigate to the other page and pass parameters.
export default function Home({navigation, route}) {

  // Custom defined variables that get set with the useState() hook.
  const [userInput, setInput] = useState("");
  const [favArtists, setFavArtists] = useState([]);

  /*  
    Checking to see if an artist parameter has been passed from the other page.
    If thats the case the addNewArtist method is called and the artist is saved in the array of artists.
    Using (route.params?.artistName) as a dependency and calling useEffect only when the value is updated.
  */
  useEffect(() => {
    if(route.params) {
      addNewArtist(route.params.artistName);
    }
  }, [route.params?.artistName]);

  /*
    Validating the value entered in the text input field by the user. 
    If the value is an empty string an alert with a corresponding message will be displayed.
  */
  const validateUserInput = () => {
    if (!userInput.trim()) {
      alert('Field cannot be empty! Please enter a name!');
    }
  };

  /*
    First checking to see if the artist already exists in the list of favourite artists.
    If so the last if statement in the method gets ommited.
    If not in the list the if statement gets executed and the artist is added to the list.
  */
  const addNewArtist = (element) => {
      let shouldAdd = true;
      for(let i = 0; i < favArtists.length; ++i) {
        if(favArtists[i] === element) {
          shouldAdd = false;
          break;
        }
      }

      if(shouldAdd) {
        setFavArtists(setFavArtists => ([...setFavArtists, element]));
      }
  }
  
  /* 
    Method that displays the list of favourite artists.
    Corresponding content gets displayed depending on if the list is empty or not.
  */
  const displayArtists = () => {
    if(favArtists.length !== 0) {
      return favArtists.map((artist,index) => {
        return (
          <View key={index} style={styles.artistContainer}>
              <Text style={styles.addedArtist}>{artist}</Text>
              <Image source={require('./5aa78e207603fc558cffbf19.png')} style={{width:28, height: 28, }}/>
          </View>
        );
      });
    }
    else {
      return (
        <View style={styles.noFavArtist}>
          <Text style={{textAlign: "center", fontSize: 18, fontWeight: '500'}}>No favourite artists currently!</Text>
          <Image source={require('./red_cross.jpg')} style={{width:28, height: 28, }}/>
        </View>
      );
    }
  }

  // Main JSX component that gets rendered everytime the page is displayed.
  return (
    <SafeAreaView style={styles.container}>
     <ScrollView>
      {/* Label prompting the user to enter an artist. */}
        <View>  
            <Text style={styles.label}>Please enter an artist name</Text>
        </View>

        {/* 
          Input field with corresponding button component 
          that redirects the user when clicked and a valid parameter is entered. 
        */}
        <View style = {styles.input}>
            <TextInput placeholder='Enter an artist' style={styles.inputField} onChangeText={input => setInput(input)} />
            <TouchableOpacity activeOpacity={0.5} 
                onPress={() => !userInput ? validateUserInput() : navigation.navigate('Albums', {userInput: userInput})}>
              <Text style={styles.button}>Show Albums</Text>
            </TouchableOpacity>
        </View>


        {/* Label. */}
        <View>
          <Text style={styles.label2}>Favourite Artists</Text>
        </View>

        {/* List of favourite artists. */}
        <View>
          {displayArtists()}
        </View>

     </ScrollView>
    </SafeAreaView>
  );
}

// All global styles in the Home-component.
const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 12,
    flexDirection: 'column',
    backgroundColor: '#e6e6fa'
  },
  info: {
      padding: 8,
      marginTop: -5,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      flex: .4
  },  
  infoText: {
    fontSize: 15,
    fontWeight: '400'
  },
  label: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5
  },
  input: {
    marginTop: 5,
    marginBottom: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    flex: 1
  }, 
  inputField: {
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    padding: 5,
    fontSize: 18,
    fontWeight: '400'
  },
  button: {
    backgroundColor: '#99CCFF',
    color: '#000000',
    borderWidth: 2,
    borderRadius: 10,
    marginLeft: 5,
    fontSize: 18,
    padding: 6,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center'
  },
  label2: {
    fontWeight: '600',
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 15
  },
  addedArtist: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 18
  },
  artistContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'#CCFFCC',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000000',
    padding: 2,
    alignItems: 'center',
    marginBottom: 5
  },
  noFavArtist: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 2,
    justifyContent: 'space-between'
  }
});