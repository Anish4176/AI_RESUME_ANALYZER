import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

const resume = () => {
  const { id } = useParams();
  const { kv, fs } = usePuterStore();
  const [imageUrl, setimageUrl] = useState<string | null>(null);
  const [resumeUrl, setresumeUrl] = useState<string | null>(null);
  const [feedback, setfeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    const getResumeDetail = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const detail = JSON.parse(resume);
      const imageBlob = await fs.read(detail.imagePath);
      if (!imageBlob) return;
      const imageUrlCreated = URL.createObjectURL(imageBlob);
      setimageUrl(imageUrlCreated);

      const resumeBlob = await fs.read(detail.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setresumeUrl(resumeUrl);

      setfeedback(detail.feedback);
      console.log({resumeUrl, imageUrl, feedback: detail.feedback });
    }
    getResumeDetail();
  }, []);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-screen sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
