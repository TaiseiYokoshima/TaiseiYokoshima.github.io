import { Div, Header } from "../../TypeWriteres";

function Sussex() {
   return <div  className="mt-[8rem]! w-full!">
      <div className="flex justify-between">
         <Header>University of Sussex</Header>
         <Div>Brighton, UK</Div>
      </div>
      <Div>Sep  2022 - May 2024</Div>
      <div className="flex justify-between">
         <Div>BSc Computer Science</Div>
         <Div>68% | 2:1 </Div>
      </div>
   </div>;
}


function UWC() {
   return <div className="mt-[8rem]! w-full!">
      <div className="flex justify-between w-full!">
         <Header>UWC USA</Header>
         <Div>New Mexico, USA</Div> 
      </div>
      <Div>Sep  2022 - May 2024</Div>
      <Div>IB Diploma</Div>
      <Div>HL: Economics, Visual Arts, Physics</Div>
      <Div>SL: English, Italian, Math</Div>
   </div>;
}


export default function Education() {
   return <>
      <Sussex/>
      <UWC/>
   </>;
}
