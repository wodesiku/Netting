import { Nav } from "./landing/Nav";
import { Hero } from "./landing/Hero";
import { ProblemSolution } from "./landing/ProblemSolution";
import { HowItWorks } from "./landing/HowItWorks";
import { Proof } from "./landing/Proof";
import { Contracts } from "./landing/Contracts";
import { CTA } from "./landing/CTA";
import { Footer } from "./landing/Footer";
import "./Landing.css";

export function Landing() {
  return (
    <div className="landing">
      <Nav />
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Proof />
      <Contracts />
      <CTA />
      <Footer />
    </div>
  );
}
