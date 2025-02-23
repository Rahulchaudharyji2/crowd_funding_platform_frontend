import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import NavBar from "../Components/navbar_notLanding";
import Campaign from "../Components/everyOngoingCampaigns";
import Pagination from "../Components/pagination";
import Loader from "../Components/loaderFullPage";
import ScrollToTop from "../Components/scrollToTop";
import { paginate } from "../utills/paginate";
import { getAllCampaigns } from "../services/campaign";
import { compare } from "../utills/math";
import styles from "../Components/styles/allCampaigns.module.css";

const AllCampaigns = (props) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    async function getData() {
      const { data, err } = await getAllCampaigns();
      if (err === undefined) {
        setLoading(false);
        data.sort(compare);
        setData(data);
      } else {
        if (err.response && err.response.data) {
          toast.error(err.response.data.message);
        } else toast.error("Something went wrong");
      }
    }
    getData();
    return null;
  }, []);
  const handleClick = (p) => {
    let url = "/campaign/" + p;
    props.history.push(url);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageSize = 6;
  const allCampaigns = paginate(data, currentPage, pageSize);
  return (
    <React.Fragment >
      <NavBar />
      <div className="background" style={{backgroundColor:"rgb(4, 4, 6)"}}>
      <ScrollToTop />
      {loading && <Loader />}
      <div className={styles.header} style={{color:"rgb(213, 114, 9)"}}>
        <p>All Campaigns</p>
      </div>
      <div className={`row ${styles.section}`} style={{color:"white"}}>
        {allCampaigns.map((d) => (
          <div key={d._id} className={`col-md-6 col-12 ${styles.campaign}`}>
            <Campaign
              id={d._id}
              handleClick={handleClick}
              title={d.title}
              description={d.description}
              image={d.imageUrl}
              requiredAmount={d.required}
              isActivated={d.isActivated}
            />
          </div>
        ))}
      </div>
      <Pagination
        itemsCount={data.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      </div>
    </React.Fragment>
  );
};

export default AllCampaigns;
