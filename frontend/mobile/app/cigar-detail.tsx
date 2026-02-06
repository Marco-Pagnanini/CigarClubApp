import { panelApi, tobacconistApi } from '@/api/api'
import { Colors, Shadows } from '@/constants/Colors'
import { Cigar } from '@/types/CigarData'
import { Panel } from '@/types/PanelData'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const { width } = Dimensions.get('window')

const CigarDetail = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams<{ id: string }>()
    const [cigar, setCigar] = useState<Cigar | null>(null)
    const [panel, setPanel] = useState<Panel | null>(null)
    const [loading, setLoading] = useState(true)
    const [panelLoading, setPanelLoading] = useState(false)

    useEffect(() => {
        if (id) {
            getCigarDetail(id)
        }
    }, [id])

    const getCigarDetail = async (cigarId: string) => {
        try {
            setLoading(true)
            const response = await tobacconistApi.get(`/${cigarId}`)
            console.log('Dettagli sigaro:', response.data)
            const cigarData = response.data.data
            setCigar(cigarData)

            if (cigarData.panelId) {
                getPanelDetail(cigarData.panelId)
            }
        } catch (error) {
            console.error('Errore nel recupero del sigaro:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPanelDetail = async (panelId: string) => {
        try {
            setPanelLoading(true)
            const response = await panelApi.get(`/${panelId}`)
            console.log('Dettagli del panel:', response.data)
            setPanel(response.data.data)
        } catch (error) {
            console.error('Errore nel recupero del panel:', error)
        } finally {
            setPanelLoading(false)
        }
    }

    const getStrengthLabel = (strength: number) => {
        const labels = ['Leggero', 'Medio', 'Forte', 'Molto Forte']
        return labels[strength] || 'N/A'
    }

    const getWrapperColorLabel = (color: number) => {
        const labels = ['Chiaro', 'Medio', 'Scuro', 'Maduro']
        return labels[color] || 'N/A'
    }

    if (loading || !cigar) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Caricamento...</Text>
                </View>
            </SafeAreaView>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                {/* Hero Image con Gradient Overlay */}
                <View style={styles.heroContainer}>
                    <Image
                        source={require('@/assets/images/cigar_login_bg.png')}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', Colors.background]}
                        style={styles.gradient}
                    />

                    {/* Close Button Floating */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.closeButtonFloating}
                    >
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    {/* Badge categoria on image */}
                    <View style={styles.categoryBadgeFloating}>
                        <View style={[styles.categoryBadge,
                        cigar.category === 'sigaro' ? styles.cigarBadge : styles.cigaretteBadge
                        ]}>
                            <Text style={styles.categoryText}>{cigar.category}</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Title & Code */}
                    <View style={styles.titleSection}>
                        <Text style={styles.code}>{cigar.code}</Text>
                        <Text style={styles.description}>{cigar.description}</Text>
                    </View>

                    {/* Price Cards */}
                    <View style={styles.priceCards}>
                        <View style={styles.priceCard}>
                            <Text style={styles.priceCardLabel}>Prezzo al kg</Text>
                            <Text style={styles.priceCardValue}>€{cigar.priceKg.toFixed(2)}</Text>
                        </View>

                        <View style={styles.priceCard}>
                            <Text style={styles.priceCardLabel}>{cigar.stackType}</Text>
                            <Text style={styles.priceCardValue}>€{cigar.stackPrice.toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Next Price Alert */}
                    {cigar.nextPrice !== cigar.priceKg && (
                        <View style={styles.alertCard}>
                            <View style={styles.alertHeader}>
                                <Text style={styles.alertIcon}>⚠️</Text>
                                <Text style={styles.alertTitle}>Prossimo Aggiornamento</Text>
                            </View>
                            <View style={styles.alertContent}>
                                <View style={styles.alertRow}>
                                    <Text style={styles.alertLabel}>Nuovo prezzo al kg</Text>
                                    <Text style={styles.alertValue}>€{cigar.nextPrice.toFixed(2)}</Text>
                                </View>
                                <View style={styles.alertRow}>
                                    <Text style={styles.alertLabel}>Nuovo prezzo {cigar.stackType}</Text>
                                    <Text style={styles.alertValue}>€{cigar.nextStackPrice.toFixed(2)}</Text>
                                </View>
                                <Text style={styles.alertDate}>
                                    Valido dal {new Date(cigar.nextPricingValidity).toLocaleDateString('it-IT')}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Panel Details - Solo se presente */}
                    {panel && (
                        <>
                            <View style={styles.panelHeader}>
                                <Text style={styles.sectionTitle}>📋 Panel</Text>
                                {panel.brand && (
                                    <View style={styles.brandBadge}>
                                        <Text style={styles.brandText}>{panel.brand.name}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Panel Info Grid */}
                            <View style={styles.panelGrid}>
                                <View style={styles.panelCard}>
                                    <Text style={styles.panelCardIcon}>🌍</Text>
                                    <Text style={styles.panelCardLabel}>Origine</Text>
                                    <Text style={styles.panelCardValue}>{panel.origin}</Text>
                                </View>

                                <View style={styles.panelCard}>
                                    <Text style={styles.panelCardIcon}>📐</Text>
                                    <Text style={styles.panelCardLabel}>Forma</Text>
                                    <Text style={styles.panelCardValue}>{panel.shape}</Text>
                                </View>

                                <View style={styles.panelCard}>
                                    <Text style={styles.panelCardIcon}>⭕</Text>
                                    <Text style={styles.panelCardLabel}>Ring</Text>
                                    <Text style={styles.panelCardValue}>{panel.ring}</Text>
                                </View>

                                <View style={styles.panelCard}>
                                    <Text style={styles.panelCardIcon}>⏱️</Text>
                                    <Text style={styles.panelCardLabel}>Durata</Text>
                                    <Text style={styles.panelCardValue}>{panel.smokingTime}min</Text>
                                </View>

                                <View style={styles.panelCard}>
                                    <Text style={styles.panelCardIcon}>💪</Text>
                                    <Text style={styles.panelCardLabel}>Forza</Text>
                                    <Text style={styles.panelCardValue}>{getStrengthLabel(panel.strength)}</Text>
                                </View>

                                <View style={styles.panelCard}>
                                    <Text style={styles.panelCardIcon}>⭐</Text>
                                    <Text style={styles.panelCardLabel}>Rating</Text>
                                    <Text style={styles.panelCardValue}>{panel.rating}/100</Text>
                                </View>
                            </View>

                            {/* Tobacco Details */}
                            <View style={styles.tobaccoSection}>
                                <Text style={styles.sectionTitle}>🍃 Composizione Tabacco</Text>
                                <View style={styles.tobaccoCard}>
                                    <View style={styles.tobaccoRow}>
                                        <Text style={styles.tobaccoLabel}>Wrapper</Text>
                                        <Text style={styles.tobaccoValue}>
                                            {panel.wrapper} • {getWrapperColorLabel(panel.wrapperColor)}
                                        </Text>
                                    </View>
                                    <View style={styles.tobaccoRow}>
                                        <Text style={styles.tobaccoLabel}>Binder</Text>
                                        <Text style={styles.tobaccoValue}>{panel.binder}</Text>
                                    </View>
                                    <View style={styles.tobaccoRow}>
                                        <Text style={styles.tobaccoLabel}>Filler</Text>
                                        <Text style={styles.tobaccoValue}>{panel.filler}</Text>
                                    </View>
                                    <View style={styles.tobaccoRow}>
                                        <Text style={styles.tobaccoLabel}>Tipo di Lavorazione</Text>
                                        <Text style={styles.tobaccoValue}>{panel.rollingType}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Additional Info */}
                            <View style={styles.infoSection}>
                                <View style={styles.infoCard}>
                                    <View style={styles.infoItem}>
                                        <View style={styles.infoIcon}>
                                            <Text style={styles.infoIconText}>📦</Text>
                                        </View>
                                        <View style={styles.infoContent}>
                                            <Text style={styles.infoLabel}>Numero per scatola</Text>
                                            <Text style={styles.infoValue}>{panel.numberInBox} sigari</Text>
                                        </View>
                                    </View>

                                    {panel.masterLine && (
                                        <View style={styles.infoItem}>
                                            <View style={styles.infoIcon}>
                                                <Text style={styles.infoIconText}>🎯</Text>
                                            </View>
                                            <View style={styles.infoContent}>
                                                <Text style={styles.infoLabel}>Linea Master</Text>
                                                <Text style={styles.infoValue}>{panel.masterLine}</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </>
                    )}

                    {/* Info Section Base */}
                    <View style={styles.infoSection}>
                        <Text style={styles.sectionTitle}>Dettagli</Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoItem}>
                                <View style={styles.infoIcon}>
                                    <Text style={styles.infoIconText}>📦</Text>
                                </View>
                                <View style={styles.infoContent}>
                                    <Text style={styles.infoLabel}>Tipo confezione</Text>
                                    <Text style={styles.infoValue}>{cigar.stackType}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Barcodes */}
                    {cigar.barcodes && cigar.barcodes.length > 0 && (
                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Codici a barre</Text>
                            <View style={styles.barcodeContainer}>
                                {cigar.barcodes.map((barcode, index) => (
                                    <View key={index} style={styles.barcodeChip}>
                                        <Text style={styles.barcodeText}>{barcode}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>
        </View>
    )
}

export default CigarDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.text,
        fontSize: 16,
    },

    // Hero Section
    heroContainer: {
        width: '100%',
        height: 400,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 150,
    },
    closeButtonFloating: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(18, 18, 18, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.medium,
    },
    closeText: {
        fontSize: 22,
        color: Colors.text,
        fontWeight: '600',
    },
    categoryBadgeFloating: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    categoryBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
        ...Shadows.small,
    },
    cigarBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.25)',
        borderColor: Colors.primary,
    },
    cigaretteBadge: {
        backgroundColor: 'rgba(136, 136, 136, 0.25)',
        borderColor: Colors.textSecondary,
    },
    categoryText: {
        color: Colors.text,
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    // Content
    content: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    titleSection: {
        marginBottom: 24,
    },
    code: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: 8,
    },
    description: {
        fontSize: 17,
        color: Colors.textSecondary,
        lineHeight: 26,
    },

    // Price Cards
    priceCards: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    priceCard: {
        flex: 1,
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadows.small,
    },
    priceCardLabel: {
        fontSize: 13,
        color: Colors.textMuted,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    priceCardValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
    },

    // Alert Card
    alertCard: {
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 152, 0, 0.3)',
    },
    alertHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    alertIcon: {
        fontSize: 24,
        marginRight: 8,
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.warning,
    },
    alertContent: {
        gap: 12,
    },
    alertRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alertLabel: {
        fontSize: 14,
        color: Colors.text,
    },
    alertValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.warning,
    },
    alertDate: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
        fontStyle: 'italic',
    },

    // Panel Section
    panelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    brandBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    brandText: {
        color: Colors.background,
        fontSize: 12,
        fontWeight: 'bold',
    },
    panelGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 24,
    },
    panelCard: {
        width: (width - 52) / 3, // 3 colonne con gap
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    panelCardIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    panelCardLabel: {
        fontSize: 11,
        color: Colors.textMuted,
        marginBottom: 4,
        textAlign: 'center',
    },
    panelCardValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.text,
        textAlign: 'center',
    },

    // Tobacco Section
    tobaccoSection: {
        marginBottom: 24,
    },
    tobaccoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    tobaccoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    tobaccoLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    tobaccoValue: {
        fontSize: 14,
        color: Colors.text,
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },

    // Info Section
    infoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 4,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    infoIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: Colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    infoIconText: {
        fontSize: 22,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 13,
        color: Colors.textMuted,
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
        textTransform: 'capitalize',
    },
    infoValueSmall: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textSecondary,
    },

    // Barcodes
    barcodeContainer: {
        gap: 8,
    },
    barcodeChip: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    barcodeText: {
        fontSize: 16,
        color: Colors.text,
        fontFamily: 'monospace',
        letterSpacing: 2,
    },

    bottomSpacer: {
        height: 60,
    },
})
