import Image from "next/image";
import CountChart from "./CountChart"
import { prisma } from "../lib/prisma";

const CountChartContainer = async () => {

    const data = await prisma.ucenik.groupBy({
        by: ['pol'],
        _count: {
            pol: true,
        },
    });

    const decaci = data.find(item => item.pol === 'MUSKO')?._count.pol || 0;
    const devojcice = data.find(item => item.pol === 'ZENSKO')?._count.pol || 0;

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className='text-lg font-semibold'>Ucenici</h1>
                <Image src='/ucenici.png' alt='' width={60} height={60} />
            </div>
            {/* CHART */}
            <CountChart decaci={decaci} devojcice={devojcice}/>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-sSky rounded-full' />
          <h1 className='font-bold'>{decaci}</h1>
          <h2 className='text-xs text-gray-300'>Decaci ({Math.round((decaci/(decaci+devojcice)) * 100)}%)</h2>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='w-5 h-5 bg-sYellow rounded-full' />
          <h1 className='font-bold'>{devojcice}</h1>
          <h2 className='text-xs text-gray-300'>Devojcice ({Math.round((devojcice/(decaci+devojcice)) * 100)}%)</h2>
        </div>
      </div>
    </div>
        );
    }

    export default CountChartContainer;