import Pagination from "@/app/components/Pagination";
import Tabela from "@/app/components/Tabela";
import TabelaPretrage from "@/app/components/TabelaPretrage";
import { ITEM_PER_PAGE } from "@/app/lib/settings";
import { Prisma, Predmet, Profesor } from ".prisma/client";
import { prisma } from "@/app/lib/prisma";
import Image from "next/image"
import FormeContainer from "@/app/components/FormeContainer";
import { auth } from "@clerk/nextjs/server";

type Predmeti = Predmet & { profesori: Profesor[] }

const { userId, sessionClaims} = await auth();
const role = (sessionClaims?.metadata as { role?:string})?.role;
const currentUserId = userId;

const columns = [
    {
        header: "Predmet", accessor: "ime"
    },
    {
        header: "Profesori", accessor: "profesori", className: "hidden md:table-cell",
    },
    ...(role === "admin" ? [{
        header: "Dogadjaj", accessor: "dogadjaj"
    }] : []),

]

const renderRow = (item: Predmeti) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
        <td className="flex items-center gap-4 p-4">
            {item.ime}
        </td>
        <td className="hidden md:table-cell">{item.profesori.map(profesor => profesor.ime).join(",")}</td>
        <td>
            <div className="flex items-center gap-2">
                {role === "admin" && (
                    <>
                        <FormeContainer table="predmet" type="update" data={item} />
                        <FormeContainer table="predmet" type="delete" id={item.id} />
                    </>
                )}
            </div>
        </td>
    </tr>
)

const PredmetListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {

    const { page, ...queryParams } = searchParams;

    const p = page ? parseInt(page) : 1;

    const query: Prisma.PredmetWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.ime = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.predmet.findMany({
            where: query,
            include: {
                profesori: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.predmet.count({ where: query }),
    ]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/*TOP*/}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Predmeti</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {<TabelaPretrage />}
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="" width={30} height={30} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="" width={30} height={30} />
                        </button>
                        {role === 'admin' && (
                            <FormeContainer table="predmet" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/*LIST*/}
            <Tabela columns={columns} renderRow={renderRow} data={data} />
            {/*PAGINATION*/}
            {<Pagination page={p} count={count} />}

        </div>
    )
}

export default PredmetListPage;