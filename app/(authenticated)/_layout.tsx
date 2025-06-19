import { useAuth } from '@/hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons'; // Asegúrate de tener esta librería instalada
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import HomeScreen from '.';
import ApiScreen from './apiExample';
import Crud from './crud';

const Drawer = createDrawerNavigator();

export default function DrawerLayout() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <SafeAreaView style={{ flex: 1 }}>
          <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
            {/* Header personalizado */}
            <View style={styles.header}>
              <MaterialIcons name="account-circle" size={60} color="#555" />
              <Text style={styles.username}>Bienvenido</Text>
              <Text style={styles.subtext}>ronaldodjj</Text>
            </View>

            {/* Lista de pantallas */}
            <DrawerItemList {...props} />

            {/* Separador */}
            <View style={styles.separator} />

            {/* Botón de salir */}
            <DrawerItem
              label="Salir"
              onPress={handleLogout}
              labelStyle={styles.logoutLabel}
              icon={({ color, size }) => (
                <MaterialIcons name="logout" size={size} color={color} />
              )}
            />
          </DrawerContentScrollView>
        </SafeAreaView>
      )}
      screenOptions={{
        headerShown: true,
        drawerType:
          Platform.OS === 'web'
            ? isLargeScreen
              ? 'permanent'
              : 'front'
            : 'front',
        drawerStyle: {
          width: 260,
        },
        drawerActiveTintColor: '#007aff',
        drawerLabelStyle: {
          fontSize: 16,
        },
      }}
    >
      <Drawer.Screen
        name="home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="crud"
        component={Crud}
        options={{
          title: 'Crud',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="edit-document" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="api"
        component={ApiScreen}
        options={{
          title: 'Consumo api',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="data-object" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 8,
  },
  username: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 14,
    color: '#888',
  },
  separator: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logoutLabel: {
    color: 'red',
    fontWeight: 'bold',
  },
});
