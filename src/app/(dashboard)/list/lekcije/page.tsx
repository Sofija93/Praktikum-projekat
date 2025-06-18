import Pagination from "@/app/components/Pagination";
import Tabela from "@/app/components/Tabela";
import TabelaPretrage from "@/app/components/TabelaPretrage";
import { prisma } from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Lekcija, Predmet, Prisma, Profesor, Razred } from ".prisma/client";
import Image from "next/image"
import FormeContainer from "@/app/components/FormeContainer";
import { auth } from "@clerk/nextjs/server";

type Lekcije = Lekcija & { predmet: Predmet } & { razred: Razred } & { profesor: Profesor };

const { userId, sessionClaims} = await auth();
const role = (sessionClaims?.metadata as { role?:string})?.role;
const currentUserId = userId;

const columns = [
    {
        header: "Predmet", accessor: "ime"
    },
    {
        header: "Razred", accessor: "razred"
    },
    {
        header: "Profesor", accessor: "profesor", className: "hidden md:table-cell"
    },
    ...(role === "admin" ? [{
        header: "Dogadjaj", accessor: "dogadjaj"
    }] : []),
]

const renderRow = (item: Lekcije) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            {item.predmet.ime}
        </td>
        <td>{item.razred.ime}</td>
        <td className="hidden md:table-cell">{item.profesor.ime + " " + item.profesor.prezime}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormeContainer table="lekcija" type="update" data={item} />
                        <FormeContainer table="lekcija" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const Lekcije = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.LekcijaWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "razredId":
                        query.razredId = parseInt(value)
                        break;
                    case "profesorId":
                        query.profesorId = value
                        break;
                    case "search":
                        query.OR = [
                            { predmet: { ime: { contains: value, mode: "insensitive" } } },
                            { profesor: { ime: { contains: value, mode: "insensitive" } } }
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.lekcija.findMany({
            where: query,
            include: {
                predmet: { select: { ime: true } },
                razred: { select: { ime: true } },
                profesor: { select: { ime: true, prezime: true } }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.lekcija.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/*TOP*/}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Lekcije</h1>
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
                            <FormeContainer table="lekcija" type="create" />
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

export default Lekcije;