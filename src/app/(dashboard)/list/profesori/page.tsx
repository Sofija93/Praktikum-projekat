
import Pagination from "@/app/components/Pagination"
import Tabela from "@/app/components/Tabela"
import TabelaPretrage from "@/app/components/TabelaPretrage"
import { Prisma, Predmet, Profesor, Razred } from ".prisma/client";
import { prisma } from "@/app/lib/prisma"
import { ITEM_PER_PAGE } from "@/app/lib/settings"
import Image from "next/image"
import Link from "next/link"
import FormeContainer from "@/app/components/FormeContainer";
import { auth } from "@clerk/nextjs/server";

type ProfesoriLista = Profesor & { predmeti: Predmet[] } & { razredi: Razred[] }

const { userId, sessionClaims} = await auth();
const role = (sessionClaims?.metadata as { role?:string})?.role;
const currentUserId = userId;

const columns = [
    {
        header: "Info", accessor: "info"
    },
    {
        header: "Profesor ID", accessor: "profesorId", className: "hidden md:table-cell",
    },
    {
        header: "Predmeti", accessor: "predmeti", className: "hidden md:table-cell",
    },
    {
        header: "Razredi", accessor: "razredi", className: "hidden md:table-cell",
    },
    {
        header: "Telefon", accessor: "telefon", className: "hidden lg:table-cell",
    },
    {
        header: "Adresa", accessor: "adresa", className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Dogadjaj", accessor: "dogadjaj"
    }] : []),

]

const renderRow = (item: ProfesoriLista) => (
    <tr key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-sPurpleLight">
        <td className="flex items-center gap-4 p-4">
            <Image src={item.img || "/noAvatar.png"} alt="" width={40} height={40}
                className="md:hidden xl:block w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col">
                <h3 className="font-semibold">{item.ime}</h3>
                <p className="text-xs text-gray-500">{item?.email}</p>
            </div>
        </td>
        <td className="hidden md:table-cell">{item.username}</td>
        <td className="hidden md:table-cell">{item.predmeti.map(predmet => predmet.ime).join(",")}</td>
        <td className="hidden md:table-cell">{item.razredi.map(razred => razred.ime).join(" ,")}</td>
        <td className="hidden md:table-cell">{item.telefon}</td>
        <td className="hidden md:table-cell">{item.adresa}</td>
        <td>
            <div className="flex items-center gap-2">
                <Link href={`/list/profesori/${item.id}`}>
                    <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sSky">
                        <Image src="/view.png" alt="" width={16} height={16} />
                    </button>
                </Link>
                {role === "admin" && (
                    <FormeContainer table="profesor" type="delete" id={item.id} />
                )}
            </div>
        </td>
    </tr>
)

const Profesori = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.ProfesorWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined && value !== "") {
                switch (key) {
                    case "razredId":
                        query.lekcije = { some: { razredId: parseInt(value) } };
                        break;
                    case "search":
                        query.ime = { contains: value, mode: "insensitive" };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([

        prisma.profesor.findMany({
            where: query,
            include: {
                predmeti: true,
                razredi: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.profesor.count(
            { where: query }
        )
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/*TOP*/}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Profesori</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TabelaPretrage />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-sYellow">
                            <Image src="/filter.png" alt="" width={30} height={30} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full">
                            <Image src="/sort.png" alt="" width={30} height={30} />
                        </button>
                        {role === 'admin' && (
                            <FormeContainer table="profesor" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/*LIST*/}
            <Tabela columns={columns} renderRow={renderRow} data={data} />
            {/*PAGINATION*/}
            <Pagination page={p} count={count} />
        </div>
    );
};

export default Profesori