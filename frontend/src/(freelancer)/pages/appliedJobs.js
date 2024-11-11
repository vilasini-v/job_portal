import Sidebar from "../../(components)/sidebar";
import { sidebarlistfree } from "../../(components)/sidebarfreelancer";
import React, {useState, useEffect} from "react";
import { getAuth } from "firebase/auth";

const AppliedJobs = () => {
    const auth = getAuth();
    const [jobs, setJobs] = useState([]);
    const fetchAppliedJobs = async ()=>{
        const applicantID = auth.currentUser ? auth.currentUser.uid : null;
        if(applicantID){
            try{
                const response = await fetch(`http://127.0.0.1:5000/api/apply/${applicantID}`)
                if (!response.ok) {
                    const errorText = await response.text(); // Get the error text
                    console.error("Server error:", errorText);
                    return;
                }
                const data = await response.json();
                setJobs(data);
            }catch(error){
                console.error("Error fetching jobs:", error);
            }
        }
    }
    
    
    useEffect(() => {
        fetchAppliedJobs();
    }, []);
   
    return (
        <>
            <main className="flex flex-row min-h-screen bg-gray-100 max-w-screen">
                <Sidebar sidebarList={sidebarlistfree} />
                <div className="ml-72 mx-auto w-screen">
                    <div className="flex flex-row items-start mt-6">
                        <h1 className="text-3xl w-screen font-bold mb-6 text-center text-indigo-600 basis-1/4">All Job Postings</h1>
                    </div>
                    <div className="grid gap-6 grid-cols-3 w-9/12">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div key={job._id} className="bg-white p-4 rounded-lg shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                                    <p className="text-gray-600 mt-2">{job.desc}</p>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">Quote: {job.quote}</p>                                        
                                    </div>
                                    <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                                    {job.status}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No jobs available.</p>
                        )}
                    </div>
                    </div>
                    </main>

                    </>
    );
}
 
export default AppliedJobs;