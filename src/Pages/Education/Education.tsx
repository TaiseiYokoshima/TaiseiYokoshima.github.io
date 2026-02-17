import { SpanHeader, Span } from "../../TypeWriteres";
import type Props from "../props";
import styles from "./Education.module.css";

function Sussex({ registry }: Props) {
   return <div className={styles.education} style={{ marginTop: '8rem', width: '100%' }}>

      <SpanHeader speed={100} registry={registry} href="sussex.ac.uk">University of Sussex</SpanHeader>
         <Span registry={registry} className={styles.right}>Sep 2022 - May 2024</Span>
      <Span registry={registry}>BSc Computer Science</Span>
         <Span registry={registry} className={styles.right}>68% | 2:1 </Span>
      <Span registry={registry}>Brighton, UK</Span>
   </div>;
}



function UWC({ registry }: Props) {
   return <div className={styles.education} style={{marginTop: '8rem', width: '100%'}}>
      <SpanHeader registry={registry} href="uwc-usa.org">UWC USA</SpanHeader>
         <Span registry={registry} className={styles.right}>Aug 2019 - May 2021</Span>
      <Span registry={registry}>IB Diploma</Span>
      <div>
         <Span registry={registry}>HL: Economics, Visual Arts, Physics</Span>
         <Span registry={registry}>SL: English, Italian, Math</Span>
      </div>
      <Span registry={registry}>New Mexico, USA</Span> 
   </div>;
}

export default function Education({ registry }: Props) {
   return <div className={styles.container}>
      <Sussex registry={registry}/>
      <UWC registry={registry}/>
   </div>;
}
