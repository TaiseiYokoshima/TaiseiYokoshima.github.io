import { Header, Div } from "../../TypeWriteres";

const body = `
• Researched and evaluated an open-source team collaboration tool built with Ruby on Rails. Presenting findings to explore its adoption as a company-wide replacement for the existing tool. Through this project I learned to collaborate efficiently with other programmers. We did peer programming and frequent communication to cordinate concurrent progression on mulitple tasks or components that are related.

• Managed Linux servers (Rocky and Ubuntu) used by the interns team. Conducted R&D on implementing an automatic update system. This project taught me how complex and delicate the process of updating production servers and the software running on them is.

• Developed the frontend integration for a QR code token authentication feature. Wrote JavaScript for WordPress demonstration site to interface with the APIs. This was another project where collaboration was important. The interns working on this project had to collaborate closely with the backend engineers to interface properly with the apis.

• Implemented a Go library to determine whether a GPS coordinate falls within a specified radius of another coordinate, supporting location-based access control features. This project required me to move fast rather producing efficient and correct code. It was geared towards experiementation rather than implementation.\
`;


function Passology() {
   return <div className="mt-[5rem]!">
      <Header>Software Engineering Intern</Header>
      <Div href="passlogy.com">Passlogy Co. LTD</Div>
      <Div>Tokyo, Japan</Div>
      <Div>Jun 2024 - Sep 2024</Div>
      <Div>{body}</Div>
   </div>;
}


export default function Experience() {
   return <>
      <Passology/>
   </>;
}

