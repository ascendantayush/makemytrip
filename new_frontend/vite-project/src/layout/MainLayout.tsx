import type { ReactNode } from "react"
import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen font-['Poppins']">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout

