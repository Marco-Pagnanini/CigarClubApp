import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Shadows } from '@/constants/Colors';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabIconConfig {
    active: IconName;
    inactive: IconName;
    label: string;
}

const TAB_ICONS: Record<string, TabIconConfig> = {
    index: {
        active: 'scan',
        inactive: 'scan-outline',
        label: 'Scan',
    },
    explore: {
        active: 'compass',
        inactive: 'compass-outline',
        label: 'Explore',
    },
    cigars: {
        active: 'list',
        inactive: 'list-outline',
        label: 'Cigars',
    },
    profile: {
        active: 'person',
        inactive: 'person-outline',
        label: 'Profile',
    },
};

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.wrapper}>
            <LinearGradient
                colors={[Colors.tabBackground, Colors.backgroundDark]}
                style={[styles.container, { paddingBottom: insets.bottom + 10 }]}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    // Get icon config for this route
                    const iconConfig = TAB_ICONS[route.name] || {
                        active: 'home',
                        inactive: 'home-outline',
                        label: route.name,
                    };

                    const iconName = isFocused ? iconConfig.active : iconConfig.inactive;

                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : iconConfig.label;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabItem}
                        >
                            <View style={[
                                styles.iconContainer,
                                isFocused && styles.activeIconContainer
                            ]}>
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={isFocused ? Colors.primary : Colors.tabIconDefault}
                                />
                            </View>
                            {isFocused && (
                                <Text style={styles.label}>
                                    {typeof label === 'string' ? label : iconConfig.label}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 30,
        zIndex: 100,
    },
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        ...Shadows.large,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 20,
    },
    activeIconContainer: {
        backgroundColor: Colors.tabActiveBackground,
    },
    label: {
        color: Colors.primary,
        fontSize: 10,
        marginTop: 4,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
