import Forme from "@/app/components/Forme";
import Pagination from "@/app/components/Pagination";
import Tabela from "@/app/components/Tabela";
import TabelaPretrage from "@/app/components/TabelaPretrage";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Prisma, Dogadjaj, Razred } from ".prisma/client";
import { prisma } from "@/app/lib/prisma";
import Image from "next/image"
import FormeContainer from "@/app/components/FormeContainer";
import { auth } from "@clerk/nextjs/server";


type Event = Dogadjaj & { razred: Razred };

const { userId, sessionClaims} = await auth();
const role = (sessionClaims?.metadata as { role?:string})?.role;
const currentUserId = userId;

const columns = [
    {
        header: "Naziv", accessor: "naziv"
    },
    {
        header: "Razred", accessor: "razred"
    },
    {
        header: "Datum", accessor: "datum", className: "hidden md:table-cell"
    },
    {
        header: "Pocetak", accessor: "pocetak", className: "hidden md:table-cell"
    },
    {
        header: "Kraj", accessor: "kraj", className: "hidden md:table-cell"
    },
    ...(role === "admin" ? [{
        header: "Dogadjaj", accessor: "dogadjaj"
    }] : []),
]

const renderRow = (item: Event) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            {item.naziv}
        </td>
        <td >{item.razred?.ime || "-"}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.pocetak)}</td>
        <td className="hidden md:table-cell">{item.pocetak.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</td>
        <td className="hidden md:table-cell">{item.kraj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, })}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormeContainer table="event" type="update" data={item} />
                        <FormeContainer table="event" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const Event = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;
    const query: Prisma.DogadjajWhereInput = {};
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
    //     razred: roleConditions[role as keyof typeof roleConditions] || {}
    // }]
    query.OR = undefined

    const [data, count] = await prisma.$transaction([
        prisma.dogadjaj.findMany({
            where: query,
            include: {
                razred: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.dogadjaj.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/*TOP*/}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Dogadjaji</h1>
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
                            <FormeContainer table="event" type="create" />
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

export default Event;