import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export const WiskReveal = ({ variants, children, className }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
    >
      {children}
    </motion.div>
  )
}
