"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SelectOptionsProps {
  values: string[];
  defaultValue: string;
  onChange?: (value: string) => void;
  label?: string;
}

export default function SelectOptions({
  values,
  defaultValue,
  onChange,
  label,
}: SelectOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(defaultValue);

  function handleChange(option: string) {
    setCurrentValue(option);
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="absolute top-0"
    >
      {label && (
        <div className="mb-1 ml-2 font-montserrat text-xs light light:text-[#222222] dark:text-[#4d4d4d]">
          {label}
        </div>
      )}
      <div
        className="w-32 rounded-xl p-2 light light:bg-[#ebebeb] light:text-black dark:bg-[#2b2b2b] dark:text-[#b6b6b6]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <p className="font-montserrat text-sm">{currentValue}</p>
          <IoIosArrowDown />
        </div>
      </div>
      <motion.div
        animate={{ scale: isOpen ? 1 : 0.9, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className={`mt-1 flex flex-col gap-2 rounded-xl p-2 pt-2 light light:bg-[#ebebeb] light:text-black dark:bg-[#2b2b2b] dark:text-[#b6b6b6]`}
      >
        {values.map((value) => {
          return (
            <div
              key={value}
              onClick={() => handleChange(value)}
              className="cursor-pointer font-montserrat text-sm text-inherit"
            >
              {value}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
