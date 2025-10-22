import { Header, Div } from "../../TypeWriteres";
import { Registry } from "../../TypeWriteres";

export default function Projects({headers, contents}: { headers: Registry, contents: Registry }) {
   return <>
         <Header registry={headers}>Header test</Header>
         <Div registry={contents}>this is a test</Div>
         <Header registry={headers}>Header test 2</Header>
         <Div registry={contents}>this is a test 2</Div>
   </>;
}

