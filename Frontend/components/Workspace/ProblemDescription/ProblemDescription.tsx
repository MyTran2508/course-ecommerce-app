import { Problem } from "../../../types/problem.type";
import { useState } from "react";

type ProblemDescriptionProps = {
  problem: Problem;
  _solved: boolean;
};

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({
  problem,
  _solved,
}) => {
  return (
    <div className="bg-dark-layer-1">
      {/* TAB */}
      <div className="flex h-11 w-full items-center pt-2 bg-dark-layer-2 text-white overflow-x-hidden">
        <div
          className={
            "bg-dark-layer-1 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"
          }
        >
          Description
        </div>
      </div>

      <div className="flex px-0 py-4 h-[calc(100vh-94px)] overflow-y-auto">
        <div className="px-5">
          {/* Problem heading */}
          <div className="w-full">
            <div className="flex space-x-4">
              <div className="flex-1 mr-2 text-lg text-white font-medium">
                {problem?.title}
              </div>
            </div>
            {/* Constraints
            <div className="my-8 pb-4">
              <div className="text-white text-sm font-medium">Constraints:</div>
              <ul className="text-white ml-5 list-disc ">
                <div dangerouslySetInnerHTML={{ __html: problem.id }} />
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProblemDescription;
