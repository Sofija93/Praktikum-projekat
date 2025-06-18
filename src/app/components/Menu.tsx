import Link from "next/link"
import Image from "next/image"
import { currentUser } from "@clerk/nextjs/server"

const menuItems = [

    {
        title: "MENU",
        items: [
            {
                icon: "/home.png",
                label: "Home",
                href:"/",
                visible: ["admin", "profesor", "ucenik", "roditelj"]
            },
            {
                icon: "/profesor.png",
                label: "Profesori",
                href:"/list/profesori",
                visible: ["admin", "profesor"]
            },
            {
                icon: "/ucenik.png",
                label: "Ucenici",
                href:"/list/ucenici",
                visible: ["admin", "profesor"]
            },
            {
                icon: "/roditelj.png",
                label: "Roditelji",
                href:"/list/roditelji",
                visible: ["admin", "profesor"]
            },
            {
                icon: "/predmeti.png",
                label: "Predmeti",
                href: "/list/predmeti",
                visible: ["admin"],
              },
            {
                icon: "/razred.png",
                label: "Razredi",
                href:"/list/razredi",
                visible: ["admin", "profesor"]
            },
            {
                icon: "/lekcija.png",
                label: "Lekcije",
                href:"/list/lekcije",
                visible: ["admin", "profesor"]
            },
            {
                icon: "/ispit.png",
                label: "Ispiti",
                href:"/list/ispiti",
                visible: ["admin", "profesor", "ucenik", "roditelj"]

            },
            {
                icon: "/zadatak.png",
                label: "Zadatak",
                href:"/list/zadatak",
                visible: ["admin", "profesor", "ucenik", "roditelj"]
            },
            {
                icon: "/rezultat.png",
                label: "Rezultati",
                href: "/list/rezultati",
                visible: ["admin", "profesor", "ucenik", "roditelj"],
              },
            {
                icon: "/prisustvo.png",
                label: "Prisustva",
                href:"/list/prisustva",
                visible: ["admin", "profesor", "ucenik", "roditelj"],
            },
            {
                icon: "/kalendar.png",
                label: "Dogadjaji",
                href: "/list/event",
                visible: ["admin", "teacher", "student", "parent"],
              },

            {
                icon: "/objava.png",
                label: "Novosti",
                href:"/list/objava",
                visible: ["admin", "profesor", "ucenik", "roditelj"],
            },

        ],
    },
]

const Menu = async () => {

    const user = await currentUser()
    const role = user?.publicMetadata.role as string;

    return (
        <div className="mt-4 text-sm">
            {menuItems.map(i=>(
                <div className="flex flex-col gap-2" key={i.title}>
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                    {i.items.map((item)=> {
                        if(item.visible.includes(role)){
                            return(
                        <Link href={item.href} key={item.label} className="flex items-center justify-center lg:justify-start gap-4 
                        text-gray-500 py-2 md:px-2 rounded-md hover:bg-sSkyLight">
                        <Image src={item.icon} alt="" width={20} height={20}/>
                        <span className="hidden lg:block">{item.label}</span>
                        </Link>
                            )
                        }
                    }) }
                </div>
            ))}
        </div>
    )
 }

 export default Menu