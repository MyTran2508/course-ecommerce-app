import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { Course } from "@/types/course.type";
import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

function SearchBarManufacturer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [manufacturer, setManufacturer] = useState("");
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const { data: courseData, isSuccess } = useGetAllCourseQuery(null);

  useEffect(() => {
    if (isSuccess) {
      setCourses(courseData?.data as Course[]);
    }
  }, [courseData]);

  const filterManufacturer =
    manufacturer === ""
      ? courses
      : courses.filter((index) =>
          index.name
            .toLowerCase()
            .replace("/s+/g", "")
            .includes(manufacturer.toLowerCase().replace("/s+/g", ""))
        );
  const handleOptionSelect = (item: Course) => {
    const courseURL = `/course/${item.id}`;
    router.push(courseURL);
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.blur();
      }
      const searchPageUrl = `/course/search?q=${manufacturer}`;
      router.push(searchPageUrl);
    }
  };
  return (
    <div className="search-manufacturer">
      <Combobox>
        <div className="relative w-full">
          <Combobox.Button className="absolute top-[8px]">
            <BiSearchAlt className="text-2xl text-right ml-2" />
          </Combobox.Button>
          <Combobox.Input
            ref={inputRef}
            className="search-manufacturer__input bg-slate-200 border rounded-full w-full h-10 placeholder:font-normal pl-10 text-sm"
            placeholder="Tìm Kiếm Khóa Học"
            displayValue={(manufacturer: string) => manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          ></Combobox.Input>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setManufacturer("")}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filterManufacturer.length === 0 && manufacturer !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filterManufacturer.map((item) => (
                  <Combobox.Option
                    key={item.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-teal-600 text-white" : "text-gray-900"
                      }`
                    }
                    value={item.name}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          tabIndex={0}
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                          onClick={() => handleOptionSelect(item)}
                        >
                          {item.name}
                        </span>
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}

export default SearchBarManufacturer;
