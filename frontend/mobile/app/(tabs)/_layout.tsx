import { Tabs } from 'expo-router'
import React from 'react'

const _layout = () => {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ title: '_layout' }} />
        </Tabs>
    )
}

export default _layout
