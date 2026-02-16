import { Colors } from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

function RootNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) return null;

    return (
        <>
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
                <Stack.Screen name="register" />
                <Stack.Screen name="cigar-detail" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                <Stack.Screen name="add-post" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
                <Stack.Screen
                    name='login-bottom'
                    options={{
                        presentation: 'formSheet',
                        sheetAllowedDetents: [0.45],
                        sheetInitialDetentIndex: 0,
                    }}
                />
                <Stack.Screen name="scan" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}
