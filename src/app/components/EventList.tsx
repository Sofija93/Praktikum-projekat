import { prisma } from "../lib/prisma";

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {

    const date = dateParam ? new Date(dateParam) : new Date();

    const data = await prisma.dogadjaj.findMany({
        where: {
            pocetak: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lt: new Date(date.setHours(23, 59, 59, 999)),
            }
        }
    })

    return data.map(dogadjaj => (
        <div className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sSky even:border-t-sPurple" 
        key={dogadjaj.id}>
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{dogadjaj.naziv}</h1>
                <span className="text-gray-300 text-xs">
                    {dogadjaj.pocetak.toLocaleTimeString("en-UK", {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    })}
                </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{dogadjaj.opis}</p>
        </div>
    ))
}
export default EventList;