import type Props from "../props";
import { SpanHeader, Span } from "../../TypeWriteres";

const compiler = `Targets RISC-V written in Java. The grammar and parsing is implemented with with Antler`;
const tftp = 'Tftp client and server written in Java';
const kube = 'Kubernetes metric logger using cAdvisor';
const parser = `Pratt parser for binary and unary expression`;

function Compiler({ registry }: Props) {
   return <div style={{marginTop: '5rem'}}>
      <SpanHeader registry={registry} href="github.com/TaiseiYokoshima/compiler">Compiler</SpanHeader>
      <Span registry={registry}>{compiler}</Span>
   </div>;
}

function Tftp({ registry }: Props) {
   return <div style={{marginTop: '5rem'}}>
      <SpanHeader registry={registry} href="github.com/TaiseiYokoshima?tab=repositories&q=tftp&type=&language=&sort=">Tftp</SpanHeader>
      <Span registry={registry}>{tftp}</Span>
   </div>;
}

function Kube({ registry }: Props) {
   return <div style={{marginTop: '5rem'}}>
      <SpanHeader registry={registry} href="github.com/TaiseiYokoshima/kube">Kubernetes Metric Logger</SpanHeader>
      <Span registry={registry}>{kube}</Span>
   </div>;
}


function Parser({ registry }: Props) {
   return <div style={{marginTop: '5rem'}}>
      <SpanHeader registry={registry} href="github.com/TaiseiYokoshima/pyparse">Parser</SpanHeader>
      <Span registry={registry}>{parser}</Span>
   </div>;
}

export default function Projects({ registry }: Props) {
   return <>
      <Compiler registry={registry}/>
      <Tftp registry={registry}/>
      <Kube registry={registry}/>
      <Parser registry={registry}/>
   </>;
}
