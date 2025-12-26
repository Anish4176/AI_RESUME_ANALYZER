import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ai Resume Analyzer" },
    {
      name: "AI Resume Analyzer",
      content:
        "An AI-powered tool that analyzes your resume against job roles and provides clear, actionable feedback.",
    },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [loadingResume, setloadingResume] = useState(false);
  const [resumes, setresumes] = useState<Resume[]>([]);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      setloadingResume(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      console.log(resumes);
      const parsedResume = resumes?.map((resume) => {
        return JSON.parse(resume.value) as Resume;
      });
      setresumes(parsedResume || []);
      setloadingResume(false);
    };
    loadResume();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-section">
        <Navbar />
        <div className="page-heading py-10">
          <h1>Track Your Applications & Resume Ratings</h1>
          {!loadingResume && resumes?.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback.</h2>
          )}
        </div>
        {loadingResume && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-50" />
          </div>
        )}

        {!loadingResume && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => {
              return <ResumeCard key={resume.id} resume={resume} />;
            })}
          </div>
        )}
        {!loadingResume && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-2  gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
      </section>
    </main>
  );
}
