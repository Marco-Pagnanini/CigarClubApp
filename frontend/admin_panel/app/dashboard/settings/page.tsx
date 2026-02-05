import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// Se serve separator: npx shadcn@latest add separator

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Impostazioni</h1>
                <p className="text-muted-foreground">Gestisci le preferenze del tuo account e della dashboard.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profilo Amministratore</CardTitle>
                    <CardDescription>Aggiorna le tue informazioni personali.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Aziendale</Label>
                        <Input id="email" defaultValue="admin@cigarmanager.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Nuova Password</Label>
                        <Input id="password" type="password" />
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-end">
                        <Button>Salva Modifiche</Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Preferenze Applicazione</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Altre impostazioni verranno aggiunte qui...</p>
                </CardContent>
            </Card>
        </div>
    );
}
