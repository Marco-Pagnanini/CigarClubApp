import { brandApi } from '@/api/api';
import { Colors, Shadows } from '@/constants/Colors';
import { Cigar } from '@/types/CigarData';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CigarCardProps {
    cigar: Cigar;
    onPress?: () => void;
}

const CigarCard = ({ cigar, onPress }: CigarCardProps) => {

    const [brand, setBrand] = useState<any>(null)

    useEffect(() => {
        getBrand()
    }, [])

    const getBrand = async () => {
        try {
            const response = await brandApi.get(`/${cigar.brandId}`)
            setBrand(response.data.data)
        }
        catch (error) {
            console.error("Errore nel recupero del brand:", error)
        }
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Immagine a sinistra */}
            <Image
                source={{ uri: brand?.logoUrl }} // Sostituisci con la tua immagine
                style={styles.image}
                resizeMode="cover"
            />

            {/* Contenuto a destra */}
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.code}>{cigar.code}</Text>
                    <View style={[styles.categoryBadge,
                    cigar.category === 'sigaro' ? styles.cigarBadge : styles.cigaretteBadge
                    ]}>
                        <Text style={styles.categoryText}>{cigar.category}</Text>
                    </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {cigar.description}
                </Text>

                <View style={styles.footer}>
                    <View>
                        <Text style={styles.priceLabel}>Prezzo al kg</Text>
                        <Text style={styles.priceValue}>€{cigar.priceKg.toFixed(2)}</Text>
                    </View>

                    <View style={styles.stackInfo}>
                        <Text style={styles.stackLabel}>{cigar.stackType}</Text>
                        <Text style={styles.stackPrice}>€{cigar.stackPrice.toFixed(2)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CigarCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
        ...Shadows.medium,
    },
    image: {
        width: 120,
        height: '100%',
        backgroundColor: Colors.backgroundLight,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    code: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
    },
    cigarBadge: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderColor: Colors.primaryDark,
    },
    cigaretteBadge: {
        backgroundColor: 'rgba(136, 136, 136, 0.15)',
        borderColor: Colors.textMuted,
    },
    categoryText: {
        color: Colors.text,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    description: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceLabel: {
        fontSize: 12,
        color: Colors.textMuted,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    stackInfo: {
        alignItems: 'flex-end',
    },
    stackLabel: {
        fontSize: 11,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    stackPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
})
