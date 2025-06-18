
import BigCalendarContainer from "@/app/components/BigCalendarContainer"
import Kalendar from "@/app/components/Kalendar"
import Novosti from "@/app/components/Novosti"
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const Ucenik = async () => {

    const { userId } = await auth();

    const razredItem = await prisma.razred.findMany({
        where: {
            ucenici: {
                some: {
                    id: userId!
                },
            },
        }
    });

    return (
        <div className="p-4 flex gap-4 flex-col xl:flex-row">
            
            <div className="w-full xl:w-2/3">
            <div className="h-full bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Raspored (4/5)</h1>
                <BigCalendarContainer type="razredId" id={razredItem[0].id} />
            </div>
            </div>
            
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Kalendar/>
                <Novosti/>
            </div>

        </div>
    )
 }

 export default Ucenik