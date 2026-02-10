import { Colors } from '@/constants/Colors';
import { AuthProvider as AuthContextProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() {
    return (
        <AuthContextProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name='register' />
                <Stack.Screen name='cigar-detail' options={{
                    presentation: 'modal',
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
                <Stack.Screen name='add-post' options={{
                    presentation: 'modal',
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
                <Stack.Screen name='scan' options={{
                    presentation: 'modal',
                    headerShown: false,
                    animation: 'slide_from_bottom'
                }} />
            </Stack>
        </AuthContextProvider>

    );
}
