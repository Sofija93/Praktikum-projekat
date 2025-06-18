import { prisma } from "../lib/prisma";
import { prilagodjavanjeRasporeda } from "../lib/utils";
import BigCalendar from "./BigCalendar";

const BigCalendarContainer = async ({
    type,
    id,
}: {
    type: "profesorId" | "razredId";
    id: string | number;
}) => {
    const dataRes = await prisma.lekcija.findMany({
        where: {
            ...(type === "profesorId"
                ? { profesorId: id as string }
                : { razredId: (id as number) }),
        }
        })

    const data = dataRes.map((lekcija) => ({
        naziv: lekcija.ime,
        pocetak: lekcija.pocetak,
        kraj: lekcija.kraj,
    }));

        const raspored = prilagodjavanjeRasporeda(data);

    return (
        <div className=""><BigCalendar data={raspored}/></div>
    )
}

export default BigCalendarContainer;