import { motion } from "framer-motion"

const PageSlide = ({ children }) => {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0 }} // exit 애니메이션을 변경
      transition={{
        y: { type: "spring", stiffness: 300, damping: 30, duration: 0.8 },
        opacity: { duration: 0.5 },
      }}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "visible", // 부모 요소의 overflow 제거

      }}
    >
      {children}
    </motion.div>
  )
}

export default PageSlide
