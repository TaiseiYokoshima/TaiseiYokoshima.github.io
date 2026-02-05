import type Props from "../props.ts";
import { Span, SpanHeader } from "../../TypeWriteres";

function Email({ registry }: Props) {
   return <div className="mt-[5rem]!">
      <SpanHeader registry={registry}>Email</SpanHeader>
      <Span registry={registry} email="taiseiyokoshima.professional.@gmail.com">taiseiyokoshima.professional@gmail.com</Span>
      {/* <Span registry={registry}>taiseiyokoshima.professional@gmail.com</Span> */}
   </div>;
}

function LinkedIn({ registry }: Props) {
   return <div className="mt-[5rem]!">
     <SpanHeader registry={registry}>LinkedIn</SpanHeader>
     <Span href="linkedin.com/in/taisei-yokoshima" registry={registry}>linkedin.com/in/taisei-yokoshima</Span>
     {/* <Span registry={registry}>linkedin.com/in/taisei-yokoshima</Span> */}
   </div>;
}

function GitHub({ registry }: Props) {
   return <div className="mt-[5rem]!">
     <SpanHeader registry={registry}>GitHub</SpanHeader>
     <Span href="github.com/TaiseiYokoshima" registry={registry}>github.com/TaiseiYokoshima</Span>
     {/* <Span registry={registry}>github.com/TaiseiYokoshima</Span> */}
   </div>;
}

export default function Contact({ registry }: Props) {
   return <div className="ml-[20rem]!">
      <Email registry={registry}/>
      <LinkedIn registry={registry}/>
      <GitHub registry={registry}/>
   </div>;
}
