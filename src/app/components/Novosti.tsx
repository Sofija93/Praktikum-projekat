import { auth } from "@clerk/nextjs/server";
import { prisma } from "../lib/prisma";

const Novosti = async () => {

    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    const roleConditions = {
        profesor: { lekcije: { some: { profesorId: userId! } } },
        ucenik: { ucenici: { some: { id: userId! } } },
        roditelj: { ucenici: { some: { roditeljId: userId! } } },
    }

    const data = await prisma.novosti.findMany({
        take: 3,
        orderBy: { datum: 'desc' },
        where: {
            ...(role !== "admin" && {
                OR: [
                    { razredId: 0 },
                    { razred: roleConditions[role as keyof typeof roleConditions] || {} }
                ]
            })
        },
    });


    return (
        <div className='bg-white p-4 rounded-md'>
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Novosti</h1>
                <span className="text-xs text-gray-400 ">View All</span>
            </div>
            <div className="flex flex-col gap-4 mt-4">
                {data[0] && <div className="bg-sSkyLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">{data[0].naziv}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                            {new Intl.DateTimeFormat("en-GB").format(data[0].datum)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{data[0].opis}</p>
                </div>}
                {data[1] && <div className="bg-sPurpleLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">{data[1].naziv}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                            {new Intl.DateTimeFormat("en-GB").format(data[1].datum)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{data[1].opis}</p>
                </div>}
                {data[2] && <div className="bg-sYellowLight rounded-md p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">{data[2].naziv}</h2>
                        <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                            {new Intl.DateTimeFormat("en-GB").format(data[2].datum)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{data[2].opis}</p>
                </div>}
            </div>

        </div>
    )
}

export default Novosti