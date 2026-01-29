import { Header, Div } from "../../TypeWriteres";

const compiler = `Targets RISC-V written in Java. The grammar and parsing is implemented with with Antler`;
const tftp = 'Tftp client and server written in Java';
const kube = 'Kubernetes metric logger using cAdvisor';
const parser = `Pratt parser for binary and unary expression`;

function Compiler() {
   return <div className="mt-[5rem]!">
      <Header href="github.com/TaiseiYokoshima/compiler">Compiler</Header>
      <Div>{compiler}</Div>
   </div>;
}

function Tftp() {
   return <div className="mt-[5rem]!">
      <Header href="github.com/TaiseiYokoshima?tab=repositories&q=tftp&type=&language=&sort=">Tftp</Header>
      <Div>{tftp}</Div>
   </div>;
}

function Kube() {
   return <div className="mt-[5rem]!">
      <Header href="github.com/TaiseiYokoshima/kube">Kubernetes Metric Logger</Header>
      <Div>{kube}</Div>
   </div>;
}


function Parser() {
   return <div className="mt-[5rem]!">
      <Header href="github.com/TaiseiYokoshima/pyparse">Parser</Header>
      <Div>{parser}</Div>
   </div>;
}

export default function Projects() {
   return <>
      <Compiler/>
      <Tftp/>
      <Kube/>
      <Parser/>
   </>;
}
