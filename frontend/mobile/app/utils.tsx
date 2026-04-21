import { Colors, Fonts } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import Slider from '@react-native-community/slider'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function StackNavBar({ title }: { title: string }) {
    return (
        <View style={styles.stackNav}>
            <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Indietro"
            >
                <Ionicons name="chevron-back" size={26} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.stackNavTitle} numberOfLines={1}>
                {title}
            </Text>
            <View style={{ width: 26 }} />
        </View>
    )
}

export default function UtilsScreen() {
    const insets = useSafeAreaInsets()
    const [ringSize, setRingSize] = useState(50)
    const [calibrationScale, setCalibrationScale] = useState(1.0)
    const [isCalibrating, setIsCalibrating] = useState(false)

    const diameterInInches = ringSize / 64
    const diameterInMM = diameterInInches * 25.4
    const basePixelSize = (diameterInMM / 25.4) * 160
    const calibratedPixelSize = basePixelSize * calibrationScale
    const oneEuroMM = 23.25
    const oneEuroPixels = (oneEuroMM / 25.4) * 160 * calibrationScale

    return (
        <SafeAreaView style={styles.container}>
            <StackNavBar title="Misuratore ring" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            {isCalibrating ? 'Calibrazione schermo' : 'Misuratore'}
                        </Text>
                        <TouchableOpacity onPress={() => setIsCalibrating(!isCalibrating)}>
                            <Text style={styles.calibButtonText}>{isCalibrating ? 'Fatto' : 'Calibra'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ringContainer}>
                        {isCalibrating ? (
                            <>
                                <View
                                    style={[
                                        styles.visualCircle,
                                        {
                                            width: oneEuroPixels,
                                            height: oneEuroPixels,
                                            borderRadius: oneEuroPixels / 2,
                                            borderColor: 'orange',
                                            borderStyle: 'solid',
                                        },
                                    ]}
                                />
                                <Text style={styles.scaleText}>
                                    Appoggia una moneta da 1€ sul cerchio arancione e usa lo slider sotto finché non
                                    coincidono perfettamente.
                                </Text>
                            </>
                        ) : (
                            <>
                                <View style={styles.measurements}>
                                    <Text style={styles.ringBigText}>{ringSize}</Text>
                                    <Text style={styles.ringLabel}>RING</Text>
                                </View>
                                <View style={styles.conversions}>
                                    <Text style={styles.conversionText}>{diameterInMM.toFixed(1)} mm</Text>
                                    <Text style={styles.divider}>|</Text>
                                    <Text style={styles.conversionText}>{diameterInInches.toFixed(2)}"</Text>
                                </View>
                                <View
                                    style={[
                                        styles.visualCircle,
                                        {
                                            width: calibratedPixelSize,
                                            height: calibratedPixelSize,
                                            borderRadius: calibratedPixelSize / 2,
                                        },
                                    ]}
                                />
                                <Text style={styles.scaleText}>Appoggia il piede del sigaro qui</Text>
                            </>
                        )}
                    </View>

                    <View style={styles.sliderContainer}>
                        {isCalibrating ? (
                            <>
                                <Text style={styles.sliderHeader}>Regola zoom schermo</Text>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0.8}
                                    maximumValue={1.3}
                                    step={0.001}
                                    value={calibrationScale}
                                    onValueChange={setCalibrationScale}
                                    minimumTrackTintColor="orange"
                                    thumbTintColor="orange"
                                />
                            </>
                        ) : (
                            <>
                                <View style={styles.sliderLabels}>
                                    <Text style={styles.sliderLabelText}>Piccolo</Text>
                                    <Text style={styles.sliderLabelText}>Grande</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={26}
                                    maximumValue={80}
                                    step={1}
                                    value={ringSize}
                                    onValueChange={setRingSize}
                                    minimumTrackTintColor={Colors.primary}
                                    maximumTrackTintColor="#d3d3d3"
                                    thumbTintColor={Colors.primary}
                                />
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        I display dei telefoni variano. Usa &quot;Calibra&quot; la prima volta per maggiore precisione.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    stackNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    stackNavTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '600',
        color: Colors.text,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    card: {
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 20,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.primary,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    calibButtonText: {
        color: 'orange',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    ringContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        minHeight: 250,
    },
    measurements: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    ringBigText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.primary,
        lineHeight: 50,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    ringLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
        marginBottom: 8,
        marginLeft: 4,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    conversions: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: 24,
    },
    conversionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    divider: {
        marginHorizontal: 8,
        color: '#ccc',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    visualCircle: {
        borderWidth: 2,
        borderColor: Colors.primary,
        backgroundColor: 'rgba(200, 200, 200, 0.1)',
        borderStyle: 'dashed',
    },
    scaleText: {
        marginTop: 15,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 10,
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    sliderContainer: {
        marginTop: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 16,
        padding: 12,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: -5,
    },
    sliderLabelText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    sliderHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
    infoCard: {
        marginHorizontal: 20,
        padding: 15,
        backgroundColor: 'rgba(255, 165, 0, 0.1)',
        borderRadius: 16,
    },
    infoText: {
        color: '#d48806',
        fontSize: 13,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Didot' : Fonts.title.fontFamily,
    },
})
