import { postsApi } from '@/api/api'
import { Colors } from '@/constants/Colors'
import { router } from 'expo-router'
import React, { useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'

export default function AddPostScreen() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreatePost = async () => {

        if (!title.trim() || !content.trim()) {
            Alert.alert("Attenzione", "Compila tutti i campi")
            return
        }

        setLoading(true)
        try {
            await postsApi.post('/', { title, content })
            router.back()
        } catch (error) {
            Alert.alert("Errore", "Titolo e contenuto non hanno un contenuto adeguato")

        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Annulla</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nuovo Post</Text>
                <TouchableOpacity onPress={handleCreatePost} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color={Colors.primary} />
                    ) : (
                        <Text style={styles.publishText}>Pubblica</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.form}
            >
                <TextInput
                    style={styles.inputTitle}
                    placeholder="Titolo"
                    value={title}
                    onChangeText={setTitle}
                    maxLength={100}
                    autoFocus
                />
                <TextInput
                    style={styles.inputContent}
                    placeholder="A cosa stai pensando?"
                    value={content}
                    onChangeText={setContent}
                    maxLength={2000}
                    multiline
                    textAlignVertical="top"
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cancelText: {
        fontSize: 16,
        color: '#666',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    publishText: {
        fontSize: 16,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    form: {
        flex: 1,
        padding: 20,
    },
    inputTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContent: {
        fontSize: 18,
        flex: 1,
    },
})
