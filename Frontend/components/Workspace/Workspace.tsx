import { useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import { Problem } from "@/types/problem.type";

type WorkspaceProps = {
  problem: Problem;
};

const Workspace: React.FC<WorkspaceProps> = ({ problem }) => {
  const [success, setSuccess] = useState(false);
  const [solved, setSolved] = useState(false);

  return (
    <>
      <Split className="split bg-dark-layer-1">
        <ProblemDescription problem={problem} _solved={solved} />
        <div className="bg-black">
          <Playground
            problem={problem}
            setSuccess={setSuccess}
            setSolved={setSolved}
          />
        </div>
      </Split>
    </>
  );
};
export default Workspace;
