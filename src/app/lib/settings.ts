export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
    [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
    "/admin(.*)": ["admin"],
    "/ucenik(.*)": ["ucenik"],
    "/profesor(.*)": ["profesor"],
    "/roditelj(.*)": ["roditelj"],
    "/list/profesori": ["admin", "profesor"],
    "/list/ucenici": ["admin", "profesor"],
    "/list/predmeti": ["admin"],
    "/list/roditelji": ["admin", "profesor"],
    "/list/razredi": ["admin", "profesor"],
    "/list/ispiti": ["admin", "profesor", "ucenik", "roditelj"],
    "/list/zadaci": ["admin", "profesor", "ucenik", "roditelj"],
    "/list/rezultati": ["admin", "profesor", "ucenik", "roditelj"],
    "/list/prisustva": ["admin", "profesor", "ucenik", "roditelj"],
    "/list/dogadjaji": ["admin", "profesor", "ucenik", "roditelj"],
    "/list/objave": ["admin", "profesor", "ucenik", "roditelj"],

};