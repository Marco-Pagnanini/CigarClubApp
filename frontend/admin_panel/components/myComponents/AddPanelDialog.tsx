'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { panelApi, brandApi } from '@/api/api';

interface AddPanelDialogProps {
    tobacconistId: string;
    tobacconistCode?: string;
    onSuccess?: () => void;
}

interface Brand {
    id: string;
    name: string;
}

interface PanelForm {
    name: string;
    brandId: string;
    description: string;
    origin: string;
    strength: number | null;
    wrapper: string;
    wrapperColor: number | null;
    binder: string;
    filler: string;
    masterLine: string;
    rollingType: string;
    shape: string;
    price: number | null;
    rating: number | null;
    numberInBox: number | null;
    ring: number | null;
    smokingTime: number | null;
    type: number | null;
}

const initialFormState: PanelForm = {
    name: '',
    brandId: '',
    description: '',
    origin: '',
    strength: null,
    wrapper: '',
    wrapperColor: null,
    binder: '',
    filler: '',
    masterLine: '',
    rollingType: '',
    shape: '',
    price: null,
    rating: null,
    numberInBox: null,
    ring: null,
    smokingTime: null,
    type: null,
};

export function AddPanelDialog({ tobacconistId, tobacconistCode, onSuccess }: AddPanelDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<PanelForm>(initialFormState);

    // Stato per i brand
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isBrandsLoading, setIsBrandsLoading] = useState(false);

    // Carica i brand quando si apre il dialog
    useEffect(() => {
        if (isOpen) {
            fetchBrands();
        }
    }, [isOpen]);

    const fetchBrands = async () => {
        setIsBrandsLoading(true);
        try {
            const response = await brandApi.get('/');
            // La risposta è direttamente un array
            setBrands(response.data);
        } catch (err) {
            console.error('Errore nel caricamento dei brand:', err);
        } finally {
            setIsBrandsLoading(false);
        }
    };

    const handleInputChange = (field: keyof PanelForm, value: string | number | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Costruisce il payload secondo la struttura del backend (CreatePanelDto)
            const payload = {
                name: formData.name,
                brandId: formData.brandId,
                tobacconistId: tobacconistId || null,
                tobacconistCode: tobacconistCode || null,
                description: formData.description || null,
                origin: formData.origin || null,
                strength: formData.strength,
                wrapper: formData.wrapper || null,
                wrapperColor: formData.wrapperColor,
                binder: formData.binder || null,
                filler: formData.filler || null,
                masterLine: formData.masterLine || null,
                rollingType: formData.rollingType || null,
                shape: formData.shape || null,
                price: formData.price,
                rating: formData.rating,
                numberInBox: formData.numberInBox,
                ring: formData.ring,
                smokingTime: formData.smokingTime,
                type: formData.type,
            };

            console.log('Payload inviato:', JSON.stringify(payload, null, 2));
            await panelApi.post('/', payload);

            setFormData(initialFormState);
            setIsOpen(false);
            onSuccess?.();
        } catch (err) {
            console.error('Errore durante la creazione del panel:', err);
            setError('Errore durante la creazione del panel. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                    <Plus size={16} /> Aggiungi Panel
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Aggiungi Nuovo Panel</DialogTitle>
                    <DialogDescription>Inserisci i dettagli della scheda prodotto.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Nome e Brand */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Nome del sigaro"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="brandId">Brand *</Label>
                                <Select
                                    value={formData.brandId}
                                    onValueChange={(value) => handleInputChange('brandId', value)}
                                    disabled={isBrandsLoading}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={isBrandsLoading ? "Caricamento..." : "Seleziona brand"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Descrizione */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrizione</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Descrizione del sigaro..."
                                rows={3}
                            />
                        </div>

                        {/* Origine e Forza */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="origin">Origine</Label>
                                <Input
                                    id="origin"
                                    value={formData.origin}
                                    onChange={(e) => handleInputChange('origin', e.target.value)}
                                    placeholder="es. Cuba, Nicaragua"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="strength">Forza</Label>
                                <Select
                                    value={formData.strength?.toString() ?? ''}
                                    onValueChange={(value) => handleInputChange('strength', value ? parseInt(value) : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona forza" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Mild</SelectItem>
                                        <SelectItem value="1">Medium</SelectItem>
                                        <SelectItem value="2">Full</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Wrapper e Colore */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="wrapper">Wrapper</Label>
                                <Input
                                    id="wrapper"
                                    value={formData.wrapper}
                                    onChange={(e) => handleInputChange('wrapper', e.target.value)}
                                    placeholder="Tipo di fascia"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wrapperColor">Colore Wrapper</Label>
                                <Select
                                    value={formData.wrapperColor?.toString() ?? ''}
                                    onValueChange={(value) => handleInputChange('wrapperColor', value ? parseInt(value) : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona colore" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Claro</SelectItem>
                                        <SelectItem value="1">Colorado</SelectItem>
                                        <SelectItem value="2">Maduro</SelectItem>
                                        <SelectItem value="3">Oscuro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Binder e Filler */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="binder">Binder</Label>
                                <Input
                                    id="binder"
                                    value={formData.binder}
                                    onChange={(e) => handleInputChange('binder', e.target.value)}
                                    placeholder="Sottofascia"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="filler">Filler</Label>
                                <Input
                                    id="filler"
                                    value={formData.filler}
                                    onChange={(e) => handleInputChange('filler', e.target.value)}
                                    placeholder="Ripieno"
                                />
                            </div>
                        </div>

                        {/* Master Line e Rolling Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="masterLine">Master Line</Label>
                                <Input
                                    id="masterLine"
                                    value={formData.masterLine}
                                    onChange={(e) => handleInputChange('masterLine', e.target.value)}
                                    placeholder="Linea principale"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rollingType">Tipo Rollatura</Label>
                                <Input
                                    id="rollingType"
                                    value={formData.rollingType}
                                    onChange={(e) => handleInputChange('rollingType', e.target.value)}
                                    placeholder="es. Handmade, Machine Made"
                                />
                            </div>
                        </div>

                        {/* Shape e Type */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="shape">Forma</Label>
                                <Input
                                    id="shape"
                                    value={formData.shape}
                                    onChange={(e) => handleInputChange('shape', e.target.value)}
                                    placeholder="es. Robusto, Toro, Churchill"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo</Label>
                                <Select
                                    value={formData.type?.toString() ?? ''}
                                    onValueChange={(value) => handleInputChange('type', value ? parseInt(value) : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Premium</SelectItem>
                                        <SelectItem value="1">Toscano</SelectItem>
                                        <SelectItem value="2">Machine Made</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Prezzo e Rating */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Prezzo</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.price ?? ''}
                                    onChange={(e) => handleInputChange('price', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (0-100)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={formData.rating ?? ''}
                                    onChange={(e) => handleInputChange('rating', e.target.value ? parseFloat(e.target.value) : null)}
                                />
                            </div>
                        </div>

                        {/* Number in Box, Ring, Smoking Time */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="numberInBox">Pezzi per Box</Label>
                                <Input
                                    id="numberInBox"
                                    type="number"
                                    min="0"
                                    value={formData.numberInBox ?? ''}
                                    onChange={(e) => handleInputChange('numberInBox', e.target.value ? parseInt(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ring">Ring Gauge</Label>
                                <Input
                                    id="ring"
                                    type="number"
                                    min="0"
                                    value={formData.ring ?? ''}
                                    onChange={(e) => handleInputChange('ring', e.target.value ? parseInt(e.target.value) : null)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="smokingTime">Tempo Fumata (min)</Label>
                                <Input
                                    id="smokingTime"
                                    type="number"
                                    min="0"
                                    value={formData.smokingTime ?? ''}
                                    onChange={(e) => handleInputChange('smokingTime', e.target.value ? parseInt(e.target.value) : null)}
                                />
                            </div>
                        </div>

                        {/* Errore */}
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Annulla
                        </Button>
                        <Button type="submit" disabled={isLoading || !formData.brandId}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Salvataggio...
                                </>
                            ) : (
                                'Salva Panel'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
