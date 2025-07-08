"use client";
import React from "react";
import { useNavigationStore } from "../../store/navigationStore";
import styles from "./NavigationSidePanel.module.css";

const navOptions = [
  "Dashboard",
  "Upload Syllabus",
  "Topics",
  "Quiz",
  "Results",
] as const;

const NavigationSidePanel = () => {
  const selected = useNavigationStore((s) => s.selected);
  const setSelected = useNavigationStore((s) => s.setSelected);

  return (
    <div className={styles.navPanel}>
      UF Study Buddy
      <div>
        {navOptions.map((option) => (
          <div
            key={option}
            style={{
              fontWeight: selected === option ? "bold" : "normal",
              cursor: "pointer",
            }}
            onClick={() => setSelected(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavigationSidePanel;
