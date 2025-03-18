'use client'
import { QRCodeCanvas } from "qrcode.react";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import Link from "next/link";
import { WhatsappLogo } from "@phosphor-icons/react";

export function QRCodeWhatsapp() {
    const phoneNumber = "552731209858";
    const whatsappLink = `https://wa.me/${phoneNumber}`;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default">Enviar comprovante</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center sm:max-w-[425px]">
                <DialogTitle>
                    <span>Escaneie para abrir no WhatsApp</span>
                </DialogTitle>
                <div className="flex flex-col space-y-6 items-center">
                    <QRCodeCanvas value={whatsappLink} size={200} />
                    <Link className="flex items-center justify-center gap-1 font-bold text-blue-900 hover:brightness-75 transition-all" href={whatsappLink} target="_blank">
                        <WhatsappLogo size={24}/>
                        Whatsapp
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}