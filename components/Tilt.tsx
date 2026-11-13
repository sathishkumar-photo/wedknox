"use client";
import {useRef} from "react";
export default function Tilt({children,className=""}:{children:React.ReactNode;className?:string}){
const r=useRef<HTMLDivElement>(null);
const m=(e:React.MouseEvent)=>{const el=r.current;if(!el||matchMedia("(pointer:coarse)").matches)return;const b=el.getBoundingClientRect();
const x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;el.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`};
return <div ref={r} onMouseMove={m} onMouseLeave={()=>{if(r.current)r.current.style.transform=""}} className={`transition-transform duration-200 ${className}`}>{children}</div>}
