import { motion } from "framer-motion";
import { 
  
  Users, 
  CheckCircle
} from "lucide-react";
import { slideInFromLeft, slideInFromRight, staggerContainer } from "./helper";

const WhyWeMatter = () => {
  const audienceItems = [
    "MSMEs and informal traders",
    "Online shoppers seeking flexibility and trust",
    "Service providers and logistics partners",
    "Brands looking to scale across Nigeria and Africa",
  ];

  const gapItems = [
    "Empowering small and medium-sized businesses with digital tools",
    "Expanding market access beyond physical locations",
    "Improving consumer affordability through payment flexibility",
    "Promoting financial inclusion for underserved populations",
    "Strengthening local value chains and digital trade infrastructure",
  ];

  return (
    <section className="py-20 px-4" id="matter">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-12"
          >
            <motion.div variants={slideInFromLeft}>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
                Why <span className="text-primary">9jacart</span> Matters
              </h2>
              <div className="space-y-6">
                {gapItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-lg text-muted-foreground">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={slideInFromRight}>
              <div className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-8 border border-border">
                <h3 className="text-2xl font-bold mb-6 text-foreground">
                  Who We Serve
                </h3>
                <div className="space-y-4">
                  {audienceItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      <Users className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
};

export default WhyWeMatter;
