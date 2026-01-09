import { motion } from "framer-motion";
import {  CheckCircle, Target, Zap } from "lucide-react";
import { slideInFromLeft, slideInFromRight, staggerContainer } from "./helper";

const VisionMissionSection = () => {
  // const missionPoints = [
  //   "To simplify and democratize online commerce",
  //   "To empower MSMEs and entrepreneurs through digital access",
  //   "To enhance purchasing power through innovative payment solutions",
  //   "To build trust, convenience, and value across every transaction",
  //   "To accelerate Africa's digital and financial inclusion",
  // ];

  return (
     <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12"
          >
            {/* Vision Card */}
            <motion.div
              variants={slideInFromLeft}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Our Vision
                </h2>
              </div>
              <p className="text-lg text-muted-foreground">
                To build a trusted, inclusive, and technology-driven commerce
                ecosystem that expands access to goods, services, and financial
                flexibility for individuals and businesses across Africa.
              </p>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              variants={slideInFromRight}
              className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  Our Mission
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground mb-4">
                  To simplify and democratize online commerce
                </p>
                <ul className="space-y-3">
                  {[
                    "Empower MSMEs and entrepreneurs through digital access",
                    "Enhance purchasing power through innovative payment solutions",
                    "Build trust, convenience, and value across every transaction",
                    "Accelerate Africa's digital and financial inclusion",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
};

export default VisionMissionSection;
