import { adminLinks, userLinks } from "../../assets/navLinks.mjs";
import { useAuth } from "../../assets/useAuth.mjs";
import Navbar from "../../components/Navbar";

const Profile = () => {
  const { auth, userData } = useAuth();

  return (
    <>
      <Navbar
        publicPage={false}
        navLinks={auth.userType === "Admin" ? adminLinks : userLinks}
      />
      <h1>First Name : {userData.firstName}</h1>
      <h1>Last Name : {userData.lastName}</h1>
      <h1>Email Name : {userData.email}</h1>
      <h1>Market Name : {userData.nearestMarket}</h1>
      <h1>Contact Name : {userData.contactNo}</h1>
      <h1>Address Name : {userData.address}</h1>
    </>
  );
};

export default Profile;
