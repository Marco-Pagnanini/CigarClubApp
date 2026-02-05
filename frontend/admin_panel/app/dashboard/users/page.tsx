"use client"

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { catalogApi, userApi } from "@/api/api";
// Se non hai avatar: npx shadcn@latest add avatar

const MOCK_UTENTI = [
    { id: 1, nome: "Mario Rossi", email: "mario@azienda.com", ruolo: "Amministratore", iniziali: "MR" },
    { id: 2, nome: "Luca Bianchi", email: "luca@cliente.com", ruolo: "Cliente", iniziali: "LB" },
    { id: 3, nome: "Giulia Verdi", email: "giulia@cliente.com", ruolo: "Cliente", iniziali: "GV" },
    { id: 4, nome: "Marco Neri", email: "marco@cliente.com", ruolo: "Cliente", iniziali: "MN" },
];

export default function UsersPage() {
    const [users, setusers] = useState([])

    const fetchUsers = async () => {
        try {
            const response = await userApi.get('/users');
            setusers(response.data);
        } catch (error) {
            console.error("Errore caricamento utenti", error);
        } finally {
        }
    }


    useEffect(() => {

        fetchUsers();
    }, []);


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Utenti</h1>
                    <p className="text-muted-foreground">Lista degli utenti registrati alla piattaforma.</p>
                </div>
                <Button>Esporta Lista</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((utente: any, index: number) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <Avatar>
                                <AvatarFallback>{utente.name}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                                <CardTitle className="text-base">{utente.nome}</CardTitle>
                                <CardDescription>{utente.ruolo}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{utente.email}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="secondary" size="sm" className="w-full">Gestisci Utente</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
