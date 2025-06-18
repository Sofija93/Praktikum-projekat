
import CountChartContainer from "@/app/components/CountChartContainer"
import Finansije from "@/app/components/Finansije"
import KalendarContainer from "@/app/components/KalendarContainer"
import Novosti from "@/app/components/Novosti"
import PrisustvaContainer from "@/app/components/PrisustvaContainer"
import UserCard from "@/app/components/UserCard"

const Admin = ({searchParams}:{searchParams: {[keys:string]:string | undefined}
}) => {
    return (
        <div className="p-4 flex gap-4 flex-col md:flex-row">
            
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
                {/* USER CARD */}
                <div className="flex gap-4 justify-between flex-wrap">
                    <UserCard type='admin' />
                    <UserCard type='profesor' />
                    <UserCard type='ucenik' />
                    <UserCard type='roditelj' />
                </div>
                {/* MIDDLE CHARTS*/}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNT CHART */}
                    <div className="w-full lg:w-1/2 h-[450px]">
                        <CountChartContainer />
                    </div>
                    {/*PRISUSTVA*/}
                    <div className="w-full lg:w-1/2 h-[450px]">
                        <PrisustvaContainer />
                    </div>
                </div>
                {/* FINANSIJE CHARTS*/}
                <div className="w-full h-[500px]">
                    <Finansije />
                </div>
            </div>
             {/* KALENDAR I EVENT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <KalendarContainer searchParams={searchParams}/>
                <Novosti />
            </div>
        </div>
    )
}

export default Admin