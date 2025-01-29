import * as Popover from "@radix-ui/react-popover";
import { Customer } from "./CustomerPetSearch";
import { ChevronDown, LucideIcon, PawPrint, Dog, Cat, Bird, Rabbit, Rat } from "lucide-react";

interface PetCategory {
    name: string;
    icon: LucideIcon;
    value: string;
}

interface Props {
    popoverOpen: boolean;
    setPopoverOpen: (value: boolean) => void;
    selectedPets: string[];
    setSelectedPets: (value: string[]) => void;
    setCustomers: (value: Customer[]) => void;
    fetchCustomers: () => void;
    togglePetSelection: (pet: string) => void;

}
const petCategories: PetCategory[] = [
    { name: "Any Animal", icon: PawPrint, value: "any" },
    { name: "Dogs", icon: Dog, value: "dog" },
    { name: "Cats", icon: Cat, value: "cat" },
    { name: "Birds", icon: Bird, value: "bird" },
    { name: "Hamsters", icon: Rabbit, value: "hamster" },
    { name: "Rats", icon: Rat, value: "rat" },
];

const PopoverComponent = (props: Props) => {
    const { popoverOpen, setPopoverOpen, selectedPets, setSelectedPets, setCustomers, fetchCustomers, togglePetSelection } = props;
    return (
        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
            <Popover.Trigger asChild>
                <button className="border px-3 py-1 rounded-lg flex items-center">
                    {selectedPets.length > 0
                        ? `${selectedPets.length} selected`
                        : "Pets"}{" "}
                    <ChevronDown className="ml-2 w-4 h-4" />
                </button>
            </Popover.Trigger>
            <Popover.Content align="start" className="p-4 w-xs bg-white shadow-lg rounded-lg border">
                <div className="grid grid-cols-3 gap-2">
                    {petCategories.map(({ name, icon: Icon, value }) => (
                        <button
                            key={name}
                            onClick={() => togglePetSelection(value)}
                            className={`flex flex-row items-center space-y-1 p-3 rounded-3xl text-sm border w-full gap-[5px] justify-center  ${selectedPets.includes(value) ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                                }`}
                        >
                            <Icon className={"w-4 h-4"} />
                            <span>{name}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-4 flex justify-between">
                    <button
                        onClick={() => {
                            setSelectedPets([]);
                            setCustomers([]);
                        }}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                    >
                        Reset
                    </button>
                    <button
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        onClick={() => {
                            fetchCustomers();
                            setPopoverOpen(false);
                        }}
                    >
                        Apply Filters
                    </button>
                </div>
            </Popover.Content>
        </Popover.Root>
    )
}
export default PopoverComponent;