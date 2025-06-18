import { z } from "zod";

export const predmetSchema = z.object({
    id:z.coerce.number().optional(),
    ime: z
    .string()
    .min(1, { message: 'Ime predmeta! ' }),
    profesori: z.array(z.string()),

  });

  export type PredmetSchema = z.infer<typeof predmetSchema>;

  export const razredSchema = z.object({
    id:z.coerce.number().optional(),
    ime: z
    .string()
    .min(1, { message: 'Ime predmeta! ' }),
    brUcenika: z
    .coerce.number()
    .min(1, { message: 'Broj ucenkika! ' }),
    oceneId: z
    .coerce.number()
    .min(1, { message: 'Ocene ucenika! ' }),
    razredniId: z
    .coerce.string().optional(),
    
  });

  export type RazredSchema = z.infer<typeof razredSchema>;

  export const profesorSchema = z.object({
    id: z.string().optional(),
    username: z
      .string()
      .min(3, { message: 'Unesite minimum 3 karaktera' })
      .max(20, { message: 'Maksimalan broj karaktera je 20!' }),
    email: z.string().email({ message: 'Nepostojeca mail adressa' }).optional().or(z.literal("")),
    password: z.string().min(8, { message: 'Lozinka mora da sadrzim minimun 8 karaktera!' }).or(z.literal("")).optional(),
    ime: z.string().min(1, { message: 'Ime!' }),
    prezime: z.string().min(1, { message: 'Prezime!' }),
    telefon: z.string().optional(),
    adresa: z.string(),
    datumRodjenja: z.coerce.date({ message: 'Datum rodjenja!' }),
    pol: z.enum(["MUSKO", "ZENSKO"], { message: 'Pol!' }),
    img: z.string().optional(),
    predmeti:z.array(z.string()).optional(),
  });

  export type ProfesorSchema = z.infer<typeof profesorSchema>;

  export const ucenikSchema = z.object({
    id: z.string().optional(),
    username: z
      .string()
      .min(3, { message: 'Unesite minimum 3 karaktera' })
      .max(20, { message: 'Maksimalan broj karaktera je 20!' }),
    email: z.string().email({ message: 'Nepostojeca mail adressa' }).optional().or(z.literal("")),
    password: z.string().min(8, { message: 'Lozinka mora da sadrzim minimun 8 karaktera!' }).or(z.literal("")).optional(),
    ime: z.string().min(1, { message: 'Ime!' }),
    prezime: z.string().min(1, { message: 'Prezime!' }),
    telefon: z.string().optional(),
    adresa: z.string(),
    datumRodjenja: z.coerce.date({ message: 'Datum rodjenja!' }),
    pol: z.enum(["MUSKO", "ZENSKO"], { message: 'Pol!' }),
    img: z.string().optional(),
    ocenaId: z.coerce.number().min(1,{message:"Ocena!"}),
    razredId: z.coerce.number().min(1,{message:"Razred!"}),
    roditeljId: z.string().min(1,{message:"Roditelj ID!"})
  });

    export type UcenikSchema = z.infer<typeof ucenikSchema>;

    export const ispitSchema = z.object({
    id:z.coerce.number().optional(),
    naziv: z
    .string()
    .min(1, { message: 'Naziv ispita! ' }),
    pocetak: z.coerce.date({message:"Vreme pocetka ispita"}),
    kraj: z.coerce.date({message:"Vreme zavrsetka ispita"}),
    lekcijaId: z.coerce.number({message:"Lekcija!"})

  });

  export type IspitSchema = z.infer<typeof ispitSchema>;
