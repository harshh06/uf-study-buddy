"use client";
import React from "react";
import { useNavigationStore } from "../store/navigationStore";
import Dashboard from "../components/Dashboard/Dashboard";
import Quiz from "../components/Quiz/Quiz";
import Results from "../components/Results/Results";
import Topics from "../components/Topics/Topics";
import UploadSyllabus from "../components/UploadSyllabus/UploadSyllabus";

const MainContent = () => {
  const selected = useNavigationStore((s) => s.selected);

  switch (selected) {
    case "Dashboard":
      return <Dashboard />;
    case "Quiz":
      return <Quiz />;
    case "Results":
      return <Results />;
    case "Topics":
      return <Topics />;
    case "Upload Syllabus":
      return <UploadSyllabus />;
    default:
      return null;
  }
};

export default MainContent;
