import { FaExternalLinkAlt } from "react-icons/fa";
import React from "react";

const Icon = React.forwardRef<HTMLDivElement>((_, ref) => {
   return (
      <div ref={ref} style={{ display: 'inline' }}>
         <FaExternalLinkAlt 
            // size={13} 
            style={{ display: 'inline', marginLeft: '0.5rem',
               fontSize: '0.6em',
            }}/>
      </div>
   );
});

export default Icon;
