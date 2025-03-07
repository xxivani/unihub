import './Dashboard.css'
import Sidebar from '../../components/committee-dashboard/Sidebar';
import Title from '../../components/committee-dashboard/Title';
import ClubStatistics from '../../components/committee-dashboard/ClubStatistics';
import UpdateLinks from '../../components/committee-dashboard/UpdateLinks';
import Members from '../../components/committee-dashboard/Members';
import CurrentEvent from '../../components/committee-dashboard/CurrentEvent';

const Dashboard = () => {
    return (
      <div className="entity6-dashboard">
        <Title />
        <div className="entity6-dashboard-part2">
          <Sidebar />
          <ClubStatistics />
          <div className="entity6-dashboard-part3">
            <CurrentEvent />
            <UpdateLinks />
          </div>
        </div>  
        <Members />      
      </div>
    );
  };
  
export default Dashboard;
  