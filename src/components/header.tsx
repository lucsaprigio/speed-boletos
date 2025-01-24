import Image from "next/image";

export function Header() {
    return (
        <div className="absolute w-full flex items-center py-2 px-10 bg-blue-950 text-gray-50 shadow-md">
            <div className="w-full flex items-end justify-between">
                <Image src="/logo-speed-branco.png" alt="Boletos Speed" width={130} height={30} />
                <h1 className="text-xl font-semibold">Boletos Speed</h1>
                <div></div>
            </div>
        </div>
    );
}