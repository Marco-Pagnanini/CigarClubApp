'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { PanelData } from '@/types/panel';

interface PanelDetailsModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    isLoading: boolean;
    panel: PanelData | null;
    brandName: string | null;
}

export function PanelDetailsModal({ isOpen, onClose, isLoading, panel, brandName }: PanelDetailsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Dettagli Tecnici Panel</DialogTitle>
                    <DialogDescription>Informazioni complete recuperate dal database.</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    </div>
                ) : panel ? (
                    <div className="grid gap-6 py-4">
                        {/* Intestazione */}
                        <div className="flex justify-between items-start border-b pb-4">
                            <div>
                                <h3 className="text-2xl font-bold">{panel.name}</h3>
                                <p className="text-muted-foreground">{panel.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-muted-foreground">Rating</div>
                                <div className="text-xl font-bold text-amber-600">{panel.rating}/100</div>
                            </div>
                        </div>

                        {/* Griglia Dati Tecnici */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                            <InfoItem label="Brand" value={brandName || panel.brandId} />
                            <InfoItem label="Origine" value={panel.origin} />
                            <InfoItem label="Forza" value={`${panel.strength} / 5`} />
                            <InfoItem label="Shape" value={panel.shape} />
                            <InfoItem label="Rolling Type" value={panel.rollingType} />
                            <InfoItem label="Master Line" value={panel.masterLine} />
                        </div>

                        {/* Composizione */}
                        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                            <h4 className="font-semibold text-sm uppercase tracking-wider">Composizione</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <CompositionItem label="Fascia (Wrapper)" value={panel.wrapper} sub={`Colore: ${panel.wrapperColor}`} />
                                <CompositionItem label="Sottofascia (Binder)" value={panel.binder} />
                                <CompositionItem label="Ripieno (Filler)" value={panel.filler} />
                            </div>
                        </div>

                        {/* Commerciale */}
                        <div className="grid grid-cols-3 gap-4 border-t pt-4">
                            <InfoItem label="Prezzo Listino" value={`€ ${panel.price}`} isBold />
                            <InfoItem label="Pezzi per Box" value={panel.numberInBox} />
                            <InfoItem label="Tipo Prodotto" value={panel.type} />
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-muted-foreground">
                        Nessun dato trovato.
                    </div>
                )}

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onClose(false)}>Chiudi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Piccoli componenti helper interni per tenere il codice pulito
const InfoItem = ({ label, value, isBold }: { label: string, value: string | number, isBold?: boolean }) => (
    <div className="space-y-1">
        <Label className="text-xs text-muted-foreground uppercase">{label}</Label>
        <div className={`font-medium ${isBold ? 'text-lg font-bold' : ''}`}>{value}</div>
    </div>
);

const CompositionItem = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
    <div>
        <Label className="text-xs text-muted-foreground">{label}</Label>
        <div className="font-medium">{value}</div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
    </div>
);
