import React, { useState, useEffect } from "react";
import Sidebar from "../../(components)/sidebar";
import { sidebarlistclient } from "../../(components)/sidebarclient";
import { getAuth } from "firebase/auth"; 
import { useParams } from "react-router-dom";

const ViewApplications = () => {
  const { jobid } = useParams();
  const [applications, setApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  const closeModal = () =>{
    setProfileData(null);
    setIsModalOpen(false);
    setSkillsModal(false);
  }
  const fetchApplications = async () => {
    if (jobid) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/jobs/${jobid}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          return;
        }
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const options = ["No Result", "Accepted", "Rejected"];

  const handleChange = async (event, applicationID) => {
    const selectedValue = event.target.value;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/applications/${applicationID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedValue }),
      });
      if (response.ok) {
        console.log("Status updated successfully!");
        setApplications((prevApplications) =>
          prevApplications.map((ap) =>
            ap.id === applicationID ? { ...ap, status: selectedValue } : ap
          )
        );
      } else {
        console.error("Failed to update status in the database");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  const viewProfileApplicant = async (email)=>{
    if (email) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/freelancer-info/${email}`);
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          return;
        }
        const data = await response.json();
        setProfileData(data);
        setIsModalOpen(true);
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    } 
  
  }
  const [compat, setCompat] = useState(null);
  const [matching, setMatching] = useState('');
  const [skillsModal, setSkillsModal] = useState(false);
  const viewCompatibility = async (emailId, jobId, applicantionId) => {
    console.log(emailId);
    console.log(jobId);
    if (emailId && jobId) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/compatibility`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            applicant_email: emailId,
            job_id: jobId,
            application_id: applicantionId
          })
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error:", errorText);
          return;
        }
  
        const data = await response.json();
        console.log(data.compatibility_percentage);
        setCompat(data.compatibility_percentage);
        console.log(typeof(data.matching_skills))
        let result="";
        var arr=data.matching_skills
        for(let i=0; i<arr.length; i++){
          result += arr[i];

          // Add a comma after each element except for the last one
          if (i < arr.length - 1) {
            result += ", ";
          }                                   
        }
        setMatching(result)
        setSkillsModal(true);
        console.log(matching)
        
      } catch (error) {
        console.error("Error fetching compatibility data:", error);
      }
    }
  };

  return (
    <>
      <main className="flex flex-row min-h-screen bg-gray-100 max-w-screen">
        <Sidebar sidebarList={sidebarlistclient} />
        <div className="ml-72 mx-auto w-vw">
          <h1 className="flex mt-6 text-3xl w-screen font-bold mb-6 text-center text-indigo-600 basis-1/4">
            Your Job Applications
          </h1>

          <div className="w-[80%] shadow-md rounded-md">
            <table className="table-auto w-full">
              <thead className="bg-slate-300 w-full">
                <tr>
                  <th>Applicant Email</th>
                  <th>Quote</th>
                  <th>View Profile</th>
                  <th>Compatibility</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((ap, index) => (
                  <tr
                    key={index}
                    className={`shadow-md ${
                      index % 2 === 0 ? "bg-blue-100" : "bg-white"
                    }`}
                  >
                    <td className="p-2 text-center">{ap.emailid}</td>
                    <td className="p-2 text-center">{ap.quote}</td>
                    <td className="p-2 text-center"><button className="bg-slate-50 p-1 rounded-md shadow-sm hover:bg-blue-200" onClick={()=>viewProfileApplicant(ap.emailid)}>View Profile</button></td>
                    <td className="p-2 text-center"><button className="bg-slate-50 p-1 rounded-md shadow-sm hover:bg-blue-300" onClick={()=>viewCompatibility(ap.emailid, ap.Jobid, ap.applicationID)}>
                    {
                    compat
                      ? `${compat.toFixed(1)}%`
                      : 'Click me'
                    }
                      </button></td>
                    <td className="p-2 text-center">
                      <select
                        id="dropdown"
                        className="p-1 rounded-sm"
                        onChange={(event) => handleChange(event, ap.applicationID)}
                      >
                        {options.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                
              </tbody>
            </table>
            {isModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
  
                          <h2 className="text-xl font-bold mb-4">Name: {profileData?.name}</h2>
                          <p>Email: {profileData?.email}</p>
                          <p>Skills: {profileData?.skills}</p>
                          <p>Portfolio Link: {profileData?.portfolio}</p>
                          <br/>
                          <button onClick={closeModal} className="bg-red-500 text-white p-1 rounded">
                            Close Modal
                          </button>
                        </div>
                      </div>
                    )}
                    {skillsModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
  
                          <h2 className="text-xl  mb-4">Matching Skills: {matching}</h2>
                          <br/>
                          <button onClick={closeModal} className="bg-red-500 text-white p-1 rounded">
                            Close Modal
                          </button>
                        </div>
                      </div>
                    )}
          </div>
        </div>
      </main>
    </>
  );
};

export default ViewApplications;
