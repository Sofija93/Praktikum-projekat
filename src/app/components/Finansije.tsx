'use client'
import Image from "next/image"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    ime: 'Januar',
    prihodi: 4000,
    rashodi: 2400,
  },
  {
    ime: 'Februar',
    prihodi: 3000,
    rashodi: 1398,
  },
  {
    ime: 'Mart',
    prihodi: 2000,
    rashodi: 9800,
  },
  {
    ime: 'April',
    prihodi: 2780,
    rashodi: 3908,
  },
  {
    ime: 'Maj',
    prihodi: 1890,
    rashodi: 4800,
  },
  {
    ime: 'Jun',
    prihodi: 2390,
    rashodi: 3800,
  },
  {
    ime: 'Jul',
    prihodi: 3490,
    rashodi: 4300,
  },
  {
    ime: 'Avgust',
    prihodi: 2000,
    rashodi: 9800,
  },
  {
    ime: 'Septembar',
    prihodi: 2780,
    rashodi: 3908,
  },
  {
    ime: 'Oktobar',
    prihodi: 1890,
    rashodi: 4800,
  },
  {
    ime: 'Novembar',
    prihodi: 2390,
    rashodi: 3800,
  },
  {
    ime: 'Decembar',
    prihodi: 3490,
    rashodi: 4300,
  },
];

const Finansije = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className='text-lg font-semibold'>Finansije</h1>
        <Image src='/finansije.png' alt='' width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis dataKey="ime" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={10} />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={10} />
          <Tooltip />
          <Legend align='center' verticalAlign='top' wrapperStyle={{ paddingTop: '10px', paddingBottom: '30px' }} />
          <Line type="monotone" dataKey="rashodi" stroke="#8884d8" strokeWidth={5} />
          <Line type="monotone" dataKey="prihodi" stroke="#82ca9d" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Finansije;