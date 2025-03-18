'use client'

import { FilePdf, PixLogo } from "@phosphor-icons/react";
import { ButtonHTMLAttributes, useEffect } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    price?: number;
}

function ButtonPdf({ ...rest }: ButtonProps) {
    return (
        <button {...rest}>
            <FilePdf className="text-red-800" size={24} />
        </button>
    )
}

function ButtonPix({ price, ...rest }: ButtonProps) {
    return (
        <button {...rest}>
            <PixLogo className="text-cyan-400" size={24} />
        </button>
    )
}

export { ButtonPdf, ButtonPix };