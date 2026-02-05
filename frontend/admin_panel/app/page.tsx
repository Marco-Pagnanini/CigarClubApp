"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { userApi, setToken } from "@/api/api"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
export default function Home() {

    const router = useRouter();
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleLogin = async () => {
        userApi.post("/auth/login", {
            email,
            password,
        })
            .then((response) => {
                setEmail("");
                console.log("Login successful:", response.data);
                // Salva il JWT token
                if (response.data.accessToken) {
                    setToken(response.data.accessToken);
                }
                router.push('/dashboard');
            })
            .catch((error) => {
                console.error("Login failed:", error.response?.data || error.message);
            });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">

            {/* Inizio della Card shadcn */}
            <Card className="w-full max-w-sm shadow-lg">

                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold" >Accedi</CardTitle>
                    <CardDescription>
                        Inserisci la tua email e password per entrare.
                    </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                    {/* Gruppo Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="nome@esempio.com"
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    {/* Gruppo Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handleLogin}>Accedi</Button>

                    <p className="mt-2 text-xs text-center text-muted-foreground">
                        Password dimenticata?
                    </p>
                </CardFooter>

            </Card>
            {/* Fine della Card */}

        </div>
    );
}
