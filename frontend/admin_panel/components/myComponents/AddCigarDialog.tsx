'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddCigarDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={18} /> Aggiungi Sigaro</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Aggiungi Nuovo Sigaro</DialogTitle>
                    <DialogDescription>Inserisci i dettagli del prodotto.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Qui metterai i tuoi Input e Label come nel codice originale */}
                    <div>Form Aggiunta...</div>
                </div>

                <DialogFooter>
                    <Button type="submit">Salva Sigaro</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
