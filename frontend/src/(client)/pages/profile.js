  import Sidebar from "../../(components)/sidebar";
  import { useEffect, useState } from "react";
  import { onAuthStateChanged } from "firebase/auth";
  import { auth } from '../../firebase';
  import { sidebarlistclient } from "../../(components)/sidebarclient";
  import { useNavigate } from "react-router-dom";
  
  const ProfileClient = () => {
    const [currentUser, setCurrentUser] = useState();
    const navigate = useNavigate();
    const [a, setA]=useState();
    const [info, setInfo] = useState({});
// Correctly called at the top
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          const uid = currentUser.uid;
          setA({ uid: currentUser.uid }); // Ensure setUser is defined
          console.log("uid", uid);
          setCurrentUser(currentUser); // Set the current user here
        } else {
          console.log("user is logged out");
        }
      });
      
      return () => unsubscribe(); // Cleanup subscription on unmount
    }, [setA]);
  
    useEffect(() => {
      if (currentUser) {
        const checkUserProfile = async () => {
          try {
            const response = await fetch(`http://127.0.0.1:5000/api/check-profile-clients`, {
              method: 'POST',
              headers: {
                'Content-type': 'application/json',
              },
              body: JSON.stringify({ uid: currentUser.uid }),
            });
            console.log('response status: ', response.status);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
    
            const userData = await response.json();
            if (!userData.profileCompleted) {
              navigate('/client-profile-setup');
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        };
    
        checkUserProfile();
      }
    }, [currentUser, navigate]);

    const ProfileInfo = async () => {
      const clientUsername = auth.currentUser ? auth.currentUser.uid : null;
      if (clientUsername) {
        console.log(clientUsername);
          try {
              const response = await fetch(`http://127.0.0.1:5000/api/client-profile/${clientUsername}`);
              if (!response.ok) {
                  const errorText = await response.text(); // Get the error text
                  console.error("Server2 error:", errorText);
                  return;
              }
              const data = await response.json();
              setInfo(data);
              console.log(data); // Update the jobs state with the fetched data
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      }
    };
    useEffect(() => {
      if (currentUser) {
        ProfileInfo();
      }
    }, [currentUser]); 

    return (
      <div className="flex">
        <Sidebar sidebarList={sidebarlistclient} />
        
        <div className="min-h-screen w-full bg-gray-100 flex-col flex ml-60 justify-center pt-2 p-10">
          {info && info.clientUsername ? ( // Ensure data is available before rendering
            <>
              <div key={info.uid} className="flex flex-row items-center gap-6 content-center">
                <img
                  className="w-36 h-36 rounded-full object-cover border-2 border-indigo-600"
                  src={info.pfp || "https://via.placeholder.com/100"} // Fallback if pfp is not available
                  alt="Client"
                />
                <div className="flex flex-col">
                  <h2 className="mt-4 text-xl font-semibold text-gray-800">{info.clientUsername}</h2>
                  <p className="text-sm text-gray-600">{info.companyName}, {info.industry}</p>
                </div>
              </div>
    
              <div className="mt-6">
                <h3 className="text-gray-800 text-lg font-medium">Profile Overview</h3>
                <p className="mt-2 text-gray-600 text-sm">Name: {info.name}</p>
                <p className="mt-2 text-gray-600 text-sm">Email: {info.email}</p>
                <p className="mt-1 text-gray-600 text-sm">Location: {info.location}</p>
              </div>
            </>
          ) : (
            <div>Loading profile...</div> // Show a loading message while the data is fetched
          )}
        </div>
      </div>
    );
  }
    
export default ProfileClient;
