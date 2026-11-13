import type { Config } from "tailwindcss";
export default { content:["./app/**/*.tsx","./components/**/*.tsx"],
theme:{extend:{colors:{ink:"#080808",char:"#151515",gold:"#D9AD72",soft:"#F1C88E",ivory:"#F8F4EF",mute:"#A8A8A8"},
fontFamily:{serif:["var(--font-serif)","serif"],sans:["var(--font-sans)","sans-serif"],script:["var(--font-script)","cursive"]}}},plugins:[]} satisfies Config;
