import { userLinks } from "../../assets/navLinks.mjs"
import Navbar from "../../components/Navbar"

const ShoppingList = () => {
  return (
    <>
       <Navbar publicPage={false} navLinks={userLinks} />
    </>
  )
}

export default ShoppingList
