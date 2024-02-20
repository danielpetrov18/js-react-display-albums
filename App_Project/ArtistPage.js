// Importing neccessery components and dependencies.
import React, {useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator, 
    Image, 
    SafeAreaView
} from 'react-native';

// Second page component in the app.
export default function ArtistPage({navigation, route}) { 

    // Getting the user input (artist name) from the Home page using the route prop.
    const {userInput} = route.params

    // Custom defined variables that get set with the useState() hook. Initially having default values.
    const [artistName, setArtistName] = useState('');
    const [albums, setAlbums] = useState([]);
    let [isLoading, setIsLoading] = useState(true);
    let [isArtistFound, setIsArtistFound] = useState(true); 

    // A function used to render all the album components.
    const getAlbums = () => {
        return albums.map((album,index) => {
          return (
            <View style={styles.mainAlbumContainer} key={index}>
                <Text style={styles.title}>{album?.title}</Text>
                <Image 
                    source={{uri: `${album?.imagelink}`}} 
                    style={{width: 300, height: 300, alignSelf: 'center', borderRadius: 10}}    
                />
                <Text style={styles.type}>{album?.type}</Text>
                <Text style={styles.date}>Release date: {album?.date}</Text>
            </View>
          );
        });
    };

    // Getting all the content to be displayed on the page.
    const getContent = () => {
        // If the API call is still being processed an indicator will be displayed. 
        if(isLoading) {
            return <ActivityIndicator size="large"/>
        }

        // A page to be shown if the artist entered is invalid or not found.
        if(!isArtistFound) {
            return (
                <View>
                    <Text style = {styles.notFound}>Artist not found</Text>
                    <Image 
                        source={require('./not_found.png')} 
                        style = {{width:350, height:350, alignItems: 'center'}}
                        placeholder={'An image'}
                    />
                </View>
            );
        }

        // If the API call is already processed and the artist has been found then this information will be displayed.
        return  ( 
            <View>
                <Text style={styles.artist}>{artistName}</Text>
                <TouchableOpacity style = {{alignItems: 'center', marginBottom: 20}}activeOpacity={0.5} onPress={() => navigation.navigate({
                    name: 'Home', 
                    params: { artistName: artistName },
                    merge: true} 
                )}>
                    <Image source = {require("./save.png")} style = {{width: 60, height: 60}} />
                    
                </TouchableOpacity>
                {getAlbums()}
            </View>
        ) ;
      }

    // UseEffect hook to fetch the data from the API.
    useEffect(() => {

        // Defining a method to call.
        const getData = () => {
            try {
                const url1 = 'https://musicbrainz.org/ws/2/artist/?query=' + userInput + '&fmt=json';

                // Creating a chained fetch call.
                fetch(url1, { headers: { 'User-Agent': 'MyApp (random@.com)' }})
                .then(response => response.json())
                .then((data) => {

                    // If artist is not found display not found page.
                    if(data.artists.length == 0) {
                        setIsLoading(false);
                        setIsArtistFound(false);
                        return;
                    }

                    // If artist has been found set values and proceed with 2nd API call (getting the albums).
                    const artistID = data.artists[0].id;
                    const artistName = data.artists[0].name;
                    setArtistName(artistName);

                    const url2 = 'https://musicbrainz.org/ws/2/artist/' + artistID + '?inc=release-groups&fmt=json';
                    return fetch(url2, { headers: { 'User-Agent': 'MyApp (random@.com)' }});
                })
                .then(response2 => response2.json())
                .then(albumsResponse => {

                    // Looping all over the album objects and getting the required data.
                    const length = Object.keys(albumsResponse['release-groups']).length;
                    for(let i = 0; i < length; ++i) {
                        const title = albumsResponse['release-groups'][i]['title'];
                        const date = albumsResponse['release-groups'][i]['first-release-date'];
                        const albumID = albumsResponse['release-groups'][i]['id'];
                        const type = albumsResponse['release-groups'][i]['primary-type'];

                        // Third API call (for every album fetch the corresponding cover image).
                        const url3 = 'https://coverartarchive.org/release-group/' + albumID;                              
                        try {
                            fetch(url3, { headers: { 'User-Agent': 'MyApp (random@.com)' }})
                            .then(response => response.json())
                            .then(data => {
                                const imagelink = data['images'][0]['image']; 
                                setAlbums(albums => ([...albums, {title, date, type, albumID, imagelink}]));
                            });
                        }
                        catch(err) {
                            // You can comment out for debbuging purposes.
                            //console.log(err);
                        }
                    }
                    // Finally after the 3 API calls are processed we finish with the loading.
                    setIsLoading(false);
                })
            }
            catch(err) {
                // You can comment out for debbuging purposes.
                //console.log(err);
            }
        }

        getData(); 

        // Passing this parameter in the dependency array so that everytime the value changes the hook gets executed again.
    }, [userInput]);

    // Returning the JSX component to display the content on the page.
    return (
        <SafeAreaView style={styles.mainContainer}>
            <ScrollView  contentContainerStyle={{ flexGrow: 1 }}> 
                {getContent()}
            </ScrollView>
        </SafeAreaView>
   );
}


// Stylesheets for this page component.
const styles = StyleSheet.create({ 
    mainContainer: {
        flex: 1,
        paddingHorizontal: 25,
        alignItems: 'center',
        backgroundColor: '#e6e6fa'
    },
    artist: {
        fontSize: 25,
        fontWeight: 500,
        textAlign: 'center',
        marginBottom: 10,
        textDecorationLine: 'underline'
    },
    button: {
        backgroundColor: '#99CCFF',
        color: '#000000',
        borderWidth: 2,
        borderRadius: 10,
        marginLeft: 5,
        fontSize: 18,
        padding: 8,
        fontWeight: '500',
        flex: 1, 
        textAlign: 'center',
        marginBottom: 15,
        flexDirection: 'row'
      },
      saveArtist: {
        flexDirection: 'column',
        flex: 0.010,
        padding: 10,
        width: '100%',
        marginBottom: 25
      },
      mainAlbumContainer: {
        marginVertical: 15,
        paddingHorizontal: 10,
        backgroundColor: "#e6e6fa",
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#DBE2E9",
        borderWidth: 2,
        borderRadius: 6
      },
      title: {
        textAlign: 'center',
        fontSize: 18, 
        fontWeight: '600'
      },
      date: {
        fontSize: 12,
        marginLeft: 20
      },
      type: {
        fontSize: 15,
        marginLeft: 20,
        fontWeight: "500"
      },
      notFound: {
        fontWeight: '500',
        fontSize: 25,
        marginVertical: 10,
        marginTop: 20,
        textAlign: 'center',
        marginTop: 50,
        color: 'red'
      }
});