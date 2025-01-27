import Image from "next/image";

export function Header() {
    return (
        <div className="w-full flex items-center py-2 bg-blue-950 text-gray-50 shadow-md">
            <div className="w-full flex items-end justify-center">
                <Image src="/logo-speed-branco.png" alt="Boletos Speed" width={130} height={30} />
            </div>
        </div>
    );
}