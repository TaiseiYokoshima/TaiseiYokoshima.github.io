import './App.css'
import { Title, Div, Header  } from "./TypeWriteres";
import { useRef } from 'react';

import { Controller, Registry } from './TypeWriteres';

function App() {
   const title_controller = useRef(new Controller());
   const divs_registry = useRef(new Registry());

   const open = async () => {
      console.log("open divs");
      await divs_registry.current.open();
      console.log("divs opened")

      console.log("open title");
      await title_controller.current.open();
      console.log("title opened")

   };

   const close = async () => {
      console.log("close divs");
      await divs_registry.current.close();
      console.log("divs closed")


      console.log("close title");
      await title_controller.current.close();
      console.log("title closed")
   };


   return (
      <>
         <div id='terminal-window'>

            {/* <Header controller={title_controller} speed={10}> this is the title</Header> */}
            <Title controller={title_controller} speed={10}> this is the title</Title>
            {/* <Div registry={divs_registry} speed={10}>this is the first text I want. I am trying out</Div> */}
            {/* <Div registry={divs_registry} speed={10}>this is the second text I want.</Div> */}
            {/* <Header registry={divs_registry} speed={10}>this is the second text I want.</Header> */}


            <button onClick={open}> open </button>
            <button onClick={close}> close </button>

         </div>
      </>

   )
}

export default App
