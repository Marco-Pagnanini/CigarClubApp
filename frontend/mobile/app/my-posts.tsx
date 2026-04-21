import { postsApi } from '@/api/api'
import { Colors, Fonts } from '@/constants/Colors'
import { Post } from '@/types/PostData'
import { Ionicons } from '@expo/vector-icons'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
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
            <TouchableOpacity onPress={() => router.back()} hitSlop={12} accessibilityLabel="Indietro">
                <Ionicons name="chevron-back" size={26} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.stackNavTitle}>{title}</Text>
            <View style={{ width: 26 }} />
        </View>
    )
}

export default function MyPostsScreen() {
    const insets = useSafeAreaInsets()
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    const loadPosts = async (fromRefresh = false) => {
        try {
            if (!fromRefresh) setLoading(true)
            const response = await postsApi.get('user')
            setPosts(response.data ?? [])
        } catch (error) {
            console.error('Errore nel recupero dei post profilo:', error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            loadPosts()
        }, [])
    )

    const onRefresh = () => {
        setRefreshing(true)
        loadPosts(true)
    }

    const renderPostItem = ({ item }: { item: Post }) => (
        <TouchableOpacity style={styles.postCard} onPress={() => router.push(`/post/${item.id}`)} activeOpacity={0.8}>
            <View style={styles.postCardHeader}>
                <Text style={styles.postTitle} numberOfLines={1}>
                    {item.title || 'Nuovo Post'}
                </Text>
                <View style={styles.postMeta}>
                    <Text style={styles.metaText}>❤️ {item.likesCount || 0}</Text>
                </View>
            </View>
            <Text style={styles.postExcerpt} numberOfLines={3}>
                {item.content || 'Nessun contenuto disponibile.'}
            </Text>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView style={styles.container}>
            <StackNavBar title="I miei post" />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Caricamento post…</Text>
                </View>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                    renderItem={renderPostItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.primary}
                            colors={[Colors.primary]}
                        />
                    }
                    contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                    ListEmptyComponent={
                        <View style={styles.emptyPostsContainer}>
                            <Ionicons name="newspaper-outline" size={34} color={Colors.primary} />
                            <Text style={styles.emptyPostsTitle}>Ancora nessun post</Text>
                            <Text style={styles.emptyPostsSubtext}>Quando pubblichi, i tuoi post compariranno qui.</Text>
                        </View>
                    }
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
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
    listContent: {
        paddingTop: 12,
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
    postCard: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 16,
        marginBottom: 10,
    },
    postCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    postTitle: {
        flex: 1,
        fontSize: 15,
        color: Colors.text,
        fontWeight: '700',
        marginRight: 8,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    postExcerpt: {
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 19,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    postMeta: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backgroundLight,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    metaText: {
        fontSize: 12,
        color: Colors.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    emptyPostsContainer: {
        marginHorizontal: 16,
        marginTop: 10,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    emptyPostsTitle: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    emptyPostsSubtext: {
        marginTop: 6,
        fontSize: 13,
        color: Colors.textSecondary,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
})
