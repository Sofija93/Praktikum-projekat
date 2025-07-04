'use client'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Image from 'next/image';


const CountChart = ({ decaci, devojcice }: { decaci: number; devojcice: number }) => {

  const data = [
    {
      name: 'Ukupno',
      count: decaci + devojcice,
      fill: 'white',
    },
    {
      name: 'Devojcice',
      count: devojcice,
      fill: '#FAE27C',
    },
    {
      name: 'Decaci',
      count: decaci,
      fill: '#C3EBFA',
    }
  ];

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
          <RadialBar
            background
            dataKey="count"
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image src="/deca.png" alt="" width={50} height={50} className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
    </div>
  )
}

export default CountChart