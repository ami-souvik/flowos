type Interior = {
    img?: string,
    title?: string,
    description?: string
}

export const hero: Array<Interior> = [
    {},
    {
        img: '/images/hero/modular-kitchens.png',
        title: 'Modular Kitchens',
        description: 'Refresh your living area with our interior design range. Discover our latest collection for her for the upcoming summer.'
    },
    {
        img: '/images/hero/furniture-decor.png',
        title: 'Furniture & Decor',
        description: 'Perfectly curated by design experts. Get fresh ideas for your home this season and every occasion. Discover what\'s perfect for him.'
    },
    {
        img: '/images/hero/flooring-ceiling.png',
        title: 'Flooring & Ceiling',
        description: 'Are you looking for sustainable decor for your home? Discover our exclusive design solutions for both of you.'
    },
    {
        img: '/images/hero/painting-designer-walls.png',
        title: 'Painting & Designer Walls',
        description: 'Are you looking for sustainable decor for your home? Discover our exclusive design solutions for both of you.'
    },
    {
        img: '/images/hero/lighting.png',
        title: 'Electrical Work & Lighting',
        description: 'Perfectly curated by design experts. Get fresh ideas for your home this season and every occasion. Discover what\'s perfect for him.'
    },
    {
        img: '/images/hero/home-appliances.png',
        title: 'Home Appliances',
        description: 'Refresh your living area with our interior design range. Discover our latest collection for her for the upcoming summer.'
    },
    {}
]

type Segment = {
    badge: string,
    background: string,
    label: string,
    description: string
}

export const segments: Array<Segment> = [
    {
        badge: "Starting @3.5L",
        background: "/images/segments/necessary.png",
        label: "Necessary",
        description: "Affordable design, timeless beauty.",
    },
    {
        badge: "Starting @4.2L",
        background: "/images/segments/standard.png",
        label: "Standard",
        description: "Beyond basics, short of luxury.",
    },
    {
        badge: "Starting @5.6L",
        background: "/images/segments/premium.png",
        label: "Premium",
        description: "Beautifully premium, never excessive.",
    },
    {
        badge: "Starting @7L",
        background: "/images/segments/luxury.png",
        label: "Luxury",
        description: "Where elegance meets lifestyle.",
    }
]

type Partner = {
    title: string,
    img: string,
    objectFit: 'cover' | 'contain'
}

export const partners: Array<Partner> = [
    {
        title: 'Asian Paints Logo',
        img: '/images/partners/asianpaints.png',
        objectFit: 'contain'
    },
    {
        title: 'Godrej Logo',
        img: '/images/partners/godrej.png',
        objectFit: 'contain'
    },
    {
        title: 'Saint Gobain Logo',
        img: '/images/partners/saintgobain.png',
        objectFit: 'contain'
    },
    {
        title: 'EBCO Logo',
        img: '/images/partners/ebco.png',
        objectFit: 'contain'
    },
    {
        title: 'Fevicol Logo',
        img: '/images/partners/fevicol.png',
        objectFit: 'contain'
    },
    {
        title: 'Crompton Logo',
        img: '/images/partners/crompton.png',
        objectFit: 'cover'
    },
    {
        title: 'Century Ply Logo',
        img: '/images/partners/centuryply.png',
        objectFit: 'cover'
    },
    {
        title: 'Finolex Logo',
        img: '/images/partners/finolex.png',
        objectFit: 'cover'
    }
]

type Project = {
    img: string,
    title: string,
    description: string
}

export const projects: Array<Project> = [
    {
        img: '/images/projects/living.png',
        title: "Living Room Elegance",
        description: "A modern living room designed for comfort and sophistication. Neutral tones and cozy textures make it the heart of the home.",
    },
    {
        img: '/images/projects/kitchen.png',
        title: "Contemporary Kitchen",
        description: "A sleek and stylish kitchen where functionality meets design. A dining room that blends style and warmth, perfect for family.",
    },
    {
        img: '/images/projects/bedroom.png',
        title: "Bedroom Retreat",
        description: "A calming bedroom sanctuary with soft colors, layered lighting, and thoughtful details for peaceful nights.",
    },
    {
        img: '/images/projects/office.png',
        title: "Creative Workspace",
        description: "An inspiring office interior designed to boost productivity while keeping a modern, elegant look.",
    }
]

export type Testimonial = {
    id: number;
    name: string;
    position: string;
    company: string;
    image: string;
    testimonial: string;
}

// https://www.flaticon.com/stickers-pack/avatars-132
export const testimonials: Testimonial[] = [
    {
        id: 1,
        image: '/images/customers/niladri.png',
        company: "South 24 Paraganas",
        name: "Niladri Chowdhury",
        position: "Newtown",
        testimonial: "They changed my flat fully. Now it looks very premium yet homely. Very satisfied with the design and execution."
    },
    {
        id: 2,
        image: '/images/customers/koyel.png',
        company: "Howrah",
        name: "Koyel Mukherjee",
        position: "Liluah",
        testimonial: "Ora shuru thekei shob handle koreche ar amar bari ta ke spacious banieche. Modern design, sundar finish, barita ekhon onek bhalo lagche."
    },
    {
        id: 3,
        image: '/images/customers/souvik.png',
        company: "North 24 Paraganas",
        name: "Souvik Bose",
        position: "Belgharia",
        testimonial: "Very satisfied. They understood our need, gave beautiful design within budget. "
    },
    {
        id: 4,
        image: '/images/customers/subham.png',
        company: "Kolkata",
        name: "Subham Biswas",
        position: "Dumdum",
        testimonial: "Project delivered on time. Good quality work. Budget er moddhe khub sundor design and implemenation. Barir sobai khub khushi. "
    },
    {
        id: 5,
        image: '/images/customers/arpan.png',
        company: "Hooghly",
        name: "Arpan Dey",
        position: "Seerampore",
        testimonial: "Amazing creativity and technical expertise! They brought our vision to life in ways we never imagined possible. Truly exceptional work."
    }
];