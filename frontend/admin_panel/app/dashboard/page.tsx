'use client';

import { useState, useEffect } from 'react';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import { Plus, Cigarette, Loader2, Info } from "lucide-react";
import { catalogApi, panelApi } from '@/api/api';
import { Tobacconist } from '@/types/tobacconist';
import { PanelData } from '@/types/panel';

export default function DashboardHome() {

    const [isLoading, setIsLoading] = useState(true);
    const [cigars, setCigars] = useState<Tobacconist[]>([]);

    // Stato per il singolo panel selezionato e per la modale
    const [selectedPanel, setSelectedPanel] = useState<PanelData | null>(null);
    const [isPanelLoading, setIsPanelLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // 1. Carichiamo solo il catalogo sigari all'inizio
    const fetchCatalog = async () => {
        try {
            const response = await catalogApi.get('/');
            setCigars(response.data);
        } catch (error) {
            console.error("Errore caricamento catalogo", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchCatalog();
    }, [])

    // 2. FUNZIONE CHIAMATA API PASSANDO L'ID
    // Questa scatta solo quando clicchi il bottone
    const handleFetchPanel = async (panelId: string) => {
        if (!panelId) return;

        setIsPanelLoading(true);
        setIsDialogOpen(true);

        try {
            console.log("Fetching panel with ID:", panelId);

            const response = await panelApi.get(`/${panelId}`);
            console.log("Panel data received:", response.data.data);
            setSelectedPanel(response.data.data);
        } catch (error) {
            console.error("Errore caricamento panel specifico", error);
            setSelectedPanel(null);
        } finally {
            setIsPanelLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catalogo Sigari</h1>
                    <p className="text-muted-foreground">Gestisci il tuo inventario prodotti.</p>
                </div>

                {/* MODALE DI AGGIUNTA (Codice esistente invariato) */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus size={18} /> Aggiungi Sigaro</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Aggiungi Nuovo Sigaro</DialogTitle>
                            <DialogDescription>Inserisci i dettagli del prodotto.</DialogDescription>
                        </DialogHeader>
                        {/* ... Form input omessi per brevità come nel tuo codice ... */}
                        <div className="grid gap-4 py-4">
                            {/* Placeholder form */}
                            <div>Form Aggiunta...</div>
                        </div>
                        <DialogFooter><Button type="submit">Salva Sigaro</Button></DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* LISTA SIGARI */}
            {isLoading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {cigars.map((sigaro: Tobacconist) => (
                        <Card key={sigaro.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                                    <Cigarette className="text-amber-700 dark:text-amber-500" size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{sigaro.category}</CardTitle>
                                    <CardDescription>{sigaro.description}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">€ {sigaro.priceKg}</div>
                            </CardContent>
                            <CardFooter>
                                {/* QUI PASSIAMO L'ID:
                                    Controlliamo se il sigaro ha un panelId prima di mostrare il bottone
                                */}
                                {sigaro.panelId ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full gap-2"
                                        onClick={() => handleFetchPanel(sigaro.panelId!)}
                                    >
                                        <Info size={16} /> Vedi Scheda Panel
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="sm" className="w-full" disabled>
                                        Nessun Panel
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* 3. MODALE DETTAGLIO PANEL */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Dettagli Tecnici Panel</DialogTitle>
                        <DialogDescription>Informazioni complete recuperate dal database.</DialogDescription>
                    </DialogHeader>

                    {isPanelLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin h-8 w-8 text-primary" />
                        </div>
                    ) : selectedPanel ? (
                        <div className="grid gap-6 py-4">
                            {/* Intestazione Panel */}
                            <div className="flex justify-between items-start border-b pb-4">
                                <div>
                                    <h3 className="text-2xl font-bold">{selectedPanel.name}</h3>
                                    <p className="text-muted-foreground">{selectedPanel.description}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Rating</div>
                                    <div className="text-xl font-bold text-amber-600">{selectedPanel.rating}/100</div>
                                </div>
                            </div>

                            {/* Griglia Dati Tecnici - PRENDE OGNI VALORE */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">Brand ID</Label>
                                    <div className="font-medium">{selectedPanel.brandId}</div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">Origine</Label>
                                    <div className="font-medium">{selectedPanel.origin}</div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">Forza</Label>
                                    <div className="font-medium">{selectedPanel.strength} / 5</div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">Shape</Label>
                                    <div className="font-medium">{selectedPanel.shape}</div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">Rolling Type</Label>
                                    <div className="font-medium">{selectedPanel.rollingType}</div>
                                </div>

                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground uppercase">Master Line</Label>
                                    <div className="font-medium">{selectedPanel.masterLine}</div>
                                </div>
                            </div>

                            {/* Sezione Composizione */}
                            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                                <h4 className="font-semibold text-sm uppercase tracking-wider">Composizione</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Fascia (Wrapper)</Label>
                                        <div className="font-medium">{selectedPanel.wrapper}</div>
                                        <div className="text-xs text-muted-foreground">Colore: {selectedPanel.wrapperColor}</div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Sottofascia (Binder)</Label>
                                        <div className="font-medium">{selectedPanel.binder}</div>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-muted-foreground">Ripieno (Filler)</Label>
                                        <div className="font-medium">{selectedPanel.filler}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Sezione Commerciale */}
                            <div className="grid grid-cols-3 gap-4 border-t pt-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">Prezzo Listino</Label>
                                    <div className="font-bold text-lg">€ {selectedPanel.price}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Pezzi per Box</Label>
                                    <div className="font-medium">{selectedPanel.numberInBox}</div>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Tipo Prodotto</Label>
                                    <div className="font-medium">{selectedPanel.type}</div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="py-10 text-center text-muted-foreground">
                            Nessun dato trovato per questo ID.
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Chiudi</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
