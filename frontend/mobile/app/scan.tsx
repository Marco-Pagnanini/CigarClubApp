import { tobacconistApi } from '@/api/api'; // Assicurati di importare la tua API
import CigarCard from '@/components/CigarCard'; // Importa la tua CigarCard
import { Colors } from '@/constants/Colors';
import { Cigar } from '@/types/CigarData'; // Importa il tipo Cigar
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

const ScanPage = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [torch, setTorch] = useState(false);

    // Stati per gestire il risultato della scansione
    const [loading, setLoading] = useState(false);
    const [foundCigar, setFoundCigar] = useState<Cigar | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Resetta tutto quando la pagina riprende il focus
    useFocusEffect(
        useCallback(() => {
            resetScanner();
        }, [])
    );

    const resetScanner = () => {
        setScanned(false);
        setFoundCigar(null);
        setErrorMsg(null);
        setLoading(false);
    };

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Ionicons name="camera-outline" size={64} color={Colors.textMuted} />
                <Text style={styles.message}>Serve il permesso per usare la fotocamera</Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Concedi Permesso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {
        if (scanned) return;

        setScanned(true);
        Vibration.vibrate();
        setLoading(true);

        try {
            console.log(`Searching for cigar with code: ${data}`);

            const response = await tobacconistApi.get(`/barcode/${data}`);
            const results = response.data;
            console.log('API response:', results.data);

            setFoundCigar(results.data);

        } catch (error) {
            console.error(error);
            setErrorMsg("Errore durante la ricerca del sigaro.");
        } finally {
            setLoading(false);
        }
    };

    const handleCigarPress = (cigar: Cigar) => {
        router.push({
            pathname: '/cigar-detail',
            params: { id: cigar.id }
        });
    };

    const toggleTorch = () => {
        setTorch(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                enableTorch={torch}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr", "ean13", "ean8", "upc_e"],
                }}
            >
                {/* --- OVERLAY SCANNER (VISIBILE SOLO SE NON HO TROVATO NULLA) --- */}
                {!foundCigar && !loading && !errorMsg && (
                    <View style={styles.overlay}>
                        {/* Header Overlay */}
                        <View style={styles.headerOverlay}>
                            <Text style={styles.title}>Scansiona Codice</Text>
                            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                                <Ionicons name="close" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Area Centrale */}
                        <View style={styles.middleRow}>
                            <View style={styles.sideOverlay} />
                            <View style={styles.scanFrame}>
                                <View style={[styles.corner, styles.topLeft]} />
                                <View style={[styles.corner, styles.topRight]} />
                                <View style={[styles.corner, styles.bottomLeft]} />
                                <View style={[styles.corner, styles.bottomRight]} />
                                <View style={styles.scanLine} />
                            </View>
                            <View style={styles.sideOverlay} />
                        </View>

                        {/* Footer Overlay */}
                        <View style={styles.bottomOverlay}>
                            <Text style={styles.instructionText}>
                                Inquadra il QR Code o il codice a barre
                            </Text>
                            <TouchableOpacity style={styles.torchButton} onPress={toggleTorch}>
                                <Ionicons name={torch ? "flash" : "flash-off"} size={24} color={torch ? Colors.primary : "#fff"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* --- LOADING OVERLAY --- */}
                {loading && (
                    <View style={styles.resultOverlay}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.resultText}>Ricerca in corso...</Text>
                    </View>
                )}

                {/* --- ERROR OVERLAY --- */}
                {errorMsg && !loading && (
                    <View style={styles.resultOverlay}>
                        <Ionicons name="alert-circle" size={50} color={Colors.error || '#ff4444'} />
                        <Text style={styles.resultText}>{errorMsg}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={resetScanner}>
                            <Text style={styles.retryButtonText}>Riprova</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeResultButton} onPress={() => router.back()}>
                            <Text style={styles.closeResultText}>Chiudi</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* --- FOUND CIGAR OVERLAY --- */}
                {foundCigar && !loading && (
                    <View style={styles.resultOverlayDark}>
                        <Text style={styles.foundTitle}>Sigaro Trovato!</Text>

                        <View style={styles.cardWrapper}>
                            <CigarCard
                                cigar={foundCigar}
                                onPress={() => handleCigarPress(foundCigar)}
                            />
                        </View>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.retryButton} onPress={resetScanner}>
                                <Text style={styles.retryButtonText}>Scansiona un altro</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.closeResultButton} onPress={() => router.back()}>
                                <Text style={styles.closeResultText}>Chiudi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

            </CameraView>
        </View>
    );
}

export default ScanPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    // Permission Styles
    permissionContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        textAlign: 'center',
        color: Colors.text,
        fontSize: 18,
        marginVertical: 20,
    },
    permissionButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    // --- STANDARD OVERLAY STYLES ---
    overlay: { flex: 1 },
    headerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 20,
        position: 'relative',
    },
    bottomOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        paddingTop: 20,
    },
    middleRow: { flexDirection: 'row', height: 280 },
    sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    scanFrame: {
        width: 280,
        height: 280,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: Colors.primary,
        borderWidth: 4,
    },
    topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
    topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
    bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
    bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
    scanLine: {
        width: '90%',
        height: 1,
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
    title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    closeButton: { position: 'absolute', right: 20, bottom: 18 },
    instructionText: { color: '#fff', fontSize: 14, textAlign: 'center', marginBottom: 30, width: '70%' },
    torchButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // --- RESULT OVERLAY STYLES ---
    resultOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultOverlayDark: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.95)', // Quasi opaco per risaltare la card
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    resultText: {
        color: '#fff',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
        marginBottom: 20,
    },
    foundTitle: {
        color: Colors.primary,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    cardWrapper: {
        width: '100%',
        marginBottom: 30,
    },
    retryButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
        width: '80%',
        alignItems: 'center',
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeResultButton: {
        padding: 10,
    },
    closeResultText: {
        color: Colors.textSecondary || '#aaa',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    actionButtons: {
        width: '100%',
        alignItems: 'center',
    }
})
