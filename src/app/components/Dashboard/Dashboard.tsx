import React from "react";
import styles from "./Dashboard.module.css";

const ProgressCard = ({
  title,
  progress,
}: {
  title: string;
  progress: string;
}) => {
  return (
    <div className={styles.progressCard}>
      <div>{title}</div>
      <div>{progress}</div>
    </div>
  );
};

const CourseCards = ({
  courseId,
  courseName,
  courseCredits,
  profName,
  progress,
}: {
  courseId: string;
  courseName: string;
  courseCredits: number;
  profName: string;
  progress: string;
}) => {
  return (
    <div className={styles.courseCard}>
      <div>
        <div>
          <div>{courseId}</div>
          <div>{courseName}</div>
          <div>{profName}</div>
        </div>
        <div>{courseCredits}</div>
      </div>
      <div>
        <div>Progress {progress}</div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div>Course Dashboard</div>
      <div>Track your progress across all courses.</div>
      <div className={styles.progressCardsContainer}>
        <ProgressCard title="Total Courses" progress="75% completed" />
        <ProgressCard title="Total Credits" progress="50% completed" />
        <ProgressCard title="Avg progress" progress="90% completed" />
        <ProgressCard title="Completed Topics" progress="90% completed" />
      </div>
      <div>
        <div>Course Details</div>
        <div className={styles.courseCardsContainer}>
          <CourseCards
            courseId="CSE101"
            courseName="Introduction to Computer Science"
            courseCredits={3}
            profName="Dr. Smith"
            progress="75%"
          />
          <CourseCards
            courseId="MTH102"
            courseName="Calculus I"
            courseCredits={4}
            profName="Dr. Johnson"
            progress="80%"
          />
          <CourseCards
            courseId="PHY103"
            courseName="Physics I"
            courseCredits={3}
            profName="Dr. Lee"
            progress="90%"
          />
          <CourseCards
            courseId="BIO104"
            courseName="Biology I"
            courseCredits={3}
            profName="Dr. Brown"
            progress="85%"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
