import { postsApi, userApi } from '@/api/api'
import { Colors, Fonts } from '@/constants/Colors'
import { useAuth } from '@/context/AuthContext'
import { Post } from '@/types/PostData'
import { UserProfile } from '@/types/Profile'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    Dimensions,
    FlatList,
    Image,
    ListRenderItem,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

const Profile = () => {
    const { user, signOut } = useAuth()
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (user === null) {
            router.push('/login-bottom')
            return
        }
        fetchAllData();
    }, [user])

    const fetchAllData = async () => {
        await Promise.all([fetchUserProfile(), fetchPostProfile()]);
    }

    const fetchUserProfile = async () => {
        try {
            const response = await userApi.get(`/${user?.id}`);
            setUserProfile(response.data);
        } catch (error) {

        }
    }

    const fetchPostProfile = async () => {
        try {
            const response = await postsApi.get(`user`)
            setUserPosts(response.data);
        } catch (err) {

        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await signOut();
    }

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.topRow}>
                <View style={styles.avatarWrapper}>
                    <Image
                        source={require('@/assets/images/image_profile.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.plusBadge}>
                        <Text style={styles.plusText}>+</Text>
                    </View>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{userPosts.length}</Text>
                        <Text style={styles.statLabel}>Post</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bioContainer}>
                <Text style={styles.userName}>
                    {userProfile?.name} {userProfile?.lastName}
                </Text>
                <Text style={styles.userRole}>{userProfile?.role || 'Digital Creator'}</Text>
                <Text style={styles.userBio}>
                    Benvenuti nel mio profilo ufficiale. 📸
                    {'\n'}Membro dal {userProfile?.createAt}
                </Text>
            </View>

            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Esci</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPostItem: ListRenderItem<Post> = ({ item }) => (
        <TouchableOpacity
            style={styles.gridItem}
            onPress={() => router.push(`/post/${item.id}`)}
        >
            <View style={styles.textPostContent}>
                <Text style={styles.postTitle} numberOfLines={3} ellipsizeMode="tail">
                    {item.title || item.content || "Nuovo Post"}
                </Text>
                <View style={styles.postMeta}>
                    <Text style={styles.metaText}>❤️ {item.likesCount || 0}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={userPosts}
                keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                renderItem={renderPostItem}
                numColumns={COLUMN_COUNT}
                ListHeaderComponent={renderHeader}
                refreshing={refreshing}
                onRefresh={onRefresh}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        paddingBottom: 50,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
        marginBottom: 20,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatar: {
        width: 86,
        height: 86,
        borderRadius: 43,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    plusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.background,
    },
    plusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    statsContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        marginLeft: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    statLabel: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    bioContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    userRole: {
        fontSize: 13,
        color: Colors.textSecondary,
        marginVertical: 2,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    userBio: {
        fontSize: 14,
        color: Colors.text,
        lineHeight: 18,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    editButton: {
        flex: 1,
        backgroundColor: '#efefef',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    editButtonText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#000',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#efefef',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        fontWeight: '600',
        fontSize: 14,
        color: 'red',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    gridItem: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        padding: 1,
    },
    textPostContent: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 10,
        justifyContent: 'space-between',
    },
    postTitle: {
        fontSize: 11,
        color: '#333',
        fontWeight: '500',
        lineHeight: 16,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    postMeta: {
        alignItems: 'flex-end',
    },
    metaText: {
        fontSize: 10,
        color: '#999',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
})
