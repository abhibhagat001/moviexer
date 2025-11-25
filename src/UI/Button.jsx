import React from "react";

const Button =({children,classes,type='submit',disabled=false})=>{

    return (
         <button type={type} className={classes} disabled={disabled}>
            {children}
        </button>
    )
}

export default Button;