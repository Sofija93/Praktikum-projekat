import Forme from "@/app/components/Forme";
import Pagination from "@/app/components/Pagination";
import Tabela from "@/app/components/Tabela";
import TabelaPretrage from "@/app/components/TabelaPretrage";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import Image from "next/image"
import { Prisma, Novosti, Razred } from ".prisma/client";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import FormeContainer from "@/app/components/FormeContainer";

type Objava = Novosti & { razred: Razred };

const Objava = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

const { userId, sessionClaims} = await auth();
const role = (sessionClaims?.metadata as { role?:string})?.role;
const currentUserId = userId;

const columns = [
    {
        header: "Naslov", accessor: "naziv"
    },
    {
        header: "Razred", accessor: "razred"
    },
    {
        header: "Datum", accessor: "datum", className: "hidden md:table-cell"
    },
    ...(role === "admin" ? [{
        header: "Dogadjaj", accessor: "dogadjaj"
    }] : []),
];

const renderRow = (item: Objava) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            {item.naziv}
        </td>
        <td >{item.razred?.ime || "-"}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.datum)}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormeContainer table="objava" type="update" data={item} />
                        <FormeContainer table="objava" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    // url params condition

    const query: Prisma.NovostiWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.naziv = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const roleConditions = {
        profesor: { lekcije: { some: { profesorId: currentUserId! } } },
        ucenik: { ucenici: { some: { id: currentUserId! } } },
        roditelj: { ucenici: { some: { roditeljId: currentUserId! } } },
    }
        // For testing, show all events:
    // Remove or comment out the restrictive OR query
    // query.OR = [{ razredId: null}, {
    //    razred: roleConditions[role as keyof typeof roleConditions] || {}
    // }]

    query.OR = undefined

    const [data, count] = await prisma.$transaction([
        prisma.novosti.findMany({
            where: query,
            include: {
                razred: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.novosti.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/*TOP*/}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Novosti</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TabelaPretrage />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={30} height={30} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={30} height={30} />
                        </button>
                        {role === 'admin' && (
                            <FormeContainer table="objava" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/*LIST*/}
            <Tabela columns={columns} renderRow={renderRow} data={data} />
            {/*PAGINATION*/}
            <Pagination page={p} count={count} />

        </div>
    )
}

export default Objava;