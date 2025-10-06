import './App.css'

import { motion, rgba } from "framer-motion";
import React from "react";
import TypeWriter from './TypeWriter';
import Typer from './Typer';


import { useRef } from 'react';

const backround = `
    repeating-linear-gradient(
      to bottom,
      var(--line-color) 0,
      var(--line-color) calc(var(--line-thickness)),
      transparent calc(var(--line-thickness)),
      transparent calc(var(--gap))
    );
`;

const mode = 'normal';


function createDeferred<T>() {
   let resolve!: (value: T | PromiseLike<T>) => void;
   const promise = new Promise<T>((res) => {resolve= res});
   return { promise, resolve};
}

function App() {

   // const resolverRef = useRef<() => void>(() => {}); 
   // const promiseRef = useRef<Promise<void>>(new Promise((resolve) => resolverRef.current = resolve));
   
   const signal = useRef(createDeferred<void>());

   return (
      <>
         <div id='terminal-window'>
            <div>
            <Typer signal={signal}> this is the text I want </Typer>
            </div>
            <button onClick={() => {signal.current.resolve(); console.log("printing")} }>
               press me
            </button>
         </div>


      </>

   )
}

export default App
