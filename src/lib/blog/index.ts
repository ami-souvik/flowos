import interiorKolkata from "./interior-kolkata";
import designIdeasKolkata from "./design-ideas-kolkata";
import interiorDesignMistakes from "./interior-design-mistakes";
import bedroomInteriorKolkata from "./bedroom-interior-kolkata";
import budgetInteriorDesignKolkata from "./budget-interior-design-kolkata";
import interiorDesignProcessKolkata from "./interior-design-process-kolkata";
import livingRoomDesignKolkata from "./living-room-design-kolkata";
import modularKitchenKolkata from "./modular-kitchen-kolkata";

export type Blog = {
    slug: string,
    imgSrc: string,
    title: string,
    description?: string,
    date: string,
    content: string
}

export const blogs: Record<string, Blog> = {
    "interior-kolkata": interiorKolkata,
    "design-ideas-kolkata": designIdeasKolkata,
    "interior-design-mistakes": interiorDesignMistakes,
    "bedroom-interior-kolkata": bedroomInteriorKolkata,
    "budget-interior-design-kolkata": budgetInteriorDesignKolkata,
    "interior-design-process-kolkata": interiorDesignProcessKolkata,
    "living-room-design-kolkata": livingRoomDesignKolkata,
    "modular-kitchen-kolkata": modularKitchenKolkata,
}