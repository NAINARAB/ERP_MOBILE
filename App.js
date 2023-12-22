import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import WebViewComp from './src/pages/webviewComp';
import LoginComponent from './src/pages/login';
import HomeComponent from './src/pages/home';
import LoadingScreen from './src/pages/checkLogin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiAddress from './src/api';


const Stack = createStackNavigator();

export default function App() {
  const [login, setLogin] = useState(false)
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(() => {
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('userToken');
        setToken(value);
        if (value !== null) {
          setLogin(true);
        } else {
          setLogin(false);
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };

    getToken();
  }, []);

  const setLoginTrue = () => {
    setLogin(true);
  }

  const logout = async () => {
    try {
      const session = JSON.parse(await AsyncStorage.getItem('loginResponse'));
      const userId = await AsyncStorage.getItem('UserId');
  
      if (!userId || !session || !token) {
        console.error('Missing required data for logout');
        return;
      }
  
      const response = await fetch(`${apiAddress}/api/logout?userid=${userId}&sessionId=${session.SessionId}`, {
        method: 'PUT',
        headers: { 'Authorization': token }
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'Success') {
          AsyncStorage.clear();
          setLogin(false);
        } else {
          console.error('Logout failed:', data.message);
        }
      } else {
        console.error('Failed to logout:', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  



  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { height: 60 } }}>
        {loading
          ? <Stack.Screen name="Loading" component={LoadingScreen} options={{ title: 'ERP APP' }} />
          : login
            ?
            <>
              <Stack.Screen name="Home">
                {(props) => <HomeComponent {...props} setLoginFalse={logout} />}
              </Stack.Screen>
              <Stack.Screen name="WebView" component={WebViewComp} options={{ title: 'SMT APP' }} />
            </>
            :
            <Stack.Screen name="Login">
              {(props) => <LoginComponent {...props} setLoginTrue={setLoginTrue} />}
            </Stack.Screen>
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
