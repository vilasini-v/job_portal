import { sidebarlistfree } from "../../(components)/sidebarfreelancer";
import { useState, useEffect } from "react";
import Sidebar from "../../(components)/sidebar";
import { getAuth } from "firebase/auth";

const FreelancerJobs = () => {
    const [jobs, setJobs] = useState([]); // State to store job postings
    const [showModal, setShowModal] = useState(false); // State to handle modal visibility
    const [resumeFile, setResumeFile] = useState(null); // State to store resume file
    const [jobId, setJobId] = useState(""); // State to store the job ID being applied for
    const auth = getAuth();
    const [applyJobData, setApplyJobData] = useState({
        quote: '',
    });

    const fetchJobs = async () => {
        const clientUsername = auth.currentUser ? auth.currentUser.email : null;
        if (clientUsername) {
            try {
                const response = await fetch(`http://127.0.0.1:5000/api/jobs`);
                if (!response.ok) {
                    const errorText = await response.text(); // Get the error text
                    console.error("Server error:", errorText);
                    return;
                }
                const data = await response.json();
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        }
    }

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResumeFile(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setApplyJobData({
            ...applyJobData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = auth.currentUser;
        const freelancerUid = currentUser.uid;
        const freelancerEmail = currentUser.email;
        console.log(freelancerEmail)
        const newApplication = {
            ...applyJobData,
            applicantID: freelancerUid,
            applicantEmail: freelancerEmail,
            jobid: jobId,
            resume: resumeFile
        };
        console.log(jobId)

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newApplication), // Send the new job with the client username
            });

            if (!response.ok) {
                const errorText = await response.text(); // Get the error text
                console.error("Server error:", errorText);
                return;
            }

            const data = await response.json(); // This will contain the response from the server
            console.log('Response from server:', data);

            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

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
                                    <p className="text-gray-600 mt-2">{job.description}</p>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500">Salary: {job.salary}</p>
                                        <p className="text-sm text-gray-500">Location: {job.location}</p>
                                        <p className="text-sm text-gray-500">Tags: {job.tags}</p>
                                        <button
                                            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                                            onClick={() => {
                                                setJobId(job.Jobid);
                                                console.log(job.Jobid);
                                                setShowModal(true);
                                            }}
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No jobs available.</p>
                        )}
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Apply for Job</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Upload Resume</label>
                                        <input
                                            type="file"
                                            name="resume"
                                            onChange={handleFileUpload}
                                            accept='.pdf, .doc, .docx'
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700">Job Quote</label>
                                        <input
                                            type="text"
                                            name="quote"
                                            value={applyJobData.quote}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            placeholder="Enter your quote"
                                        />
                                    </div>

                                    {/* Modal actions */}
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default FreelancerJobs;
