import { Colors } from '@/constants/Colors';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Utils = () => {
    const [ringSize, setRingSize] = useState(50);

    const [calibrationScale, setCalibrationScale] = useState(1.0);
    const [isCalibrating, setIsCalibrating] = useState(false);

    // Calcoli Matematici
    const diameterInInches = (ringSize / 64);
    const diameterInMM = (diameterInInches * 25.4);

    // Moltiplichiamo per il fattore di calibrazione dell'utente
    const basePixelSize = (diameterInMM / 25.4) * 160;
    const calibratedPixelSize = basePixelSize * calibrationScale;

    // Riferimento per calibrazione: 1 Euro = 23.25 mm
    const oneEuroMM = 23.25;
    const oneEuroPixels = (oneEuroMM / 25.4) * 160 * calibrationScale;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Misuratore Ring</Text>
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* CARD PRINCIPALE */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            {isCalibrating ? "🔧 Calibrazione Schermo" : "📏 Misuratore"}
                        </Text>
                        <TouchableOpacity onPress={() => setIsCalibrating(!isCalibrating)}>
                            <Text style={styles.calibButtonText}>
                                {isCalibrating ? "Fatto" : "Calibra"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ringContainer}>
                        {isCalibrating ? (
                            // VISTA CALIBRAZIONE
                            <>
                                <View style={[styles.visualCircle, {
                                    width: oneEuroPixels,
                                    height: oneEuroPixels,
                                    borderRadius: oneEuroPixels / 2,
                                    borderColor: 'orange',
                                    borderStyle: 'solid'
                                }]} />
                                <Text style={styles.scaleText}>
                                    Appoggia una moneta da 1€ sul cerchio arancione e usa lo slider sotto finché non coincidono perfettamente.
                                </Text>
                            </>
                        ) : (
                            <>
                                <View style={styles.measurements}>
                                    <Text style={styles.ringBigText}>{ringSize}</Text>
                                    <Text style={styles.ringLabel}>RG</Text>
                                </View>
                                <View style={styles.conversions}>
                                    <Text style={styles.conversionText}>{diameterInMM.toFixed(1)} mm</Text>
                                    <Text style={styles.divider}>|</Text>
                                    <Text style={styles.conversionText}>{diameterInInches.toFixed(2)}"</Text>
                                </View>

                                <View style={[styles.visualCircle, {
                                    width: calibratedPixelSize,
                                    height: calibratedPixelSize,
                                    borderRadius: calibratedPixelSize / 2
                                }]} />
                                <Text style={styles.scaleText}>Appoggia il piede del sigaro qui</Text>
                            </>
                        )}
                    </View>

                    {/* SLIDER */}
                    <View style={styles.sliderContainer}>
                        {isCalibrating ? (
                            // SLIDER CALIBRAZIONE
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

                {/* INFO BOX */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>
                        💡 I display dei telefoni variano. Usa "Calibra" la prima volta per garantire la massima precisione.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Utils

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
        flex: 1,
    },
    headerContainer: {
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    card: {
        backgroundColor: Colors.surface,
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
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
    },
    calibButtonText: {
        color: 'orange',
        fontWeight: 'bold',
        fontSize: 16
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
    },
    ringLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: 'gray',
        marginBottom: 8,
        marginLeft: 4,
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
    },
    divider: {
        marginHorizontal: 8,
        color: '#ccc',
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
        paddingHorizontal: 10
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
        fontWeight: '600'
    },
    sliderHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        textAlign: 'center'
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
        textAlign: 'center'
    }
})
