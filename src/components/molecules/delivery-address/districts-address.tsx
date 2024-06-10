"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { trpc } from "@/trpc/trpc-client";
import { DeliveryAddressProps } from ".";
import { FieldError } from "react-hook-form";

interface DistrictAddressProps
  extends Pick<DeliveryAddressProps, "onSetDistrict"> {
  defaultValue?: string;
  error?:FieldError,
  currentSelectedDistrictId: number | null;
  onSetDistrictId: (id: number) => void;
}
function DistrictAddress({
  currentSelectedDistrictId,
  onSetDistrict,
  error,
  defaultValue,
  onSetDistrictId,
}: DistrictAddressProps) {
  const [value, setValue] = useState(defaultValue || "");
  const { data: districtResultResponse } = trpc.address.getHcmDistricts.useQuery();
  const districts = (districtResultResponse ? districtResultResponse?.districts! : []).filter(
    // filter some weird value
    (d) => d.DistrictName !== "33" && d.DistrictName !== "Quận mới"
  )!;
  const isDistrictChanged = districts!?.find(
    (district) => district.DistrictID === currentSelectedDistrictId
  );

  useEffect(() => {
    if (!isDistrictChanged) {
      // reset the selected District
      onSetDistrict("");
    }
  }, [isDistrictChanged, onSetDistrict]);
  useEffect(() => {
    // if have default value set DistrictId
    if (defaultValue) {
      //
      onSetDistrict(defaultValue);
      const districtId = districts.find(
        (district) => district.DistrictName === defaultValue
      );
      districtId && onSetDistrictId(districtId.DistrictID);
    }
  }, [defaultValue, onSetDistrictId, districts, onSetDistrict]);
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-cy='district-address-btn'
          variant='outline'
          className={cn(
            "w-full text-start flex justify-start border-gray-200 text-muted-foreground hover:bg-background focus-visible:border-primary",
            {
              "text-gray-800 border-gray-500": value,
              "invalid-input":error
            }
          )}
        >
          {value
            ? districts.find((district) => district.DistrictName === value)
                ?.DistrictName
            : "Chọn Quận / Huyện"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder='Tìm kiếm quận huyện' />
          <CommandList>
            <CommandEmpty>Không có kết quả nào được tìm thấy</CommandEmpty>
            <CommandGroup>
              {districts.map((district) => (
                <CommandItem
                  data-cy='district-address-item'
                  key={district.DistrictName}
                  value={district.DistrictName}
                  className='hover:bg-red'
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSetDistrictId(district.DistrictID);
                    onSetDistrict(district.DistrictName);
                    setOpen(false);
                  }}
                >
                  <IoCheckmarkOutline
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === district.DistrictName
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {district.DistrictName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default memo(DistrictAddress);
