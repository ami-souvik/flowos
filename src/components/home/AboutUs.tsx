import Image from "next/image";
import { Section, SectionHeader } from "./Section";

export default function AboutUs() {
  return (
    <Section id="aboutus">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="font-light">
          <SectionHeader
            label="Testimonials"
            texts={[
              "One destination for smart & affordable interior design."
            ]}
          />
          <p className="pb-2 md:text-lg">We are two passionate interior designers from India who started this venture with a simple belief: beautiful spaces should not come with an impossible price tag.</p>
          <p className="pb-2 md:text-lg">In today’s market, designs that look good often cost too much, while affordable options usually lack style. Our mission is to change that. With our knowledge and expertise, we create and execute interiors that are not only aesthetically stunning but also budget-friendly.</p>
          <p className="pb-2 md:text-lg">We aim to make dream homes and workspaces accessible to everyone—where quality design meets fair pricing.</p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
              <Image alt='Koala' src='/images/koala.png' fill className="object-contain" />
            </div>
            <div>
              <p className="text-center text-xl">Saradindu</p>
              <p>Co-Founder</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
              <Image alt='Horse' src='/images/horse.png' fill className="object-contain" />
            </div>
            <div>
              <p className="text-center text-xl">Uddipan</p>
              <p>Co-Founder</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
