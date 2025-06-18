
import BigCalendarContainer from "@/app/components/BigCalendarContainer"
import Novosti from "@/app/components/Novosti"
import { auth } from "@clerk/nextjs/server"

const Profesor = async () => {

    const { userId } = await auth();

    return (
        <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
            <div className="h-full bg-white p-4 rounded-md">
                <h1 className="text-xl font-semibold">Raspored</h1>
                <BigCalendarContainer type = "profesorId" id={userId!} />
            </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-8">
                <Novosti/>
            </div>
        </div>
    )
 }

 export default Profesor