import { SpanHeader, Span } from "../../TypeWriteres";
import type Props from "../props";

function Sussex({ registry }: Props) {
   return <div  className="mt-[8rem]! w-full!">
      <div className="flex justify-between">
         <SpanHeader registry={registry} href="sussex.ac.uk">University of Sussex</SpanHeader>
         <Span registry={registry}>Brighton, UK</Span>
      </div>
      <Span registry={registry}>Sep 2022 - May 2024</Span>
      <div className="flex justify-between">
         <Span registry={registry}>BSc Computer Science</Span>
         <Span registry={registry}>68% | 2:1 </Span>
      </div>
   </div>;
}

function UWC({ registry }: Props) {
   return <div className="mt-[8rem]! w-full!">
      <div className="flex justify-between w-full!">
         <SpanHeader registry={registry} href="uwc-usa.org">UWC USA</SpanHeader>
         <Span registry={registry}>New Mexico, USA</Span> 
      </div>

      <Span registry={registry}>Aug 2019 - May 2021</Span>
      <Span registry={registry}>IB Diploma</Span>
      <Span registry={registry}>HL: Economics, Visual Arts, Physics</Span>
      <Span registry={registry}>SL: English, Italian, Math</Span>
   </div>;
}

export default function Education({ registry }: Props) {
   return <div className="mx-[10rem]!">
      <Sussex registry={registry}/>
      <UWC registry={registry}/>
   </div>;
}
