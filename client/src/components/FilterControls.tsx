import { Button, ButtonGroup } from "@chakra-ui/react";
import type { DateFilter } from "../types";

interface FilterControlsProps {
  onFilterChange: (filter: DateFilter) => void;
}

export const FilterControls = ({ onFilterChange }: FilterControlsProps) => {
  return (
    <ButtonGroup size="sm" attached>
      <Button
        backgroundColor="blackAlpha.700"
        _hover={{
          backgroundColor: "blackAlpha.600",
          borderColor: "transparent",
        }}
        _focusVisible={{ outline: "none" }}
        _focus={{ outline: "none" }}
        transition="all 0.2s"
        onClick={() => onFilterChange(1)}
      >
        1 Day
      </Button>
      <Button
        backgroundColor="blackAlpha.800"
        _hover={{
          backgroundColor: "blackAlpha.700",
          borderColor: "transparent",
        }}
        _focusVisible={{ outline: "none" }}
        _focus={{ outline: "none" }}
        transition="all 0.2s"
        onClick={() => onFilterChange(7)}
      >
        7 Days
      </Button>
      <Button
        _hover={{
          backgroundColor: "blackAlpha.700",
          borderColor: "transparent",
        }}
        _focusVisible={{ outline: "none" }}
        _focus={{ outline: "none" }}
        transition="all 0.2s"
        onClick={() => onFilterChange(30)}
      >
        30 Days
      </Button>
    </ButtonGroup>
  );
};
