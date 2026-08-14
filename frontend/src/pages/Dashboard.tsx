import MainView from "../components/MainView"
import SideView from "../components/SideView"

const Dashboard = () => {
  return (
    <section className="p-2 flex justify-between">

      <div className="w-[58%] mx-2">
        <MainView />
      </div>

      <div className="w-[38%] mx-2">
        <SideView />
      </div>    

    </section>
  )
}

export default Dashboard
