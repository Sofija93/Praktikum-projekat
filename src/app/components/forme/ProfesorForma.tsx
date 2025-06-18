"use client"

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import InputField from '../InputField';
import { ProfesorSchema, profesorSchema } from '@/app/lib/formValidation';
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from 'react';
import { azurirajProfesora, napraviProfesora } from '@/app/lib/dogadjaji';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';

const ProfesorForma = ({ type, data, relatedData, setOpen }:
  { type: "create" | "update"; data?: any; relatedData?: any; 
    setOpen: Dispatch<SetStateAction<boolean>> }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfesorSchema>({
    resolver: zodResolver(profesorSchema),
  });

  const [img, setImg] = useState<any>()

  const [state, formAction] = useActionState(
    type === "create" ? napraviProfesora : azurirajProfesora,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit(data => {
    console.log(data);
    formAction({ ...data, img: img?.secure_url });
  })

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Profesor je uspesno ${type === "create" ? "kreiran" : "azuriran"}!`)
      setOpen(false);
      router.refresh()
    }
  }, [state, router, type, setOpen]);

  const { predmeti } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className='text-xl font-semibold'>{type === "create" ? "Unesi novog profesora" :
       "Azuriraj podatke profesora"}</h1>
      <span className='text-xs text-gray-400 font-medium'>Autentifikacija</span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label="Username" name="username" defaultValue={data?.username} register={register} 
        error={errors.username} />
        <InputField label="Email" name="email" type="email" defaultValue={data?.email} register={register} 
        error={errors.email} />
        <InputField label="Password" name="password" type="password" defaultValue={data?.password} 
        register={register} error={errors.password} />
      </div>
      <span className='text-xs text-gray-400 font-medium'>Podaci</span>
      <div className='flex justify-between flex-wrap gap-4'>
        <InputField label="Ime" name="ime" defaultValue={data?.ime} register={register} error={errors.ime} />
        <InputField label="Prezime" name="prezime" defaultValue={data?.prezime} register={register} error={errors.prezime} />
        <InputField label="Telefon" name="telefon" defaultValue={data?.telefon} register={register} error={errors.telefon} />
        <InputField label="Adresa" name="adresa" defaultValue={data?.adresa} register={register} error={errors.adresa} />
        <InputField label="Datum rodjenja" name="datumRodjenja" defaultValue={data?.datumRodjenja.toISOString().split("T")[0]}
          register={register} error={errors.datumRodjenja} type="date" />
        {data && (<InputField label="Id" name="id" defaultValue={data?.id} register={register} error={errors?.id} hidden />)}

        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label className='text-xs text-gray-500'>Pol</label>
          <select className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full' {...register("pol")} defaultValue={data?.pol}>
            <option value="MUSKO">Muski</option>
            <option value="ZENSKO">Zenski</option>
          </select>
          {errors.pol?.message && <p className='text-xs text-red-400'>{errors.pol.message.toString()}</p>}
        </div>
        <div className='flex flex-col gap-2 w-full md:w-1/4'>
          <label className='text-xs text-gray-500'>Predmeti</label>
          <select
            multiple
            className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full'
            {...register("predmeti")}
            defaultValue={data?.predmeti?.map((p: any) => p.id) || []}
          >
            {predmeti.map((predmet: { id: number; ime: string }) => (
              <option value={predmet.id} key={predmet.id}>{predmet.ime}</option>
            ))};
          </select>
          {errors.predmeti?.message && <p className='text-xs text-red-400'>{errors.predmeti.message.toString()}</p>}
        </div>

        <CldUploadWidget uploadPreset="skolaa" onSuccess={(result, { widget }) => {
          setImg(result.info)
          widget.close()
        }}>
          {({ open }) => {
            return (
              <div className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer' onClick={() => open()}>
                <Image src="/upload.png" alt="" width={28} height={28} />
                <span>Dodavanje slike</span>
              </div>
            );
          }}
        </CldUploadWidget>
      </div>
      {state.error && <span className='text-red-500'>Doslo je do greske prilikom dodavanja profesora</span>}
      <button className='bg-blue-400 taxt-white p-2 rounded-md'>{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default ProfesorForma
