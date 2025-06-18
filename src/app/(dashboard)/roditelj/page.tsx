import BigCalendarContainer from "@/app/components/BigCalendarContainer";
import Novosti from "@/app/components/Novosti"
import { prisma } from "@/app/lib/prisma";
import { auth } from "@clerk/nextjs/server";

interface Ucenik {
    id: string;
    ime: string;
    prezime: string;
    razredId: string;

}

const Roditelj = async () => {

    const { userId } = await auth();
    const currentUserId = userId;

    const ucenici= await prisma.ucenik.findMany({
        where: {
            roditeljId: currentUserId!
        }
    })

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            
            <div className="">
                {ucenici.map((ucenik) => (
                <div className="w-full xl:w-2/3" key={ucenik.id}>
                <div className="h-full bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">
                    Raspored ({ucenik.ime + " " + ucenik.prezime})
                </h1>
                <BigCalendarContainer type="razredId" id={ucenik.razredId} />
                </div>
                </div>
                ))} 
            </div>
            
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Novosti/>
            </div>
        </div>
    )
 }

 export default Roditelj