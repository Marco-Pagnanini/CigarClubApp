'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cigarette, Info } from "lucide-react";
import { Tobacconist } from '@/types/tobacconist';
import { AddPanelDialog } from './AddPanelDialog';

interface CigarCardProps {
    sigaro: Tobacconist;
    onViewPanel: (panelId: string) => void;
    onPanelAdded?: () => void;
}

export function CigarCard({ sigaro, onViewPanel, onPanelAdded }: CigarCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow flex flex-col justify-between">
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
                {sigaro.panelId ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => onViewPanel(sigaro.panelId!)}
                    >
                        <Info size={16} /> Vedi Scheda Panel
                    </Button>
                ) : (
                    <AddPanelDialog
                        tobacconistId={sigaro.id}
                        onSuccess={onPanelAdded}
                    />
                )}
            </CardFooter>
        </Card>
    );
}
