import { panelApi } from '@/api/api'
import { Colors, Shadows } from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PAGE_SIZE = 10

export interface Brand {
    id: string;
    name: string;
    logoUrl: string;
    country: string;
}

export type WrapperColor = 0 | 1 | 2 | 3;
export type TobaccoType = 0 | 1 | 2;
export type Strength = 0 | 1 | 2 | 3;

export interface Panel {
    id: string;
    name: string;
    description: string;
    tobacconistCode: string;
    tobacconistId: string;
    brandId: string;
    brand: Brand;
    origin: string;
    shape: string;
    ring: number;
    smokingTime: number;
    strength: Strength;
    rating: number;
    price: number;
    numberInBox: number;
    rollingType: string;
    type: TobaccoType;
    wrapper: string;
    wrapperColor: WrapperColor;
    binder: string;
    filler: string;
    masterLine: string;
    imageUrl: string;
}

const PanelCard = ({ panel }: { panel: Panel }) => {
    const renderStrengthDots = (strength: number) => {
        const totalDots = 5
        const filledDots = Math.min(strength + 1, 5)

        return (
            <View style={styles.strengthDotsContainer}>
                {Array.from({ length: totalDots }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index < filledDots ? Colors.primary : 'transparent',
                                borderColor: index < filledDots ? Colors.primary : Colors.textSecondary
                            }
                        ]}
                    />
                ))}
            </View>
        )
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
        >
            <View style={styles.imageHeader}>
                {panel.imageUrl ? (
                    <Image
                        source={{ uri: panel.imageUrl }}
                        style={styles.cigarImage}
                        resizeMode="contain"
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="cigar"
                        size={60}
                        color={Colors.textMuted}
                        style={{ transform: [{ rotate: '-90deg' }] }}
                    />
                )}
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>€ {panel.price.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.infoBody}>
                <View style={styles.headerSection}>
                    <Text style={styles.brandName}>{panel.brand.name.toUpperCase()}</Text>
                    <Text style={styles.cigarName} numberOfLines={2}>{panel.name}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.labelSmall}>PAESE</Text>
                        <Text style={styles.valueSmall} numberOfLines={1}>{panel.origin}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.labelSmall}>FORMATO</Text>
                        <Text style={styles.valueSmall} numberOfLines={1}>{panel.shape}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.labelSmall}>MISURE</Text>
                        <Text style={styles.valueSmall}>RG {panel.ring}</Text>
                    </View>
                </View>

                <View style={styles.footerSection}>
                    <View style={styles.strengthWrapper}>
                        <Text style={styles.labelSmall}>FORZA</Text>
                        {renderStrengthDots(panel.strength)}
                    </View>

                    <View style={styles.scoreWrapper}>
                        <Text style={styles.scoreLabel}>PUNTEGGIO</Text>
                        <Text style={styles.scoreValue}>{panel.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

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

            const pageToFetch = isReset ? 1 : pageNumber

            const response = await panelApi.get('/', {
                /* params: {
                     page: pageToFetch,
                     pageSize: PAGE_SIZE
                 }*/
            })

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

            if (newPanels.length < PAGE_SIZE) {
                setHasMore(false)
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
        fontFamily: 'serif',
    },
    statsText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
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
        fontFamily: 'serif',
    },
    cigarName: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'serif',
        lineHeight: 24,
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
    },
    valueSmall: {
        color: Colors.text,
        fontSize: 12,
        fontWeight: '500',
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
    },
    scoreValue: {
        color: Colors.primary,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'serif',
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
    },
})
