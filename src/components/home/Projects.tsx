import Image from "next/image";
import { projects } from "./data";
import { Section, SectionHeader } from "./Section";

export default function Projects() {
    return (
        <Section id="project">
            <SectionHeader label="Projects" texts={["Our Awesome Projects"]} />
            <p className="text-lg font-light">
                We transform empty spaces into beautiful, functional environments that truly reflect your lifestyle. Explore some of our favorite completed works below.
            </p>
            <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {
                    projects.map(({ img, title, description }) =>
                        <div key={title} className="cursor-pointer items-center gap-6">
                            <div className="relative w-full h-46">
                                <Image src={img} alt={title} fill className="object-cover rounded-xl" />
                            </div>
                            <div className="max-sm:mb-6">
                                <h3 className="py-4 text-2xl md:text-3xl font-semibold">{title}</h3>
                                <p className="text-lg font-light">{description}</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </Section>
    );
}
