import { Div, Header } from "../../TypeWriteres";


function Email() {
   return <div className="mt-[5rem]!">
      <Header>Email</Header>
      <Div>taiseiyokoshima.professional@gmail.com</Div>
   </div>;
}

function LinkedIn() {
   return <div className="mt-[5rem]!">
     <Header>LinkedIn</Header>
     <Div>linkedin.com/in/taisei-yokoshima/</Div>
   </div>;
}

export default function Contact() {
   return <>
      <Email/>
      <LinkedIn/>
   </>;
}

