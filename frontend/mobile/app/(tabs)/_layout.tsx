import CustomTabBar from '@/components/CustomTabBar'
import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
    return (
        <Tabs
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name='post'
                options={{
                    title: 'Post',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profilo',
                }}
            />
        </Tabs>
    )
}

export default _layout
