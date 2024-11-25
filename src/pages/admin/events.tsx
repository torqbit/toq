import React from "react";

import Layout2 from "@/components/Layouts/Layout2";
import { NextPage } from "next";
import EventList from "@/components/Events/EventList";

const Dashboard: NextPage = () => {
  return (
    <Layout2>
      <div style={{ padding: "20px 40px 0px 40px" }}>
        <h3>Events</h3>
        <EventList />
      </div>
    </Layout2>
  );
};

export default Dashboard;
