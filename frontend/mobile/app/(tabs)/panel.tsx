import { panelApi } from '@/api/api'
import { PanelCard } from '@/components/PanelCard'
import { Colors, Fonts, Shadows } from '@/constants/Colors'
import { Panel } from '@/types/PanelData'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Platform, RefreshControl, SafeAreaView, StyleSheet, Text, View } from 'react-native'


const PanelPage = () => {
    const [panels, setPanels] = useState<Panel[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const currentPage = useRef(1)
    const isLoadingMore = useRef(false)

    useFocusEffect(
        useCallback(() => {
            fetchPanels(1, true)
        }, [])
    )

    const fetchPanels = async (pageNumber: number, isReset: boolean = false) => {
        if (!isReset) {
            if (isLoadingMore.current) return
            if (!hasMore) return
        }

        try {
            isLoadingMore.current = true

            if (isReset) {
                if (!refreshing) setLoading(true)
                currentPage.current = 0
                setHasMore(true)
            }

            const response = await panelApi.get('/')
            const newPanels = response.data

            if (!newPanels || newPanels.length === 0) {
                setHasMore(false)
                if (isReset) setPanels([])
                return
            }

            if (isReset) {
                setPanels(newPanels)
                currentPage.current = 1
            } else {
                setPanels(prev => {
                    const existingIds = new Set(prev.map(p => p.id))
                    const uniqueNew = newPanels.filter((p: Panel) => !existingIds.has(p.id))
                    return [...prev, ...uniqueNew]
                })
                currentPage.current = pageNumber
            }

        } catch (error) {
            console.error(error)
            setHasMore(false)
        } finally {
            setLoading(false)
            setRefreshing(false)
            isLoadingMore.current = false
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchPanels(1, true)
    }, [])

    const loadMore = () => {
        if (isLoadingMore.current || !hasMore || loading) return
        fetchPanels(currentPage.current + 1, false)
    }

    const renderItem = useCallback(({ item }: { item: Panel }) => (
        <PanelCard panel={item} />
    ), [])

    const renderEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cigar-off" size={50} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nessun sigaro trovato</Text>
        </View>
    ), [])

    const renderFooter = () => {
        if (!isLoadingMore.current || !hasMore || panels.length === 0) return <View style={{ height: 20 }} />
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        )
    }

    if (loading && !refreshing && panels.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary} style={styles.centerLoader} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Cigar Panel</Text>
                </View>
                <Text style={styles.statsText}>
                    {panels.length} {panels.length === 1 ? 'scheda' : 'schede'}
                </Text>
            </View>

            <FlatList
                data={panels}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyComponent}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                    />
                }
            />
        </SafeAreaView>
    )
}

export default PanelPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    headerContainer: {
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        letterSpacing: 2,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    statsText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    listContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'column',
        backgroundColor: Colors.surface,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    imageHeader: {
        height: 140,
        backgroundColor: '#161616',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        position: 'relative',
    },
    cigarImage: {
        width: '90%',
        height: '80%',
        transform: [{ rotate: '-90deg' }],
    },
    priceTag: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.primaryDark,
    },
    priceText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    infoBody: {
        padding: 16,
    },
    headerSection: {
        marginBottom: 12,
    },
    brandName: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    cigarName: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        lineHeight: 24,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 12,
        opacity: 0.5,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    gridItem: {
        flex: 1,
    },
    labelSmall: {
        color: Colors.textSecondary,
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    valueSmall: {
        color: Colors.text,
        fontSize: 12,
        fontWeight: '500',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    footerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 6,
    },
    strengthWrapper: {
        justifyContent: 'center',
    },
    strengthDotsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    scoreWrapper: {
        alignItems: 'flex-end',
    },
    scoreLabel: {
        color: Colors.textSecondary,
        fontSize: 9,
        textTransform: 'uppercase',
        marginBottom: 0,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    scoreValue: {
        color: Colors.primary,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    centerLoader: {
        marginTop: 50
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
})
