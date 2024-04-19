import { ComboBoxType } from "@/utils/data";
import { Disclosure } from "@headlessui/react";
import React, { Fragment } from "react";
import { HiChevronUp } from "react-icons/hi";
import { v4 as uuidv4 } from "uuid";

interface DiscussionFilterProps {
  data: ComboBoxType[];
  label: string;
  selectedList: string[];
  setSelectedList: React.Dispatch<React.SetStateAction<string[]>>;
}

function DiscussionFilter(props: DiscussionFilterProps) {
  const { data, label, setSelectedList, selectedList } = props;

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    itemId: string,
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const isChecked = event.target.checked;

    if (isChecked) {
      setSelectedItems((prevItems) => [...prevItems, itemId]);
    } else {
      setSelectedItems((prevItems) => prevItems.filter((id) => id !== itemId));
    }
  };

  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="border-t flex w-full justify-between py-4 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 border-back">
              <div className="flex flex-between w-full">
                <span className="text-md ">{label}</span>
                <HiChevronUp
                  className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
                />
              </div>
            </Disclosure.Button>
            <div className="text-sm">
              {open ? (
                <Fragment>
                  <div className="mb-6">
                    {data.map((item) => {
                      const checkId = uuidv4();
                      return (
                        <div
                          key={item.id}
                          className="flex item-center gap-3 mb-3"
                        >
                          <input
                            type="checkbox"
                            id={checkId}
                            value={item.id}
                            checked={selectedList.includes(item.id)}
                            onChange={(event) =>
                              handleCheckboxChange(
                                event,
                                item.id,
                                setSelectedList
                              )
                            }
                            className={`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`}
                          />
                          <label htmlFor={checkId}>{item.name}</label>
                        </div>
                      );
                    })}
                  </div>
                </Fragment>
              ) : null}
            </div>
          </>
        )}
      </Disclosure>
    </div>
  );
}

export default DiscussionFilter;
