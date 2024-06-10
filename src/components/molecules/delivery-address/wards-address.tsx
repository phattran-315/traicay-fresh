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
import type { DeliveryAddressProps } from ".";
import { FieldError } from "react-hook-form";

interface WardAddressProps extends Pick<DeliveryAddressProps,'onSetWard'> {
  defaultValue?: string;
  districtId: number | null;
  error?:FieldError
}

const WardAddress = ({
  onSetWard,
  error,
  districtId,
  defaultValue,
}: WardAddressProps) => {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const {data:wardsResult,refetch:getWards}=trpc.address.getHcmWards.useQuery({districtId:districtId||1},{enabled:false})
  const wardsData=wardsResult?.wards||[]
  const wards = wardsData.filter((w) =>
    Number.isNaN(Number(w.WardName))
  );
  // when change the district reset the value
  const isDistrictChange = wards.find((ward) => ward.WardName === value);

  useEffect(() => {
    
    if (defaultValue) {
      setValue(defaultValue);
    }
    if (districtId) {
      getWards();
    }
  }, [districtId, defaultValue,getWards]);
  useEffect(() => {
    if (!isDistrictChange) {
      setValue("");
      onSetWard("");
    }
  }, [isDistrictChange, onSetWard]);
  useEffect(() => {
    if (defaultValue) {
      onSetWard(defaultValue);
    }
  }, [defaultValue, onSetWard]);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          data-cy='ward-address-btn'
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
            ? wards?.find((ward) => ward.WardName === value)?.WardName
            : "Chọn Phường / Xã"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandInput placeholder='Tìm kiếm quận huyện' />
          <CommandList>
            <CommandEmpty>
              {!value
                ? "Vui long chọn Quận / Huyện trước"
                : "Không có kết quả nào được tìm thấy"}
            </CommandEmpty>
            <CommandGroup>
              {wards?.map((ward) => (
                <CommandItem
                  data-cy='ward-address-item'
                  key={ward.WardName}
                  value={ward.WardName}
                  className='hover:bg-red'
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    onSetWard(ward.WardName);
                    setOpen(false);
                  }}
                >
                  <IoCheckmarkOutline
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === ward.WardName ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ward.WardName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default memo(WardAddress);
