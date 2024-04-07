import React, { FC, Fragment, useEffect, useState } from "react";
import "./styles.scss";
import Header from "../../components/Header/Header";
import ConstructionApiRequest from "../../api/Construction/Construction";
import { ICreateObject } from "../../models/IControl";
import { IPaginationData } from "../../models/IPagination";

interface UsefullItem {
  id: number;
  link: string;
  name: string;
}

interface UsefullProps {
  results: UsefullItem[];
  count: number;
  next: string | null;
  previous: string | null;
}

const Reestr: FC = () => {
  return (
    <section className="section">
      <Header />
    </section>
  );
};

export default Reestr;
