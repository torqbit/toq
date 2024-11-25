import React from "react";

import { NextPage } from "next";
import AppLayout from "@/components/Layouts/AppLayout";

const SiteDesignPage: NextPage = () => {
  return (
    <AppLayout>
      <div style={{ padding: "20px 40px 0px 40px" }}>
        <h3>Site Design</h3>
      </div>
    </AppLayout>
  );
};

export default SiteDesignPage;
