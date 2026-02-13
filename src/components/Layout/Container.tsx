import type React from "react"




function Container({children,className}:{children:React.ReactNode,className?:string}) {
  return (
    <div className={`min-h-screen p-6 max-w-[960px] lg:max-w-7xl 2xl:max-w-[1550px] mx-auto ${className}`}>
        {children}
    </div>
  )
}

export default Container