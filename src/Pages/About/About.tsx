import { Div } from "../../TypeWriteres";

import { Span } from "../../TypeWriteres";

const string = `\
I'm a Computer Science graduate with a deep passion for both software and hardware. I thrive on understanding complex technologies, diving deep into the tools I use, optimising my workflow, and continuously improving my skills.
My curiosity has led me to explore and customise Linux environments and development setups, where I find joy in tailoring tools to enhance efficiency and productivity as a programmer.

I'm proficient in a wide range of languages, including Python, Rust, JavaScript, TypeScript, Java, C#, C, SQL, and technologies like Django, React, Flask, Actix-web, and Tokio. I'm also experienced with Docker, Git, Make, and other essential developer tools.

Recently, I undertook a research project on congestion control in networking as part of my undergraduate dissertation. This involved exploring emerging technologies in both software and hardware layers, and using C++ libraries and Linux network emulation technologies to simulate and test the techniques studied. The project deepened my understanding of network protocols, performance bottlenecks, and real-world system constraints.\
`;

export default function About() {
   return <div className="mt-[8rem]!">
      <Span href="github.com" speed={0.1}>{string}</Span>
   </div>;
}
