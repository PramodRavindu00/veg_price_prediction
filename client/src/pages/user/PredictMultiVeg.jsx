import { userLinks } from "../../assets/navLinks.mjs"
import Navbar from "../../components/Navbar"

const PredictMultiVeg = () => {
  return (
    <>
      <Navbar publicPage={false} navLinks={userLinks} />
    </>
  )
}

export default PredictMultiVeg
