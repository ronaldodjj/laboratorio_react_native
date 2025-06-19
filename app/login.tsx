import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { stylesLogin } from './styles/loginStyles';

export default function LoginScreen() {
    const { login } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('ronaldodjj');
    const [password, setPassword] = useState('12345');

    const handleLogin = async () => {
        const authenticated = await login(username, password);
        if (authenticated) {
            router.replace('/(authenticated)');
        } else {
            Alert.alert('Credenciales incorrectas');
        }
    };

    return (
        <View style={stylesLogin.container}>
            <Text style={stylesLogin.title}>Iniciar Sesión</Text>

            <View style={stylesLogin.inputContainer}>
                <Text style={stylesLogin.label}>Usuario</Text>
                <TextInput
                    placeholder="Ingrese su usuario"
                    style={stylesLogin.input}
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
            </View>

            <View style={stylesLogin.inputContainer}>
                <Text style={stylesLogin.label}>Contraseña</Text>
                <TextInput
                    placeholder="Ingrese su contraseña"
                    secureTextEntry
                    style={stylesLogin.input}
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            <TouchableOpacity style={stylesLogin.button} onPress={handleLogin}>
                <Text style={stylesLogin.buttonText}>Iniciar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}


