import { Colors, Fonts } from '@/constants/Colors'
import { router } from 'expo-router'
import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const LoginBottom = () => {
    return (
        <View style={styles.container}>
            <View style={styles.handle} />

            <Text style={styles.title}>CIGAR CLUB</Text>
            <Text style={styles.subtitle}>Accedi per continuare</Text>

            <TouchableOpacity style={styles.loginButton} onPress={() => {
                router.dismiss()
                router.replace('/')
            }} activeOpacity={0.8}>
                <Text style={styles.loginButtonText}>ACCEDI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={() => {
                router.dismiss()
                router.replace('/register')
            }
            } activeOpacity={0.8}>
                <Text style={styles.registerButtonText}>REGISTRATI</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoginBottom

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 30,
        paddingTop: 16,
        paddingBottom: 40,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
        letterSpacing: 2,
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 32,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    loginButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 15,
        borderRadius: 8,
        marginBottom: 12,
    },
    loginButtonText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    registerButton: {
        paddingVertical: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    registerButtonText: {
        color: Colors.textSecondary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
})
