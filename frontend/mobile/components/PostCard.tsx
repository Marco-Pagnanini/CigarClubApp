import { postsApi, userApi } from '@/api/api'
import { Colors } from '@/constants/Colors'
import { useAuth } from '@/context/AuthContext'
import { Post } from '@/types/PostData'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface PostCardProps {
    post: Post
    likesCount: number
}

const PostCard: React.FC<PostCardProps> = ({ post, likesCount }) => {
    const { user } = useAuth()
    const [userEmail, setUserEmail] = useState<string>('')
    const [userLike, setUserLike] = useState<boolean>(false)
    const [currentLikesCount, setCurrentLikesCount] = useState<number>(likesCount)

    useEffect(() => {
        if (post.userId) {
            getUsernameFromPost()
        }
    }, [post.userId])

    useEffect(() => {
        if (user?.id && post.id) {
            getLikeUser()
        }
    }, [user?.id, post.id])

    const handleLike = async (postId: string) => {
        try {
            const response = await postsApi.post(`/${postId}/like`)
            console.log(response.data)
            if (response.data.data === true) {
                console.log('👍 Post piaciuto!')
                setCurrentLikesCount(prev => prev + 1)
            }
            else {
                setCurrentLikesCount(prev => Math.max(0, prev - 1))
            }


        } catch (error) {
            console.error('Errore nel like:', error)
        }
    }
    const getUsernameFromPost = async () => {
        try {
            const response = await userApi.get(`/${post.userId}`)
            setUserEmail(response.data.email)
        } catch (error) {
            console.error(error)
        }
    }

    const getLikeUser = async () => {
        if (!user?.id) return
        try {
            const response = await postsApi.get(`/${post.id}/${user.id}/likes`)
            setUserLike(response.data.data)
        } catch (error) {
            console.error('Errore nel recupero dei like:', error)
        }
    }

    const handleLikePress = () => {
        setUserLike(prev => !prev)
        handleLike && handleLike(post.id)
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getAvatarLabel = () => {
        return userEmail ? userEmail.charAt(0).toUpperCase() : '?'
    }


    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getAvatarLabel()}</Text>
                    </View>
                    <View>
                        <Text style={styles.username} numberOfLines={1}>
                            {userEmail || 'Utente sconosciuto'}
                        </Text>
                        <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.body}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.content}>{post.content}</Text>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={handleLikePress}
                    activeOpacity={0.7}
                >
                    <View style={styles.likeButton}>
                        <Ionicons
                            name={userLike ? 'heart' : 'heart-outline'}
                            size={18}
                            color={userLike ? '#E53935' : Colors.textSecondary}
                        />
                        <Text style={[styles.likeCount, { color: userLike ? '#E53935' : Colors.textSecondary }]}>
                            {currentLikesCount}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface || '#fff',
        borderRadius: 16,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: Colors.border || '#f0f0f0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    username: {
        fontWeight: '600',
        fontSize: 14,
        color: Colors.text || '#333',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: Colors.textSecondary || '#888',
    },
    body: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text || '#1a1a1a',
        marginBottom: 8,
        lineHeight: 24,
    },
    content: {
        fontSize: 15,
        color: Colors.text || '#444',
        lineHeight: 22,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: Colors.border || '#f0f0f0',
        paddingTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        backgroundColor: '#fff0f0',
    },
    heartIcon: {
        fontSize: 18,
        marginRight: 6,
    },
    likeCount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.primary || '#d32f2f',
    },
})
