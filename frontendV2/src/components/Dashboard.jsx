import RunProvider from "../context/RunProvider";
import Chart from "./Chart";
import Header from "./Header";
import Records from "./Records";

export default function Dashboard() {
  return (
    <div>
      <RunProvider>
        <Records />
        <Chart />
      </RunProvider>
    </div>
  );
}
