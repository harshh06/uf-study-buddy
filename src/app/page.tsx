import Image from "next/image";
import NavigationSidePanel from "./components/NavigationSidePanel/NavigationSidePanel";
import MainContent from "./MainComponent/page";

export default function Home() {
  return (
    <div style={{ height: "100%" }}>
      <div style={{ height: "100%" }} className="flex">
        <NavigationSidePanel />
        <MainContent />
      </div>
    </div>
  );
}
