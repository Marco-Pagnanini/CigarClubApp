import { tobacconistApi } from '@/api/api'
import CigarCard from '@/components/CigarCard'
import { Colors, Fonts, Shadows } from '@/constants/Colors'
import { useAuth } from '@/context/AuthContext'
import { Cigar } from '@/types/CigarData'
import { Ionicons } from '@expo/vector-icons'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native'

type HomeListHeaderProps = {
    greetingName: string
    catalogCount: number
    filteredCount: number
    searchQuery: string
    onSearchChange: (q: string) => void
    onScan: () => void
}

function HomeListHeader({
    greetingName,
    catalogCount,
    filteredCount,
    searchQuery,
    onSearchChange,
    onScan,
}: HomeListHeaderProps) {
    return (
        <View style={styles.headerBlock}>
            <View style={styles.topRow}>
                <View style={styles.titleBlock}>
                    <Text style={styles.eyebrow}>CIGAR CLUB</Text>
                    <Text style={styles.greeting}>Ciao, {greetingName}</Text>
                    <Text style={styles.catalogSubline}>
                        {catalogCount} {catalogCount === 1 ? 'sigaro' : 'sigari'} nel catalogo
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.iconGhost}
                    onPress={onScan}
                    activeOpacity={0.75}
                    accessibilityLabel="Apri scanner"
                >
                    <Ionicons name="qr-code-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchWrap}>
                <Ionicons name="search" size={20} color={Colors.textMuted} style={styles.searchLeading} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cerca per codice..."
                    placeholderTextColor={Colors.textMuted}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchQuery.length > 0 ? (
                    <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={12}>
                        <Ionicons name="close-circle" size={22} color={Colors.textSecondary} />
                    </TouchableOpacity>
                ) : null}
            </View>

            <View style={styles.listSectionRow}>
                <Text style={styles.listSectionTitle}>Tutti i sigari</Text>
                <View style={styles.countChip}>
                    <Text style={styles.countChipText}>{filteredCount}</Text>
                </View>
            </View>
        </View>
    )
}

const Index = () => {
    const tabBarHeight = useBottomTabBarHeight()
    const { user } = useAuth()
    const [cigars, setCigars] = useState<Cigar[]>([])
    const [filteredCigars, setFilteredCigars] = useState<Cigar[]>([])
    const [initialLoading, setInitialLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const greetingName = useMemo(() => {
        if (!user?.email) return 'Aficionado'
        const local = user.email.split('@')[0]
        return local.charAt(0).toUpperCase() + local.slice(1)
    }, [user?.email])

    useEffect(() => {
        loadCigars()
    }, [])

    useEffect(() => {
        filterCigars()
    }, [searchQuery, cigars])

    const loadCigars = async () => {
        try {
            const response = await tobacconistApi.get('/')
            setCigars(response.data)
            setFilteredCigars(response.data)
        } catch (error) {
            console.error('Errore nel recupero dei sigari:', error)
        } finally {
            setInitialLoading(false)
        }
    }

    const onRefresh = async () => {
        setRefreshing(true)
        try {
            const response = await tobacconistApi.get('/')
            setCigars(response.data)
            setFilteredCigars(response.data)
        } catch (error) {
            console.error('Errore nel recupero dei sigari:', error)
        } finally {
            setRefreshing(false)
        }
    }

    const handleScanPress = () => {
        router.push('/scan')
    }

    const filterCigars = () => {
        if (searchQuery.trim() === '') {
            setFilteredCigars(cigars)
        } else {
            const filtered = cigars.filter((cigar) =>
                cigar.code.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredCigars(filtered)
        }
    }

    const handleCigarPress = (cigar: Cigar) => {
        router.push({
            pathname: '/cigar-detail',
            params: { id: cigar.id },
        })
    }

    const renderItem = useCallback(
        ({ item }: { item: Cigar }) => (
            <CigarCard cigar={item} onPress={() => handleCigarPress(item)} />
        ),
        []
    )

    const renderEmptyComponent = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrap}>
                    <Ionicons name="search-outline" size={36} color={Colors.primary} />
                </View>
                <Text style={styles.emptyText}>
                    {searchQuery ? 'Nessun sigaro trovato' : 'Nessun sigaro disponibile'}
                </Text>
                {searchQuery ? (
                    <Text style={styles.emptySubtext}>Prova con un altro codice</Text>
                ) : null}
            </View>
        ),
        [searchQuery]
    )

    if (initialLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Caricamento catalogo…</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={filteredCigars}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <HomeListHeader
                        greetingName={greetingName}
                        catalogCount={cigars.length}
                        filteredCount={filteredCigars.length}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onScan={handleScanPress}
                    />
                }
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />
                }
                contentContainerStyle={[styles.listContent, { paddingBottom: tabBarHeight + 24 }]}
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
    headerBlock: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 8,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    titleBlock: {
        flex: 1,
        paddingRight: 12,
    },
    eyebrow: {
        fontSize: 11,
        letterSpacing: 2,
        color: Colors.textSecondary,
        marginBottom: 6,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '600',
        color: Colors.text,
        letterSpacing: 0.3,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    catalogSubline: {
        marginTop: 6,
        fontSize: 13,
        color: Colors.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    iconGhost: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 22,
        ...Shadows.small,
    },
    searchLeading: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
        padding: 0,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    listSectionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    listSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        letterSpacing: 0.2,
    },
    countChip: {
        backgroundColor: Colors.tabActiveBackground,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.35)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
    },
    countChipText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
        fontVariant: ['tabular-nums'],
    },
    listContent: {
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.textSecondary,
        fontSize: 15,
        marginTop: 16,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 48,
        paddingHorizontal: 32,
    },
    emptyIconWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        color: Colors.text,
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    emptySubtext: {
        color: Colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
})
