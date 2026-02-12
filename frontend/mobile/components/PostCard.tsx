import { postsApi, userApi } from '@/api/api'
import { Colors, Fonts } from '@/constants/Colors'
import { useAuth } from '@/context/AuthContext'
import { Post } from '@/types/PostData'
import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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

    useEffect(() => {
        setCurrentLikesCount(likesCount)
    }, [likesCount])

    const getDisplayName = () => {
        if (!userEmail) return 'Membro del Club'
        return userEmail.split('@')[0]  // mostra solo "mario"
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
            console.error(error)
        }
    }

    const handleLikePress = async () => {
        const isLiking = !userLike
        setUserLike(isLiking)
        setCurrentLikesCount(prev => isLiking ? prev + 1 : Math.max(0, prev - 1))

        try {
            await postsApi.post(`/${post.id}/like`)
        } catch (error) {
            setUserLike(!isLiking)
            setCurrentLikesCount(prev => !isLiking ? prev + 1 : Math.max(0, prev - 1))
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).toUpperCase()
    }
    const handleShare = async () => {

        const deepLink = `cigarclub://post/${post.id}`;

        try {
            await Share.share({
                title: post.title,
                message: `🔥 Guarda questo post su Cigar Club: ${post.title}\n\nClicca qui per aprirlo nell'app: ${deepLink}`,
                url: deepLink,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const getAvatarLabel = () => {
        return userEmail ? userEmail.charAt(0).toUpperCase() : '?'
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{getAvatarLabel()}</Text>
                    </View>
                    <View>
                        <Text style={styles.username} numberOfLines={1}>
                            {getDisplayName() || 'Membro del Club'}
                        </Text>
                        <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleShare}>
                    <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.body}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.content}>{post.content}</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.actionRow}>
                    <View style={styles.leftIcons}>
                        <TouchableOpacity
                            onPress={handleLikePress}
                            activeOpacity={0.7}
                            style={styles.iconButton}
                        >
                            <Ionicons
                                name={userLike ? 'heart' : 'heart-outline'}
                                size={26}
                                color={userLike ? Colors.primary : Colors.text}
                            />
                        </TouchableOpacity>
                    </View>

                </View>

                <Text style={styles.likesText}>
                    Piace a <Text style={styles.likesHighlight}>{currentLikesCount} membri</Text>
                </Text>
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: Colors.surface,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingVertical: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    avatarText: {
        color: Colors.primary,
        fontWeight: 'bold',
        fontSize: 16,
        ...Fonts.title,
    },
    username: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    date: {
        color: Colors.textSecondary,
        fontSize: 10,
        marginTop: 2,
    },
    body: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        ...Fonts.title,
        letterSpacing: 0.5,
    },
    content: {
        color: Colors.text,
        fontSize: 15,
        lineHeight: 22,
        ...Fonts.body,
    },
    footer: {
        paddingHorizontal: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    leftIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconButton: {
        padding: 4,
    },
    likesText: {
        color: Colors.textSecondary,
        fontSize: 13,
    },
    likesHighlight: {
        color: Colors.text,
        fontWeight: 'bold',
    }
})
