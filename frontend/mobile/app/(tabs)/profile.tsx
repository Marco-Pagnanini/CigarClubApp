import { postsApi, userApi } from '@/api/api'
import { Colors, Fonts } from '@/constants/Colors'
import { useAuth } from '@/context/AuthContext'
import { UserProfile } from '@/types/Profile'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import {
    FlatList,
    Image,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'

const Profile = () => {
    const { user, signOut } = useAuth()
    const [userProfile, setUserProfile] = useState<UserProfile>();
    const [userPostsCount, setUserPostsCount] = useState(0);
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
            setUserPostsCount(response.data.length || 0);
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
                        <Text style={styles.statNumber}>{userPostsCount}</Text>
                        <Text style={styles.statLabel}>Post</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.iconGhost}
                    onPress={handleLogout}
                    activeOpacity={0.75}
                    accessibilityLabel="Esci"
                >
                    <Ionicons name="log-out-outline" size={22} color={Colors.error} />
                </TouchableOpacity>
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

            <View style={styles.toolsSection}>
                <Text style={styles.toolsSectionTitle}>Strumenti</Text>
                <TouchableOpacity
                    style={styles.toolRow}
                    onPress={() => router.push('/panel')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="grid-outline" size={22} color={Colors.primary} />
                    <View style={styles.toolRowText}>
                        <Text style={styles.toolRowTitle}>Pannelli</Text>
                        <Text style={styles.toolRowSub}>Schede degustazione</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.toolRow}
                    onPress={() => router.push('/utils')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="resize-outline" size={22} color={Colors.primary} />
                    <View style={styles.toolRowText}>
                        <Text style={styles.toolRowTitle}>Misuratore ring</Text>
                        <Text style={styles.toolRowSub}>Calibra e misura il diametro</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.toolRow}
                    onPress={() => {
                        user === null ? router.push('/login-bottom') :
                        router.push('/my-posts')
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="newspaper-outline" size={22} color={Colors.primary} />
                    <View style={styles.toolRowText}>
                        <Text style={styles.toolRowTitle}>I miei post</Text>
                        <Text style={styles.toolRowSub}>Vedi tutti i post che hai pubblicato</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
            </View>

        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                key="profile-posts-list-v2"
                data={[]}
                keyExtractor={(_, index) => index.toString()}
                renderItem={() => null}
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
        justifyContent: 'flex-start',
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
    toolsSection: {
        marginBottom: 20,
    },
    toolsSectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textSecondary,
        letterSpacing: 1.2,
        marginBottom: 12,
        textTransform: 'uppercase',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    toolRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 10,
    },
    toolRowText: {
        flex: 1,
        marginLeft: 12,
    },
    toolRowTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
    },
    toolRowSub: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 2,
        fontFamily: Platform.OS === 'ios' ? 'System' : Fonts.body.fontFamily,
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
    iconGhost: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
})
