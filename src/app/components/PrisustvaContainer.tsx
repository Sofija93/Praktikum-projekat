import Image from "next/image";
import Prisustva from "./Prisustva"
import { prisma } from "../lib/prisma";

const PrisustvaContainer = async () => {

    const danas = new Date();
    const danUNedelji = danas.getDay();
    const daniPrePon = danUNedelji === 0 ? 6 : danUNedelji - 1; // Nedelja je 0, a ponedeljak je 1

    const poslednjiPon = new Date(danas);

    poslednjiPon.setDate(danas.getDate() - daniPrePon);

    const resData = await prisma.prisustvo.findMany({
        where: {
            datum: {
                gte: poslednjiPon
            },
        },
        select: {
            datum: true,
            prisutan: true,
        },
    });

    const daniUNedelji = ["Pon", "Uto", "Sre", "Cet", "Pet"];

    const prisustvaMap : {[key:string]:{prisutan:number; odsutan:number}}= {
        Pon: {prisutan: 0, odsutan: 0}, 
        Uto: {prisutan: 0, odsutan: 0}, 
        Sre: {prisutan: 0, odsutan: 0},
        Cet: {prisutan: 0, odsutan: 0},
        Pet: {prisutan: 0, odsutan: 0},
    };
    
    resData.forEach((item) => {
        const itemDatum = new Date(item.datum);
        
        if(danUNedelji >=1 && danUNedelji <= 5) {
            const danIme = daniUNedelji[danUNedelji - 1]; 

            if (item.prisutan) {
                prisustvaMap[danIme].prisutan += 1;
            } else {
                prisustvaMap[danIme].odsutan += 1;
            }
        }
    });

    const data = daniUNedelji.map((dan) => ({
        name: dan,
        prisutan: prisustvaMap[dan].prisutan,
        odsutan: prisustvaMap[dan].odsutan,
    }));


    return (
        <div className="bg-white rounded-lg p-4 h-full">
              <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Prisustva</h1>
                <Image src='/prisustva.png' alt='' width={50} height={50} />
              </div>
              <Prisustva data={data}/>
        </div>
    )
    }

    export default PrisustvaContainer;