import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { fadeInUp, scaleIn, staggerContainer } from "./helper";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="container mx-auto max-w-6xl relative z-10"
      >
        <motion.div
          variants={fadeInUp}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.span
            variants={scaleIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Transforming African Commerce
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground"
          >
            Redefining <span className="text-primary">Commerce</span> in Africa
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
          >
            An innovative e-commerce and digital marketplace platform built to
            connect buyers, sellers, and service providers through a secure,
            scalable, and inclusive digital ecosystem that enables seamless
            trade and economic empowerment.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://vendors.9jacart.ng/sell-product"
              target="_blank"
              className="px-8 py-3 bg-[#8DEB6E] text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              Join Our Marketplace
              <ArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border-2 border-[#2ac12a] text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              href="#matter"
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
