import { Colors, Shadows } from '@/constants/Colors'
import React, { useState } from 'react'
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Profile = () => {
    // Dati utente mock - sostituisci con dati reali dal tuo context/API
    const [user] = useState({
        name: 'Marco Rossi',
        email: 'marco.rossi@email.com',
        role: 'Membro Premium',
        joinDate: 'Gennaio 2024',
        avatar: 'https://via.placeholder.com/120',
    })

    const handleEditProfile = () => {
        console.log('Edit profile')
    }

    const handleLogout = () => {
        console.log('Logout')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profilo</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: user.avatar }}
                            style={styles.avatar}
                        />
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>⭐</Text>
                        </View>
                    </View>

                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user.role}</Text>
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Supporto</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Text style={styles.menuIcon}>❓</Text>
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Centro Assistenza</Text>
                            <Text style={styles.menuSubtext}>FAQ e guide</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Text style={styles.menuIcon}>📧</Text>
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Contattaci</Text>
                            <Text style={styles.menuSubtext}>Invia un messaggio</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Text style={styles.menuIcon}>⭐</Text>
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuText}>Valuta l'App</Text>
                            <Text style={styles.menuSubtext}>Lascia una recensione</Text>
                        </View>
                        <Text style={styles.menuArrow}>›</Text>
                    </TouchableOpacity>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoText}>Membro dal {user.joinDate}</Text>
                    <Text style={styles.versionText}>Versione 1.0.0</Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutText}>Esci dall'Account</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        paddingBottom: 100, // ✅ Spazio per la tab bar
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
    },

    // Profile Card
    profileCard: {
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadows.medium,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.primary,
    },
    statusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.surface,
    },
    statusText: {
        fontSize: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 12,
    },
    roleBadge: {
        backgroundColor: Colors.backgroundLight,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 20,
    },
    roleText: {
        color: Colors.primary,
        fontSize: 13,
        fontWeight: '600',
    },
    editButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 12,
        ...Shadows.small,
    },
    editButtonText: {
        color: Colors.background,
        fontSize: 15,
        fontWeight: 'bold',
    },

    // Sections
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 12,
    },

    // Menu Items
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuIcon: {
        fontSize: 22,
    },
    menuContent: {
        flex: 1,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 2,
    },
    menuSubtext: {
        fontSize: 13,
        color: Colors.textSecondary,
    },
    menuArrow: {
        fontSize: 28,
        color: Colors.textMuted,
        fontWeight: '300',
    },

    // Info Section
    infoSection: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    infoText: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    versionText: {
        fontSize: 12,
        color: Colors.textMuted,
    },

    // Logout Button
    logoutButton: {
        marginHorizontal: 20,
        marginBottom: 20, // ✅ Margine bottom per distanziare dalla tab bar
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(244, 67, 54, 0.3)',
    },
    logoutText: {
        color: Colors.error,
        fontSize: 16,
        fontWeight: 'bold',
    },
})
