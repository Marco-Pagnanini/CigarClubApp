import { Colors, Shadows } from "@/constants/Colors"
import { Panel } from "@/types/PanelData"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

export const PanelCard = ({ panel }: { panel: Panel }) => {
    const renderStrengthDots = (strength: number) => {
        const totalDots = 5
        const filledDots = Math.min(strength + 1, 5)

        return (
            <View style={styles.strengthDotsContainer}>
                {Array.from({ length: totalDots }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: index < filledDots ? Colors.primary : 'transparent',
                                borderColor: index < filledDots ? Colors.primary : Colors.textSecondary
                            }
                        ]}
                    />
                ))}
            </View>
        )
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
        >
            <View style={styles.imageHeader}>
                {panel.imageUrl ? (
                    <Image
                        source={{ uri: panel.imageUrl }}
                        style={styles.cigarImage}
                        resizeMode="contain"
                    />
                ) : (
                    <MaterialCommunityIcons
                        name="cigar"
                        size={60}
                        color={Colors.textMuted}
                        style={{ transform: [{ rotate: '-90deg' }] }}
                    />
                )}
                <View style={styles.priceTag}>
                    <Text style={styles.priceText}>€ {panel.price.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.infoBody}>
                <View style={styles.headerSection}>
                    <Text style={styles.brandName}>{panel.brand.name.toUpperCase()}</Text>
                    <Text style={styles.cigarName} numberOfLines={2}>{panel.name}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <Text style={styles.labelSmall}>PAESE</Text>
                        <Text style={styles.valueSmall} numberOfLines={1}>{panel.origin}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.labelSmall}>FORMATO</Text>
                        <Text style={styles.valueSmall} numberOfLines={1}>{panel.shape}</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.labelSmall}>MISURE</Text>
                        <Text style={styles.valueSmall}>RG {panel.ring}</Text>
                    </View>
                </View>

                <View style={styles.footerSection}>
                    <View style={styles.strengthWrapper}>
                        <Text style={styles.labelSmall}>FORZA</Text>
                        {renderStrengthDots(panel.strength)}
                    </View>

                    <View style={styles.scoreWrapper}>
                        <Text style={styles.scoreLabel}>PUNTEGGIO</Text>
                        <Text style={styles.scoreValue}>{panel.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}


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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        fontFamily: 'serif',
    },
    statsText: {
        fontSize: 14,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    listContent: {
        paddingBottom: 100,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'column',
        backgroundColor: Colors.surface,
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
        ...Shadows.medium,
    },
    imageHeader: {
        height: 140,
        backgroundColor: '#161616',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        position: 'relative',
    },
    cigarImage: {
        width: '90%',
        height: '80%',
        transform: [{ rotate: '-90deg' }],
    },
    priceTag: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: Colors.primaryDark,
    },
    priceText: {
        color: Colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoBody: {
        padding: 16,
    },
    headerSection: {
        marginBottom: 12,
    },
    brandName: {
        color: Colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1,
        marginBottom: 4,
        fontFamily: 'serif',
    },
    cigarName: {
        color: Colors.text,
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'serif',
        lineHeight: 24,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginBottom: 12,
        opacity: 0.5,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    gridItem: {
        flex: 1,
    },
    labelSmall: {
        color: Colors.textSecondary,
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
        fontWeight: '600',
    },
    valueSmall: {
        color: Colors.text,
        fontSize: 12,
        fontWeight: '500',
    },
    footerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 10,
        borderRadius: 6,
    },
    strengthWrapper: {
        justifyContent: 'center',
    },
    strengthDotsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    scoreWrapper: {
        alignItems: 'flex-end',
    },
    scoreLabel: {
        color: Colors.textSecondary,
        fontSize: 9,
        textTransform: 'uppercase',
        marginBottom: 0,
    },
    scoreValue: {
        color: Colors.primary,
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'serif',
    },
    centerLoader: {
        marginTop: 50
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        paddingHorizontal: 40,
    },
    emptyText: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
    },
})
