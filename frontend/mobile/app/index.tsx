import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const { signIn, isLoading: isAuthLoading, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect automatico se già autenticato
    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthLoading, isAuthenticated]);

    if (isAuthLoading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/images/cigar_login_bg.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', '#121212']}
                        style={styles.gradientOverlay}
                    />
                </View>
                <View style={[styles.formContainer, { justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }]}>
                    <ActivityIndicator size="large" color="#D4AF37" />
                    <Text style={[styles.subtitle, { marginTop: 20 }]}>Checking credentials...</Text>
                </View>
            </View>
        );
    }

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Riempire le Credenziali");
            return;
        }

        setLoading(true);

        try {
            await signIn(email, password);
        } catch (err: any) {
            if (err.response?.status !== 400) {
                Alert.alert("Errore Login", "O errore server.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGuestAccess = () => {
        router.replace("/(tabs)")
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Background Image Area */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('@/assets/images/cigar_login_bg.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', '#121212']}
                    style={styles.gradientOverlay}
                />
            </View>

            {/* Login Form Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.formContainer}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>CIGAR CLUB</Text>
                    <Text style={styles.subtitle}>Welcome back, Aficionado</Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            cursorColor="#D4AF37"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#666"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            cursorColor="#D4AF37"
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.guestButton} onPress={handleGuestAccess}>
                        <Text style={styles.guestButtonText}>Accedi come Guest</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => { router.push("/register") }}>
                        <Text style={styles.forgotPasswordText}>Oppure Registrati</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    imageContainer: {
        height: height * 0.45,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 100,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 30,
        paddingTop: 20,
        justifyContent: 'flex-start',
        paddingBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#D4AF37', // Gold color
        textAlign: 'center',
        marginBottom: 5,
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : 'serif', // Elegant font
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    input: {
        height: 50,
        fontSize: 16,
        color: '#E0E0E0',
        paddingHorizontal: 10,
    },
    loginButton: {
        backgroundColor: '#D4AF37',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 20,
        shadowColor: '#D4AF37',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    loginButtonText: {
        color: '#121212',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    guestButton: {
        marginTop: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    guestButtonText: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: 20,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: '#555',
        fontSize: 14,
    },
});
