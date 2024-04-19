"use client";
import CourseCardSearch from "@/components/Card/CourseCardSearch";
import Paginate from "@/components/Paginate/Paginate";
import SideBarFilter from "@/components/SideBar/SideBarFilter";
import { useFilterCourseMutation } from "@/redux/services/courseApi";
import { Course } from "@/types/course.type";
import { SearchCourseRequest } from "@/types/request.type";
import { usePathname, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useState } from "react";
import { MdFilterList, MdFilterListOff } from "react-icons/md";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterSortBy } from "@/utils/resources";
import Loading from "../../user/personal/loading";

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const topicId = searchParams.get("topicId");
  const [keyword, setKeyword] = useState(query);
  const [isOpenFilter, setOpenFilter] = useState(true);
  const [sortBy, setSortBy] = useState(FilterSortBy.NEWEST.toString());
  const [searchRequest, setSearchRequest] = useState<SearchCourseRequest>({
    keyword: keyword,
    pageIndex: 0,
    pageSize: 5,
    filterSortBy: sortBy,
    // topicIds: topicId ? [topicId] : [],
  });
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [coursesSearch, setCourseSearch] = useState<Course[]>([]);
  const [searchCourse] = useFilterCourseMutation();
  const [isLoading, setIsLoading] = useState(true);

  const handleClickOpenFilter = () => {
    setOpenFilter(!isOpenFilter);
  };
  const handleSearch = async () => {
    await searchCourse(searchRequest)
      .unwrap()
      .then((fulfilled) => {
        console.log(fulfilled);
        setCourseSearch(fulfilled.data as Course[]);
        setTotalPage(fulfilled.totalPages);
        setTotalRecord(fulfilled.totalRecords);
      });
    setIsLoading(false);
  };
  // useEffect(() => {
  //   handleSearch();
  // }, []);

  useEffect(() => {
    setIsLoading(true);
    handleSearch();
  }, [searchRequest]);

  useEffect(() => {
    setSearchRequest((prevSearchRequest) => ({
      ...prevSearchRequest,
      pageIndex: page - 1,
    }));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    if (query !== keyword) {
      setKeyword(query as string);
      setSearchRequest((prevSearchRequest) => ({
        ...prevSearchRequest,
        keyword: query,
      }));
    }
  }, [query]);

  useEffect(() => {
    if (sortBy !== FilterSortBy.NONE) {
      setSearchRequest((prevSearchRequest) => ({
        ...prevSearchRequest,
        filterSortBy: sortBy,
      }));
    }
  }, [sortBy]);

  return (
    <div>
      <div>
        <div className="mx-24 mt-10 xs:mx-0 xs:relative">
          <div className="flex-between">
            {isOpenFilter ? (
              <Fragment>
                <div className="flex gap-2">
                  <div
                    className="flex gap-2 border px-2 py-1 items-center hover: cursor-pointer border-black w-max"
                    onClick={() => handleClickOpenFilter()}
                  >
                    <MdFilterList /> Filter
                  </div>
                  <div
                    className="flex gap-2 border px-2 py-1 items-center hover: cursor-pointer border-black w-max"
                    onClick={() => handleClickOpenFilter()}
                  >
                    Sort by
                    <Select
                      onValueChange={(e) => setSortBy(e)}
                      defaultValue={FilterSortBy.NEWEST}
                    >
                      <SelectTrigger
                        className={
                          "border-none disabled:opacity-1 disabled:cursor-default w-[150px]"
                        }
                      >
                        <SelectValue
                          placeholder="Sort by"
                          className="text-sm w-full"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sort by</SelectLabel>

                          <SelectItem value={FilterSortBy.NEWEST}>
                            {FilterSortBy.NEWEST}
                          </SelectItem>
                          <SelectItem value={FilterSortBy.POPULAR}>
                            {FilterSortBy.POPULAR}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div
                  className="flex gap-2 border px-2 py-3 items-center hover: cursor-pointer border-black w-max"
                  onClick={() => handleClickOpenFilter()}
                >
                  <MdFilterListOff /> Filter
                </div>
              </Fragment>
            )}
            <div>{totalRecord} kết quả</div>
          </div>

          <div className={`flex mt-2 xs:mt-0 ${isOpenFilter ? "gap-5" : ""}`}>
            <div
              className={`${
                isOpenFilter ? "w-3/12" : "transform -translate-x-full "
              } transition-transform duration-300`}
            >
              <div
                className={`${
                  isOpenFilter ? "" : "hidden"
                } sticky top-20 xs:top-14 xs:absolute h-full xs:w-full xs:z-30 xs:min-h-[750px]`}
              >
                <SideBarFilter
                  setSearchRequest={setSearchRequest}
                  setPage={setPage}
                  topicId={topicId as string}
                />
              </div>
            </div>
            <div className="w-full flex flex-col">
              {isLoading ? (
                <Loading />
              ) : (
                <Fragment>
                  {coursesSearch.length !== 0 ? (
                    <Fragment>
                      {coursesSearch.map((course, index) => {
                        return (
                          <div key={index} className="xs:mx-1">
                            <CourseCardSearch course={course} />
                            {coursesSearch.length - 1 !== index ? <hr /> : ""}
                          </div>
                        );
                      })}
                    </Fragment>
                  ) : (
                    <div className="text-2xl flex-center">
                      Không tìm thấy kết quả phù hợp
                    </div>
                  )}
                  <div className="flex-center">
                    {coursesSearch.length !== 0 ? (
                      <Paginate
                        totalPage={totalPage}
                        currentPage={page}
                        setCurrentPage={setPage}
                      />
                    ) : null}
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
