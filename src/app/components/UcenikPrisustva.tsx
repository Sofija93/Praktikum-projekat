import { prisma } from "../lib/prisma";

const UcenikPrisustva = async ({id}:{id:string}) => {

    const prisustvo = await prisma.prisustvo.findMany({
        where:{
            ucenikId: id,
            datum: {
                gte: new Date(new Date().getFullYear(), 0, 1),
            }
        }
    })

    const ukupnoDana = prisustvo.length;
    const naDanasnjiDan = prisustvo.filter((dan) => dan.prisutan ).length;
    const procentualno = (naDanasnjiDan / ukupnoDana) * 100;

    return (
        <div className="">
            <h1 className="text-xl font-semibold">{procentualno || "-"}%</h1>
            <span className="text-sm text-gray-400">Prisustvo</span>
        </div>
    )
}

export default UcenikPrisustva;