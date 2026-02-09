import { postsApi } from '@/api/api'
import PostCard from '@/components/PostCard'
import { Colors } from '@/constants/Colors'
import { Post } from '@/types/PostData'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const PAGE_SIZE = 10

const PostPage = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [hasMore, setHasMore] = useState(true)


    const currentPage = useRef(1)
    const isLoadingMore = useRef(false)

    useFocusEffect(
        useCallback(() => {
            fetchPosts(1, true)
        }, [])
    )

    const fetchPosts = async (pageNumber: number, isReset: boolean = false) => {
        if (!isReset) {
            if (isLoadingMore.current) {
                console.log('⏸️ Già in caricamento, skip')
                return
            }
            if (!hasMore) {
                console.log('⏸️ Non ci sono altri post, skip')
                return
            }
        }

        try {
            isLoadingMore.current = true

            if (isReset) {
                if (!refreshing) setLoading(true)
                currentPage.current = 0
                setHasMore(true)
            }

            const pageToFetch = isReset ? 1 : pageNumber
            console.log('📥 Fetching page:', pageToFetch)

            const response = await postsApi.get('/', {
                params: {
                    page: pageToFetch,
                    pageSize: PAGE_SIZE
                }
            })

            const newPosts = response.data


            if (!newPosts || newPosts.length === 0) {
                setHasMore(false)
                console.log('🏁 Nessun post ricevuto, fine paginazione')


                if (isReset) {
                    setPosts([])
                }
                return
            }

            console.log('✅ Ricevuti:', newPosts.length, 'post')

            if (isReset) {
                setPosts(newPosts)
                currentPage.current = 1
            } else {
                setPosts(prevPosts => {
                    const existingIds = new Set(prevPosts.map(p => p.id))
                    const uniqueNewPosts = newPosts.filter((p: Post) => !existingIds.has(p.id))
                    if (uniqueNewPosts.length > 0) {
                        console.log('➕ Aggiunti:', uniqueNewPosts.length, 'nuovi post')
                    }
                    return [...prevPosts, ...uniqueNewPosts]
                })
                currentPage.current = pageNumber
            }


            if (newPosts.length < PAGE_SIZE) {
                setHasMore(false)
                console.log('🏁 Fine paginazione - ricevuti meno di', PAGE_SIZE, 'post')
            }

        } catch (error) {
            console.error('❌ Errore fetch:', error)
            // In caso di errore, ferma la paginazione
            setHasMore(false)
        } finally {
            setLoading(false)
            setRefreshing(false)
            // IMPORTANTE: resetta immediatamente isLoadingMore
            isLoadingMore.current = false
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true)
        fetchPosts(1, true)
    }, [])

    const loadMore = () => {
        console.log('🔄 onEndReached - Page:', currentPage.current, 'Loading:', isLoadingMore.current, 'HasMore:', hasMore)

        if (isLoadingMore.current || !hasMore || loading) {
            console.log('⏸️ Skip loadMore')
            return
        }

        const nextPage = currentPage.current + 1
        console.log('📄 Carico pagina:', nextPage)
        fetchPosts(nextPage, false)
    }



    const renderItem = useCallback(({ item }: { item: Post }) => (
        <PostCard post={item} likesCount={item.likesCount} />
    ), [])

    const renderEmptyComponent = useCallback(() => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nessun post disponibile</Text>
        </View>
    ), [])

    const renderFooter = () => {
        // Mostra loader SOLO se sta caricando E ci sono ancora post da caricare
        if (!isLoadingMore.current || !hasMore || posts.length === 0) {
            return <View style={{ height: 20 }} />
        }
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        )
    }

    if (loading && !refreshing && posts.length === 0) {
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
                    <Text style={styles.title}>Community</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => router.push('/add-post')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                        {posts.length} {posts.length === 1 ? 'post caricato' : 'post caricati'}
                    </Text>
                </View>
            </View>

            <FlatList
                data={posts}
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
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
            />
        </SafeAreaView>
    )
}

export default PostPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerContainer: {
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    statsContainer: {
        paddingVertical: 8,
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
        color: Colors.textMuted,
        fontSize: 14,
        textAlign: 'center',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 28,
        marginTop: -2,
    },
})
