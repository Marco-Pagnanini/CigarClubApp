import { Colors, Fonts, Shadows } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
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
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
    const { signIn, isLoading: isAuthLoading, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthLoading, isAuthenticated]);


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

            <View style={styles.imageContainer}>
                <Image
                    source={require('@/assets/images/cigar_login_bg.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    style={styles.gradientOverlay}
                />
            </View>

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
                            placeholderTextColor={Colors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            cursorColor={Colors.primary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor={Colors.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            cursorColor={Colors.primary}
                        />
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>

                        <Text style={styles.loginButtonText}>REGISTER</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword} onPress={() => { router.back() }}>
                        <Text style={styles.forgotPasswordText}>Hai già un account? Accedi</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 5,
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: 1,
    },
    inputContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    input: {
        height: 50,
        fontSize: 16,
        color: Colors.text,
        paddingHorizontal: 10,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 20,
        ...Shadows.gold,
    },
    loginButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    guestButton: {
        marginTop: 20,
        paddingVertical: 15,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        backgroundColor: Colors.gradientStart,
    },
    guestButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
    },
    forgotPassword: {
        marginTop: 20,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: Colors.textDark,
        fontSize: 14,
    },
});
