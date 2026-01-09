import { motion } from "framer-motion";
import { 

  TrendingUp
} from "lucide-react";
import { fadeInUp, scaleIn, staggerContainer } from "./helper";

const FutureSection = () => {
  const futureItems = [
    "Consumer and merchant credit",
    "Embedded fintech solutions",
    "Cross-border trade",
    "Data-driven personalization",
    "Strategic ecosystem partnerships",
  ];

  return (
   <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-4"
            >
              Future Roadmap
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-4 text-foreground"
            >
              Looking Ahead
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-muted-foreground max-w-3xl mx-auto"
            >
              Evolving into a pan-African commerce and financial services
              platform
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {futureItems.map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-card to-card/50 rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mb-4 mx-auto">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-center font-medium text-foreground">
                  {item}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  );
};

export default FutureSection;
