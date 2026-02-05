'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react";
import { brandApi, catalogApi, panelApi } from '@/api/api';
import { Tobacconist } from '@/types/tobacconist';
import { PanelData } from '@/types/panel';

// Importiamo i nostri nuovi componenti
import { CigarCard } from '@/components/myComponents/CigarCard'
import { PanelDetailsModal } from '@/components/myComponents/PanelDetailsModal';
import { AddCigarDialog } from '@/components/myComponents/AddCigarDialog';

export default function DashboardHome() {
    // Stato Catalogo
    const [isLoading, setIsLoading] = useState(true);
    const [cigars, setCigars] = useState<Tobacconist[]>([]);

    // Stato Modale Panel
    const [selectedPanel, setSelectedPanel] = useState<PanelData | null>(null);
    const [brand, setBrand] = useState<string | null>(null);
    const [isPanelLoading, setIsPanelLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Caricamento Iniziale
    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                const response = await catalogApi.get('/');
                setCigars(response.data);
            } catch (error) {
                console.error("Errore catalogo", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCatalog();
    }, []);

    // Logica on-demand per il panel
    const handleFetchPanel = async (panelId: string) => {
        if (!panelId) return;

        setIsPanelLoading(true);
        setIsDialogOpen(true); // Apre la modale

        try {
            // 1. Prendo i dati del panel
            const response = await panelApi.get(`/${panelId}`);
            const panelData = response.data.data; // Assumo che la struttura sia { data: ... }
            setSelectedPanel(panelData);

            // 2. Prendo i dati del brand (se c'è brandId)
            if (panelData.brandId) {
                const responseBrand = await brandApi.get(`/${panelData.brandId}`);
                setBrand(responseBrand.data.data.name);
            } else {
                setBrand(null);
            }

        } catch (error) {
            console.error("Errore caricamento panel", error);
            setSelectedPanel(null);
        } finally {
            setIsPanelLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catalogo Sigari</h1>
                    <p className="text-muted-foreground">Gestisci il tuo inventario prodotti.</p>
                </div>
                {/* COMPONENTE MODALE AGGIUNTA */}
                <AddCigarDialog />
            </div>

            {/* LISTA SIGARI */}
            {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cigars.map((sigaro) => (
                        <CigarCard
                            key={sigaro.id}
                            sigaro={sigaro}
                            onViewPanel={handleFetchPanel}
                        />
                    ))}
                </div>
            )}

            {/* COMPONENTE MODALE DETTAGLI PANEL */}
            <PanelDetailsModal
                isOpen={isDialogOpen}
                onClose={setIsDialogOpen}
                isLoading={isPanelLoading}
                panel={selectedPanel}
                brandName={brand}
            />
        </div>
    );
}
