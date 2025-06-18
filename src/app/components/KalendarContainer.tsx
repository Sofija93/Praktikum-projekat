import Image from "next/image";
import Kalendar from "./Kalendar";
import EventList from "./EventList";

const KalendarContainer = async ({searchParams}:{searchParams: 
    {[keys:string]:string | undefined}}) => {

    const { data } = searchParams;
    
    return (
        <div className='bg-white p-4 rounded-md'>
            <Kalendar />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4">Dogadjaji</h1>
                <Image src='/desavanja.png' alt='' width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
                <EventList dateParam={data}/>
            </div>
        </div>
    );
}

export default KalendarContainer;