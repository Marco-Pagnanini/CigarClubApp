import { postsApi } from '@/api/api';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function PostDetail() {
    // Expo Router estrae l'ID dall'URL automaticamente
    const { id } = useLocalSearchParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postsApi.get(`/${id}`);
                console.log("Sto visualizzando il post numero:", response.data);
            } catch (error) {
                console.error("Errore nel caricamento del post:", error);
            }
        };
        fetchPost();
    }, [id]);

    return (
        <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Dettaglio Post ID: {id}</Text>
        </View>
    );
}
