import { panelApi } from '@/api/api'
import { PanelCard } from '@/components/PanelCard'
import { Colors, Fonts } from '@/constants/Colors'
import { Panel } from '@/types/PanelData'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import {
    ActivityIndicator,
    FlatList,
    Platform,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function StackNavBar({ title }: { title: string }) {
    return (
        <View style={styles.stackNav}>
            <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Indietro"
            >
                <Ionicons name="chevron-back" size={26} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.stackNavTitle} numberOfLines={1}>
                {title}
            </Text>
            <View style={{ width: 26 }} />
        </View>
    )
}

function PanelListHeader({
    panelCount,
    onScan,
}: {
    panelCount: number
    onScan: () => void
}) {
    return (
        <View style={styles.headerBlock}>
            <Text style={styles.panelIntro}>Schede degustazione e note sui sigari del club.</Text>
            <View style={styles.panelTitleRow}>
                <Text style={styles.listSectionTitle}>Pannelli</Text>
                <TouchableOpacity
                    style={styles.iconGhost}
                    onPress={onScan}
                    activeOpacity={0.75}
                    accessibilityLabel="Apri scanner"
                >
                    <Ionicons name="qr-code-outline" size={22} color={Colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.countRow}>
                <View style={styles.countChip}>
                    <Text style={styles.countChipText}>{panelCount}</Text>
                </View>
            </View>
        </View>
    )
}

export default function PanelScreen() {
    const insets = useSafeAreaInsets()
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
                setPanels((prev) => {
                    const existingIds = new Set(prev.map((p) => p.id))
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

    const handleScanPress = () => {
        router.push('/scan')
    }

    const renderItem = useCallback(({ item }: { item: Panel }) => <PanelCard panel={item} />, [])

    const renderEmptyComponent = useCallback(
        () => (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrap}>
                    <Ionicons name="grid-outline" size={36} color={Colors.primary} />
                </View>
                <Text style={styles.emptyText}>Nessun pannello disponibile</Text>
                <Text style={styles.emptySubtext}>Tira giù per aggiornare.</Text>
            </View>
        ),
        []
    )

    const renderFooter = () => {
        if (!isLoadingMore.current || !hasMore || panels.length === 0) return <View style={{ height: 20 }} />
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        )
    }

    const bottomPad = insets.bottom + 24

    if (loading && !refreshing && panels.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <StackNavBar title="Pannelli" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Caricamento pannelli…</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StackNavBar title="Pannelli" />
            <FlatList
                data={panels}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <PanelListHeader panelCount={panels.length} onScan={handleScanPress} />
                }
                contentContainerStyle={[styles.listContent, { paddingBottom: bottomPad }]}
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

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    stackNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    stackNavTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    headerBlock: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 8,
    },
    panelIntro: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginBottom: 14,
        lineHeight: 18,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    panelTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    listSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text,
        letterSpacing: 0.2,
    },
    countRow: {
        flexDirection: 'row',
        marginBottom: 4,
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
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
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
