import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronsUpDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Step3Props {
  handleNextStep: () => void;
  handlePreviousStep: () => void;
}

export default function Step3({
  handleNextStep,
  handlePreviousStep,
}: Step3Props) {
  const [comboBoxOpen, setComboBoxOpen] = useState(false);
  const [comboBoxValue, setComboBoxValue] = useState("");

  const plantSpicies = [
    {
      value: "rose",
      label: "Rose",
    },
    {
      value: "tulip",
      label: "Tulip",
    },
    {
      value: "orchid",
      label: "Orchid",
    },
    {
      value: "sunflower",
      label: "Sunflower",
    },
    {
      value: "daisy",
      label: "Daisy",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Set Plant Species</h2>
        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src="/species-step.jpg"
            alt="Species Step"
            className="object-cover w-full h-full"
          />
        </div>
        <Popover open={comboBoxOpen} onOpenChange={setComboBoxOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              size="lg"
              aria-expanded={comboBoxOpen}
              className="w-full justify-between"
            >
              {comboBoxValue
                ? plantSpicies.find(
                    (framework) => framework.value === comboBoxValue
                  )?.label
                : "Select plant..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[345px] sm:w-[415px] p-0">
            <Command>
              <CommandInput placeholder="Search plant..." className="h-9" />
              <CommandList>
                <CommandEmpty>No plant spicies found.</CommandEmpty>
                <CommandGroup>
                  {plantSpicies.map((spicies) => (
                    <CommandItem
                      key={spicies.value}
                      value={spicies.value}
                      onSelect={(currentValue) => {
                        setComboBoxValue(
                          currentValue === comboBoxValue ? "" : currentValue
                        );
                        setComboBoxOpen(false);
                      }}
                    >
                      {spicies.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          comboBoxValue === spicies.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-3">
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={handlePreviousStep}
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white"
          onClick={handleNextStep}
          disabled={!comboBoxValue}
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
