'use client'

import { FilePdf, PixLogo } from "@phosphor-icons/react";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = & ButtonHTMLAttributes<HTMLButtonElement>

function ButtonPdf({ ...rest }: ButtonProps) {
    return (
        <button {...rest}>
            <FilePdf className="text-red-800" size={24} />
        </button>
    )
}

function ButtonPix({ ...rest }: ButtonProps) {
    return (
        <button {...rest}>
            <PixLogo className="text-cyan-400" size={24} />
        </button>
    )
}

export { ButtonPdf, ButtonPix };