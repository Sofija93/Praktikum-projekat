import Pagination from "@/app/components/Pagination";
import Tabela from "@/app/components/Tabela";
import TabelaPretrage from "@/app/components/TabelaPretrage";
import { prisma } from "@/app/lib/prisma";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Prisma } from ".prisma/client";
import Image from "next/image"
import FormeContainer from "@/app/components/FormeContainer";
import { auth } from "@clerk/nextjs/server";

type Rezultati = {
    id: number;
    naziv: string;
    ucenikIme: string;
    ucenikPrezime: string;
    profesorIme: string;
    profesorPrezime: string;
    rezultat: number;
    razredIme: string;
    pocetak: Date;
}

const { userId, sessionClaims} = await auth();
const role = (sessionClaims?.metadata as { role?:string})?.role;
const currentUserId = userId;

const columns = [
    {
        header: "Naziv", accessor: "naziv"
    },
    {
        header: "Ucenik", accessor: "ucenik"
    },
    {
        header: "Rezultat", accessor: "rezultat", className: "hidden md:table-cell"
    },
    {
        header: "Razred", accessor: "razred", className: "hidden md:table-cell"
    },
    {
        header: "Profesor", accessor: "profesor", className: "hidden md:table-cell"
    },
    {
        header: "Datum", accessor: "datum", className: "hidden md:table-cell"
    },
    ...(role === "admin" || role === "profesor" ? [{
        header: "Dogadjaj", accessor: "dogadjaj"
    }] : []),

]

const renderRow = (item: Rezultati) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            {item.naziv}
        </td>
        <td >{item.ucenikIme + " " + item.ucenikPrezime}</td>
        <td className="hidden md:table-cell">{item.rezultat}</td>
        <td className="hidden md:table-cell">{item.razredIme}</td>
        <td className="hidden md:table-cell">{item.profesorIme + " " + item.profesorPrezime}</td>
        <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-US").format(item.pocetak)}</td>
        <td>
            <div className="flex items-center gap-2">
                {(role === "admin" || role === "profesor") && (
                    <>
                        <FormeContainer table="rezultat" type="update" data={item} />
                        <FormeContainer table="rezultat" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const Rezultati = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.RezultatWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "ucenikId":
                        query.ucenikId = value;
                        break;
                    case "search":
                        query.OR = [
                            { ispit: { naziv: { contains: value, mode: "insensitive" } } },
                            { ucenik: { ime: { contains: value, mode: "insensitive" } } }
                        ]
                        break;
                    default:
                        break;
                }
            }
        }
    }

    switch (role) {
        case "admin":   
            break;
        case "profesor":
            query.OR = [
                { ispit: { lekcija: { profesorId: currentUserId! } } },
                { zadatak: { lekcija: { profesorId: role } } }
            ];
            break;
        case "ucenik":
            query.ucenikId = currentUserId!;
            break;
        case "roditelj":
            query.ucenik = {
                roditeljId: currentUserId!
            };
        default:
            break;
    }

    const [dataOdg, count] = await prisma.$transaction([
        prisma.rezultat.findMany({
            where: query,
            include: {
                ucenik: { select: { ime: true, prezime: true } },
                ispit: {
                    include: {
                        lekcija: {
                            select: {
                                razred: { select: { ime: true } },
                                profesor: { select: { ime: true, prezime: true } }
                            }
                        }
                    }
                },
                zadatak: {
                    include: {
                        lekcija: {
                            select: {
                                razred: { select: { ime: true } },
                                profesor: { select: { ime: true, prezime: true } }
                            }
                        }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.rezultat.count({ where: query }),
    ]);

    const data = dataOdg.map((item: any) => {
        const procena = item.ispit || item.zadatak;

        if (!procena) return null;

        const jeIspit = "pocetak" in procena;

        return {
            id: item.id,
            naziv: procena.naziv,
            ucenikIme: item.ucenik.ime,
            ucenikPrezime: item.ucenik.prezime,
            profesorIme: procena.lekcija.profesor.ime,
            profesorPrezime: procena.lekcija.profesor.prezime,
            rezultat: item.rezultat,
            razredIme: procena.lekcija.razred.ime,
            pocetak: jeIspit ? item.ispit?.pocetak : undefined,
        }
    })
    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Rezultati</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TabelaPretrage />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={30} height={30} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={30} height={30} />
                        </button>
                        {(role === 'admin' || role === "profesor") && (
                            <FormeContainer table="rezultat" type="create" />
                        )}
                    </div>
                </div>
            </div>
            
            <Tabela columns={columns} renderRow={renderRow} data={data} />
            
            <Pagination page={p} count={count} />

        </div>
    )
}

export default Rezultati;