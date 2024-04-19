import React from "react";

function Loading() {
  return (
    <div className="flex-center py-10 ">
      <div className="w-10 h-10 border border-black rounded-full inline-block relative box-border animate-spin">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-[2px] border-transparent rounded-full border-b-red-600"></div>
      </div>
    </div>
  );
}

export default Loading;
