import React, { useState, useEffect } from "react";
import Sidebar from "../../(components)/sidebar";
import { sidebarlistclient } from "../../(components)/sidebarclient";
import { getAuth } from "firebase/auth"; // Import Firebase Auth
import { useNavigate } from "react-router-dom";

const ClientJobs = () => {
  const [jobs, setJobs] = useState([]); // State to store job postings
  const auth = getAuth();
  // Firebase Auth
  const fetchJobs = async () => {
    const clientUsername = auth.currentUser ? auth.currentUser.email : null;
    if (clientUsername) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/api/client-jobs/${clientUsername}`);
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
};
const navigate = useNavigate();


  // Fetch jobs when the component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  const viewApplications = (jobid) => {
    console.log(jobid);
    navigate(`${jobid}`)
  };

  // Modal visibility state
  const [showModal, setShowModal] = useState(false);

  // New job form inputs
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    tags:"",
  });

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  // Function to add a new job to the backend
  const addJob = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser; 
    const clientUsername = currentUser.email || currentUser.uid;  // Choose preferred field
    // Get the username from Firebase Auth
    const newJobWithClient = {
        ...newJob,
        clientUsername: clientUsername,  // Add client info
    };
    try {
        const response = await fetch('http://127.0.0.1:5000/api/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newJobWithClient), // Send the new job with the client username
        });

        if (!response.ok) {
            const errorText = await response.text(); // Get the error text
            console.error("Server error:", errorText);
            return;
        }

        const data = await response.json(); // This will contain the response from the server
        console.log('Response from server:', data);

        // After adding a job, fetch all jobs again to ensure the list is up-to-date
        fetchJobs();
        setNewJob({ title: "", description: "", salary: "", location: "", tags:"" }); // Clear the form
        setShowModal(false); // Close the modal
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};


  return (
    <main className="flex flex-row min-h-screen bg-gray-100 max-w-screen">
      <Sidebar sidebarList={sidebarlistclient} />
      <div className="ml-72 mx-auto w-screen">
        <div className="flex flex-row items-start mt-6">
          <h1 className="text-3xl w-screen font-bold mb-6 text-center text-indigo-600 basis-1/4">Your Job Postings</h1>
          {/* Add Job Button */}
          <div className=" flex basis-3/4 place-items-end">
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-300"
              onClick={() => setShowModal(true)}
            >
              Add Job
            </button>
          </div>
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
                    onClick={() => viewApplications(job.Jobid)}
                >
                    View Applications
                </button>
            </div>
        </div>
    ))
) : (
    <p>No jobs available.</p>
)}


        </div>

        {/* Modal for adding a new job */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Job</h2>

              {/* Form inputs for job details */}
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newJob.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter job title"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter job description"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={newJob.salary}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter salary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={newJob.location}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter job location"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={newJob.tags}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter tags"
                  />
                </div>

                {/* Modal actions */}
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    onClick={addJob}
                  >
                    Add Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ClientJobs;
