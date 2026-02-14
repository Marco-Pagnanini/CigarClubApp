'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { catalogApi, brandApi } from '@/api/api';

interface AddCigarDialogProps {
    onSuccess?: () => void;
}

interface Brand {
    id: string;
    name: string;
}

const todayIso = () => new Date().toISOString().split('T')[0];

interface TobacconistForm {
    name: string;
    code: string;
    category: string;
    description: string;
    brandId: string;
    priceKg: number;
    stackPrice: number;
    stackType: string;
}

const initialFormState: TobacconistForm = {
    name: '',
    code: '',
    category: '',
    description: '',
    brandId: '',
    priceKg: 0,
    stackPrice: 0,
    stackType: '',
};

export function AddCigarDialog({ onSuccess }: AddCigarDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<TobacconistForm>(initialFormState);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isBrandsLoading, setIsBrandsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) fetchBrands();
    }, [isOpen]);

    const fetchBrands = async () => {
        setIsBrandsLoading(true);
        try {
            const response = await brandApi.get('/');
            setBrands(response.data);
        } catch (err) {
            console.error('Errore nel caricamento dei brand:', err);
        } finally {
            setIsBrandsLoading(false);
        }
    };

    const handleInputChange = (field: keyof TobacconistForm, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const payload = {
                ...formData,
                priceKg: Number(formData.priceKg),
                stackPrice: Number(formData.stackPrice),
                nextPrice: 0,
                nextStackPrice: 0,
                currentPricingValidity: new Date(todayIso()).toISOString(),
                nextPricingValidity: null,
                brandId: formData.brandId || undefined,
            };

            await catalogApi.post('/', payload);

            setFormData(initialFormState);
            setIsOpen(false);
            onSuccess?.();
        } catch (err) {
            console.error('Errore durante la creazione:', err);
            setError('Errore durante la creazione del sigaro. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={18} /> Aggiungi Sigaro</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Aggiungi Nuovo Sigaro</DialogTitle>
                    <DialogDescription>Inserisci i dettagli del prodotto.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Nome */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="es. Cohiba Robustos"
                                required
                            />
                        </div>

                        {/* Codice e Categoria */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="code">Codice *</Label>
                                <Input
                                    id="code"
                                    value={formData.code}
                                    onChange={(e) => handleInputChange('code', e.target.value)}
                                    placeholder="es. SIG001"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria *</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => handleInputChange('category', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleziona categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sigaro">Sigaro</SelectItem>
                                        <SelectItem value="sigaretto">Sigaretto</SelectItem>
                                        <SelectItem value="accessorio">Accessorio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Brand */}
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

                        {/* Descrizione */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrizione</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Descrizione del prodotto..."
                                rows={3}
                            />
                        </div>

                        {/* Prezzi */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="priceKg">Prezzo al Kg (€)</Label>
                                <Input
                                    id="priceKg"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.priceKg}
                                    onChange={(e) => handleInputChange('priceKg', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stackPrice">Prezzo Stack (€)</Label>
                                <Input
                                    id="stackPrice"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.stackPrice}
                                    onChange={(e) => handleInputChange('stackPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Stack Type */}
                        <div className="space-y-2">
                            <Label htmlFor="stackType">Tipo Stack</Label>
                            <Select
                                value={formData.stackType}
                                onValueChange={(value) => handleInputChange('stackType', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleziona tipo stack" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="box">Box</SelectItem>
                                    <SelectItem value="bundle">Bundle</SelectItem>
                                    <SelectItem value="single">Singolo</SelectItem>
                                </SelectContent>
                            </Select>
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
                                'Salva Sigaro'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
