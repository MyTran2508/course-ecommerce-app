import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { AiFillCaretDown, AiOutlineCheck } from "react-icons/ai";
import { ComboBoxType } from "@/utils/data";

interface ComboBoxProps {
  data: ComboBoxType[];
  onChange: (value: string) => void;
  value: number;
}

export default function MyCombobox(props: ComboBoxProps) {
  const { data, onChange, value } = props;
  const [selectedData, setSelectedData] = useState(data[value]);

  const handleOnChange = (data: ComboBoxType) => {
    setSelectedData(data);
    onChange(data.id);
  };

  return (
    <Combobox value={selectedData} onChange={handleOnChange}>
      <div className="relative mt-1">
        <div className="relative w-1/4 ">
          <Combobox.Input
            className=" border text-center border-black py-2 pl-3 pr-2 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(person: any) => person.name}
            readOnly={true}
          />
          <Combobox.Button className="absolute top-3 left-1 flex items-center w-max">
            <AiFillCaretDown className=" text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Combobox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md w-max bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {data.map((item) => (
              <Combobox.Option
                key={item.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-teal-600 text-white" : "text-gray-900"
                  }`
                }
                value={item}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {item.name}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? "text-white" : "text-teal-600"
                        }`}
                      >
                        <AiOutlineCheck
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
