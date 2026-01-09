import { motion } from "framer-motion";
import { 
  CreditCard,
  Shield, 
} from "lucide-react";
import { slideInFromLeft, slideInFromRight, staggerContainer } from "./helper";

const BNPLSection = () => {

  return (
    <section className="py-20 px-4">
           <div className="container mx-auto max-w-6xl">
             <motion.div
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true }}
               variants={staggerContainer}
               className="grid lg:grid-cols-2 gap-12 items-center"
             >
               <motion.div variants={slideInFromLeft}>
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-primary/10 rounded-lg">
                     <CreditCard className="w-6 h-6 text-primary" />
                   </div>
                   <span className="font-semibold text-primary">
                     Key Differentiator
                   </span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                   Buy Now, Pay Later <br />
                   <span className="text-primary">Empowering Your Purchases</span>
                 </h2>
                 <p className="text-lg text-muted-foreground mb-8">
                   Our innovative BNPL offering increases affordability and drives
                   inclusive commerce across Africa.
                 </p>
   
                 <div className="space-y-6">
                   {[
                     "Customers can purchase items instantly and pay in installments",
                     "Approved users gain access to short-term, interest-friendly credit",
                     "Payments are structured to align with users' cash flow",
                     "Merchants receive upfront payment, improving liquidity",
                     "Consumers enjoy greater purchasing power without financial strain",
                   ].map((benefit, index) => (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0, x: -20 }}
                       whileInView={{ opacity: 1, x: 0 }}
                       viewport={{ once: true }}
                       transition={{ delay: index * 0.1 }}
                       className="flex items-start gap-3"
                     >
                       <div className="p-1 bg-primary/10 rounded-full mt-1">
                         <div className="w-2 h-2 bg-primary rounded-full" />
                       </div>
                       <span className="text-foreground">{benefit}</span>
                     </motion.div>
                   ))}
                 </div>
               </motion.div>
   
               <motion.div variants={slideInFromRight} className="relative">
                 <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl p-8 border border-border">
                   <div className="space-y-6">
                     <div className="bg-white dark:bg-card rounded-xl p-6 shadow-lg">
                       <div className="flex justify-between items-center mb-4">
                         <div>
                           <h4 className="font-bold text-lg text-foreground">
                             BNPL Advantage
                           </h4>
                           <p className="text-sm text-muted-foreground">
                             Sustainable & Trusted Ecosystem
                           </p>
                         </div>
                         <Shield className="w-8 h-8 text-primary" />
                       </div>
                       <div className="space-y-4">
                         <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                           <span className="text-foreground">Risk Assessment</span>
                           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                         </div>
                         <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                           <span className="text-foreground">
                             Transaction Monitoring
                           </span>
                           <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                         </div>
                         <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                           <span className="text-foreground">
                             Repayment Tracking
                           </span>
                           <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </motion.div>
             </motion.div>
           </div>
         </section>
  );
};

export default BNPLSection;
