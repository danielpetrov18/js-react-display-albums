// Custom defined components.
import Home from './Home';
import ArtistPage from './ArtistPage';

// Components defined by react. 
import React from 'react';
import { Text } from 'react-native';

// Navigation dependencies.
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Setting up the navigator stack.
const Stack = createNativeStackNavigator();

// App component with a stack consisting of 2 main pages - Home and a page that displays the albums of a given artist/band.
export default function App() {
  return ( 
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={Home}
          options={
            {
              headerStyle: {backgroundColor: '#E0E0E0'},
              headerLeft: () => (
                <Text style = {{ fontWeight: '500', fontSize: 12, marginRight: 60 }}>Daniel Petrov</Text>
              )
            }
          }
        />
        <Stack.Screen name="Albums" component={ArtistPage} options={{ headerStyle: {backgroundColor: '#E0E0E0'} }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}