import { postsApi } from '@/api/api';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/types/PostData';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function PostDetail() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postsApi.get(`/${id}`);
                setPost(response.data.data || response.data);
            } catch (error) {
                console.error("Errore nel caricamento del post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id]);

    const handleDelete = () => {
        Alert.alert(
            "Elimina Post",
            "Sei sicuro di voler eliminare questo post? L'azione è irreversibile.",
            [
                { text: "Annulla", style: "cancel" },
                {
                    text: "Elimina",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            setIsDeleting(true);
                            await postsApi.delete(`/${id}`);
                            router.back();
                        } catch (error) {
                            console.error("Errore eliminazione:", error);
                            Alert.alert("Errore", "Non è stato possibile eliminare il post.");
                            setIsDeleting(false);
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!post) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Post non trovato</Text>
            </View>
        );
    }

    const isOwner = user?.id === post.userId;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerTitle: 'Dettaglio Post' }} />

            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.headerRow}>
                    <Text style={styles.title}>{post.title}</Text>

                    {isOwner && (
                        <TouchableOpacity
                            onPress={handleDelete}
                            disabled={isDeleting}
                            style={styles.iconButton}
                        >
                            {isDeleting ? (
                                <ActivityIndicator size="small" color="red" />
                            ) : (
                                <Ionicons name="trash-outline" size={24} color="#ff4444" />
                            )}
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.metaContainer}>
                    <Text style={styles.metaText}>❤️ {post.likesCount || 0}</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.body}>{post.content || post.content}</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    content: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
        gap: 10,
    },
    title: {
        flex: 1,
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
    },
    iconButton: {
        padding: 5,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    metaText: {
        color: '#888',
        fontSize: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 20,
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.text,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
    }
});
