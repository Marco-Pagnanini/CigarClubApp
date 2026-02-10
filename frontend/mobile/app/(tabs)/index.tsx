import { tobacconistApi } from '@/api/api'
import CigarCard from '@/components/CigarCard'
import { Colors, Shadows } from '@/constants/Colors'
import { Cigar } from '@/types/CigarData'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'



const Index = () => {
    const tabBarHeight = useBottomTabBarHeight()
    const [cigars, setCigars] = useState<Cigar[]>([])
    const [filteredCigars, setFilteredCigars] = useState<Cigar[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')


    useEffect(() => {
        getAllCigars()
    }, [])

    useEffect(() => {
        filterCigars()
    }, [searchQuery, cigars])

    const getAllCigars = async () => {
        try {
            setLoading(true)
            const response = await tobacconistApi.get('/')
            setCigars(response.data)
            setFilteredCigars(response.data)
        } catch (error) {
            console.error('Errore nel recupero dei sigari:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterCigars = () => {
        if (searchQuery.trim() === '') {
            setFilteredCigars(cigars)
        } else {
            const filtered = cigars.filter(cigar =>
                cigar.code.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredCigars(filtered)
        }
    }

    const handleCigarPress = (cigar: Cigar) => {
        router.push({
            pathname: '/cigar-detail',
            params: { id: cigar.id }
        })
    }

    const renderItem = useCallback(({ item }: { item: Cigar }) => (
        <CigarCard
            cigar={item}
            onPress={() => handleCigarPress(item)}
        />
    ), [])

    const renderEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>
                {searchQuery ? 'Nessun sigaro trovato' : 'Nessun sigaro disponibile'}
            </Text>
            {searchQuery && (
                <Text style={styles.emptySubtext}>
                    Prova a cercare con un altro codice
                </Text>
            )}
        </View>
    ), [searchQuery])

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Catalogo Sigari</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Caricamento...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header fisso fuori dalla FlatList */}
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Catalogo Sigari</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cerca per codice..."
                        placeholderTextColor={Colors.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <Text
                            style={styles.clearButton}
                            onPress={() => setSearchQuery('')}
                        >
                            ✕
                        </Text>
                    )}
                </View>

                {/* Results Count */}
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        {filteredCigars.length} {filteredCigars.length === 1 ? 'sigaro' : 'sigari'}
                        {searchQuery && ` trovato${filteredCigars.length !== 1 ? 'i' : ''}`}
                    </Text>
                </View>
            </View>

            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={getAllCigars}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />


                }
                data={filteredCigars}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    { paddingBottom: tabBarHeight + 20 }
                ]}

                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent}
                keyboardShouldPersistTaps="handled"
            />
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },

    // Header Section
    headerContainer: {
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 20,
    },

    // Search Bar
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 16,
        ...Shadows.small,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        padding: 0,
    },
    clearButton: {
        fontSize: 18,
        color: Colors.textMuted,
        paddingLeft: 12,
    },

    // Stats
    statsContainer: {
        paddingVertical: 8,
    },
    statsText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },

    // List
    listContent: {
        paddingBottom: 20,
    },

    // Loading
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    loadingText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },

    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyText: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        color: Colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
    },
})
