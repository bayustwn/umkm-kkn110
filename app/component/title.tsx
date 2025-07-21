import {motion} from 'motion/react';

interface TitleProps {
    title: string
    size: string
}

export default function Title({title,size}: TitleProps) {
    return (
        <div>
            <motion.p initial={{opacity: 0, y: -10}} whileInView={{opacity: 1,y: 0}} transition={{duration: 0.5}} className={`${size} font-bold mb-[2px]`}>{title}</motion.p>
            <motion.div initial={{opacity: 0, x: -10}} whileInView={{opacity: 1,x: 0}} transition={{duration: 0.5}} className="bg-black w-10 rounded-2xl h-1"></motion.div>
          </div>
    )
}