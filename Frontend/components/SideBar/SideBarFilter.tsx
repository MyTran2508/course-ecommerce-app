import { Disclosure, RadioGroup } from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";
import { HiChevronUp } from "react-icons/hi";
import { Language, Level, Price, Topic } from "../../utils/data";
import DiscussionFilter from "../Discussion/DiscussionFilter";
import { SearchCourseRequest } from "@/types/request.type";

interface SideBarFilterProps {
  setSearchRequest: React.Dispatch<React.SetStateAction<SearchCourseRequest>>;
  setPage: (page: number) => void;
  topicId?: string;
}

function SideBarFilter(props: SideBarFilterProps) {
  const { setSearchRequest, setPage, topicId } = props;
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    topicId ? [topicId] : []
  );
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedPriceIsFree, setSelectedPriceIsFree] = useState<string[]>([]);

  useEffect(() => {
    setSearchRequest((prevSearchRequest) => ({
      ...prevSearchRequest,
      languageIds: selectedLanguages,
      topicIds: selectedTopics,
      levelIds: selectedLevels,
      ratingsLevel: null,
      pageIndex: 0,
    }));
    setPage(1);
  }, [selectedLanguages, selectedTopics, selectedLevels]);

  useEffect(() => {
    if (selectedPriceIsFree.length === 0 || selectedPriceIsFree.length === 2) {
      setSearchRequest((prevSearchRequest) => ({
        ...prevSearchRequest,
        isFree: null,
        pageIndex: 0,
      }));
      return;
    }
    if (selectedPriceIsFree[0] === "Free") {
      setSearchRequest((prevSearchRequest) => ({
        ...prevSearchRequest,
        isFree: true,
        pageIndex: 0,
      }));
    } else {
      setSearchRequest((prevSearchRequest) => ({
        ...prevSearchRequest,
        isFree: false,
        pageIndex: 0,
      }));
    }
    setPage(1);
  }, [selectedPriceIsFree]);

  return (
    <div className="p-1">
      <DiscussionFilter
        data={Language}
        selectedList={selectedLanguages}
        label={"Language"}
        setSelectedList={setSelectedLanguages}
      />
      <DiscussionFilter
        data={Level}
        selectedList={selectedLevels}
        label={"Level"}
        setSelectedList={setSelectedLevels}
      />
      <DiscussionFilter
        data={Topic}
        selectedList={selectedTopics}
        label={"Topic"}
        setSelectedList={setSelectedTopics}
      />
      <DiscussionFilter
        data={Price}
        selectedList={selectedPriceIsFree}
        label={"Price"}
        setSelectedList={setSelectedPriceIsFree}
      />
    </div>
  );
}

export default SideBarFilter;
