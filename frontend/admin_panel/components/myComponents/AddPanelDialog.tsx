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
    strength: number;
    wrapper: string;
    wrapperColor: number;
    binder: string;
    filler: string;
    masterLine: string;
    rollingType: string;
    shape: string;
    price: number;
    rating: number;
    numberInBox: number;
    type: number;
}

const initialFormState: PanelForm = {
    name: '',
    brandId: '',
    description: '',
    origin: '',
    strength: 0,
    wrapper: '',
    wrapperColor: 0,
    binder: '',
    filler: '',
    masterLine: '',
    rollingType: '',
    shape: '',
    price: 0,
    rating: 0,
    numberInBox: 0,
    type: 0,
};

export function AddPanelDialog({ tobacconistId, onSuccess }: AddPanelDialogProps) {
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
            // Adatta in base alla struttura della risposta del backend
            const brandsData = response.data.data || response.data;
            setBrands(brandsData);
        } catch (err) {
            console.error('Errore nel caricamento dei brand:', err);
        } finally {
            setIsBrandsLoading(false);
        }
    };

    const handleInputChange = (field: keyof PanelForm, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                tobacconistId,
                strength: Number(formData.strength),
                wrapperColor: Number(formData.wrapperColor),
                price: Number(formData.price),
                rating: Number(formData.rating),
                numberInBox: Number(formData.numberInBox),
                type: Number(formData.type),
            };

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
                                <Label htmlFor="strength">Forza (1-10)</Label>
                                <Input
                                    id="strength"
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.strength}
                                    onChange={(e) => handleInputChange('strength', e.target.value)}
                                />
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
                                    value={formData.wrapperColor.toString()}
                                    onValueChange={(value) => handleInputChange('wrapperColor', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona colore" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Claro</SelectItem>
                                        <SelectItem value="1">Colorado Claro</SelectItem>
                                        <SelectItem value="2">Colorado</SelectItem>
                                        <SelectItem value="3">Colorado Maduro</SelectItem>
                                        <SelectItem value="4">Maduro</SelectItem>
                                        <SelectItem value="5">Oscuro</SelectItem>
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
                                <Select
                                    value={formData.rollingType}
                                    onValueChange={(value) => handleInputChange('rollingType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="handmade">Handmade</SelectItem>
                                        <SelectItem value="machine">Machine Made</SelectItem>
                                        <SelectItem value="mixed">Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                    value={formData.type.toString()}
                                    onValueChange={(value) => handleInputChange('type', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Sigaro</SelectItem>
                                        <SelectItem value="1">Sigaretto</SelectItem>
                                        <SelectItem value="2">Accessorio</SelectItem>
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
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rating">Rating (0-100)</Label>
                                <Input
                                    id="rating"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.rating}
                                    onChange={(e) => handleInputChange('rating', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Number in Box */}
                        <div className="space-y-2">
                            <Label htmlFor="numberInBox">Numero nella Scatola</Label>
                            <Input
                                id="numberInBox"
                                type="number"
                                min="0"
                                value={formData.numberInBox}
                                onChange={(e) => handleInputChange('numberInBox', e.target.value)}
                            />
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
                        <Button type="submit" disabled={isLoading}>
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
