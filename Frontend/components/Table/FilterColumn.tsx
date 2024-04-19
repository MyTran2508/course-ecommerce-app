import React, { Fragment, useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks/reduxHooks";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  setIsApprovedSearch,
  setIsAwaitingApprovalSearch,
} from "@/redux/features/courseSlice";
interface FilterColumnProps {
  name: string;
}

const FilterColumn = (props: FilterColumnProps) => {
  const { name } = props;
  const [columName, setColumnName] = useState("");
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    let searchQuery: string | null = selected ?? null;
    if (selected === "all") {
      searchQuery = null;
    }
    if (name === "isApproved") {
      setColumnName("Đã");
      dispatch(setIsApprovedSearch(searchQuery));
    } else {
      setColumnName("Chờ");
      dispatch(setIsAwaitingApprovalSearch(searchQuery));
    }
  }, [name, selected]);

  return (
    <div>
      <Select onValueChange={(e) => setSelected(e)} defaultValue="all">
        <SelectTrigger
          className={`disabled:opacity-1 disabled:cursor-default w-[150px] border-none`}
        >
          {columName} Phê Duyệt
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={"all"}>{"Tất cả"}</SelectItem>
            <SelectItem value={"true"}>{"True"}</SelectItem>
            <SelectItem value={"false"}>{"False"}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterColumn;
