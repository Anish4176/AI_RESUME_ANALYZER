import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ai Resume Analyzer" },
    { name: "AI Resume Analyzer", content: "An AI-powered tool that analyzes your resume against job roles and provides clear, actionable feedback." },
  ];
}

export default function Home() {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-section">
        <Navbar />
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>
          <h2>Review your submission and check AI powered feedback</h2>
        </div>

        <div className="resumes-section">
          {resumes.map((resume) => {
            return <ResumeCard resume={resume} />;
          })}
        </div>
      </section>
    </main>
  );
}
