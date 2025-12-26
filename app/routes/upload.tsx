import React, { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { prepareInstructions } from "~/constants";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const upload = () => {
  const {auth} =usePuterStore();
    const navigate=useNavigate();
    useEffect(()=>{
      if(!auth.isAuthenticated)navigate('/auth?next=/');
    },[auth.isAuthenticated])
  const {fs,ai,kv}=usePuterStore();
  const [file, setfile] = useState<File | null>(null);
  const [statusText, setstatusText] = useState("");
  const [isProcessing, setisProcessing] = useState(false);
  interface formDataProps{
    companyName:string;
    jobTitle:string;
    jobDescription:string;
    file:File;
  }
  const handleAnalyze=async({companyName,jobTitle,jobDescription,file}:formDataProps)=>{
     setisProcessing(true);
     setstatusText('Uploading the file...');
     const uploadedFile=await fs.upload([file]);
     if(!uploadedFile) return setstatusText('Error: Failed to upload file');

     setstatusText('Conveting to image...');
     const convertedImage= await convertPdfToImage(file);
     if(!convertedImage.file) return setstatusText('Error:Failed to convert image')


     setstatusText('Uploading the image...');
     const uploadedImage = await fs.upload([convertedImage.file]);
     if(!uploadedImage) return setstatusText('Error: Failed to upload image');

     setstatusText('Preparing data...');
     const uuid = generateUUID();
     const data = {
         id: uuid,
         resumePath: uploadedFile.path,
         imagePath: uploadedImage.path,
         companyName, jobTitle, jobDescription,
         feedback: '',
     }
     await kv.set(`resume:${uuid}`, JSON.stringify(data));

     setstatusText('Analyzing...');
     const feedback=await ai.feedback(
        uploadedFile.path,
        prepareInstructions({jobTitle,jobDescription})
     )
     if (!feedback) return setstatusText('Error: Failed to analyze resume');

     const feedbackResult= typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text;
     
     data.feedback=JSON.parse(feedbackResult);
     await kv.set(`resume:${uuid}`,JSON.stringify(data));
     setstatusText('Analysis complete, redirecting...');
     console.log(data);
     navigate(`/resume/${uuid}`);
  }
  const handleSubmit=async(formData:FormData)=>{
     try{
        if(!file){
            return ;
         }
        const companyName=formData.get("company-name") as string;
        const jobTitle=formData.get("job-title") as string;
        const jobDescription=formData.get("job-description") as string;

        handleAnalyze({companyName,jobTitle,jobDescription,file});

     }catch(e){
        console.log(e);
     }
     
  }
  const handleFileSelect=(file:File | null)=>{
    setfile(file);
  }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
      <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-1/2" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" action={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
      </section>
    </main>
  );
};

export default upload;
