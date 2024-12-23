import { adminLinks } from "../../assets/navLinks.mjs"
import Navbar from "../../components/Navbar"

const Dashboard = () => {
  return (
      <>
          <Navbar publicPage={false} navLinks={adminLinks} />
        </>
  )
}

export default Dashboard
