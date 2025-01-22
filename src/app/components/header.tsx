import Image from "next/image";

export function Header() {
    return (
        <div className="flex items-center justify-between py-2 px-12 bg-blue-950 text-gray-50 shadow-md">
            <div className="flex items-center justify-center space-x-12">
                <Image src="/logo-speed-branco.png" alt="Boletos Speed" width={150} height={50} />
                <h1 className="text-xl font-semibold">Boletos Speed</h1>
            </div>
        </div>
    );
}