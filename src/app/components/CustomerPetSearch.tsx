"use client";
import { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Search, ChevronDown, PawPrint, Dog, Cat, Bird, Rabbit, Rat } from "lucide-react";

const petCategories = [
    { name: "Any Animal", icon: "", value: "any" },
    { name: "Dogs", icon: Dog, value: "dog" },
    { name: "Cats", icon: Cat, value: "cat" },
    { name: "Birds", icon: Bird, value: "bird" },
    { name: "Hamsters", icon: Rabbit, value: "hamster" },
    { name: "Rats", icon: Rat, value: "rat" },
];

interface Pet {
    id: string;
    name: string;
    species: string;
}



export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    pets: Pet[];
}

export default function CustomerPetSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPets, setSelectedPets] = useState<string[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [popoverOpen, setPopoverOpen] = useState(false);  // Add state for popover

    const [isExpanded, setIsExpanded] = useState(false);

    const togglePetSelection = (pet: string) => {
        setSelectedPets((prev) =>
            prev.includes(pet) ? prev.filter((p) => p !== pet) : [...prev, pet]
        );
    };

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);

        try {
            const queryParams = new URLSearchParams();
            if (searchQuery) queryParams.append("searchText", searchQuery);
            if (selectedPets.length > 0) queryParams.append("species", selectedPets.join(","));

            const response = await fetch(`/api/customers?${queryParams.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch customers");

            const data = await response.json();
            setCustomers(data.customers || []);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [searchQuery]);

    const togglePopup = () => {
        setIsExpanded((prev) => !prev);
    };



    return (
        <div className="max-w-3xl mx-auto space-y-4 p-6 bg-[#F5F7FA]  m-16" >
            <div>
                <h2 className="text-3xl font-semibold mb-2">Customers and Pets</h2>
                <div className="flex">
                    <div className="flex items-center me-2">
                        <img src="/images/Frame.png" className="text-gray-500 absolute ms-3" />
                        <input
                            type="text"
                            placeholder="Search by ID, name, email or phone"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white p-3 rounded-lg border w-[315px] me-3 h-[40px] focus:outline-none focus:shadow-[0_0_5px_#2981F4] ps-12 "

                        />
                    </div>

                    <div className="flex items-center ">
                        <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <Popover.Trigger asChild>
                                <button onClick={togglePopup} className={`border px-3 h-[40px] rounded-[12px] flex items-center ${selectedPets.length > 0 ? 'bg-[#E8EBF0]' : 'bg-white'} ${isExpanded ? "bg-[#E8EBF0] text-[#121D2C]" : ""
                                    }`}>
                                    {selectedPets.length > 0
                                        ? `${selectedPets.length} selected`
                                        : "Pets"}{" "}
                                    <ChevronDown className="ms-6 mt-1 w-5 h-5" />
                                </button>
                            </Popover.Trigger>
                            <Popover.Content align="start" className=" bg-white shadow-lg rounded-[12px] border w-[335px] mt-2">
                                <div className="grid grid-cols-3 gap-2 p-[20px_10px] ">
                                    {petCategories.map(({ name, icon: Icon, value }) => (
                                        <button
                                            key={name}
                                            onClick={() => togglePetSelection(value)}
                                            className={`flex text-[14px]  h-[30px] flex-row items-center space-y-1 px-1 rounded-3xl text-md border  gap-[5px] justify-center   ${selectedPets.includes(value) ? "bg-blue-600 text-white" : "hover:bg-gray-100 text-[#121D2C]"
                                                }`}
                                        >
                                            {Icon && <Icon className="w-4 h-4  text-[15px]" />}

                                            <span className="!m-0 p-0 ">{name}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className=" flex justify-between border-t border-[#E0E8F2] p-[16px] gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedPets([]);
                                            setCustomers([]);
                                        }}
                                        className="px-5 py-3 font-medium border border-[#E0E8F2] rounded-[12px] hover:bg-gray-100 w-[50%]"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        className="px-5 py-3 bg-[#1369D9] shadow-[inset_0px_-5px_7px_#1160C9] font-medium text-white rounded-[12px] hover:bg-blue-700 w-[50%] shadow-[0_1px_4px_#2981F4]"
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
                    </div>
                </div>
            </div>



            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold mb-2">Customers Data</h3>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) :
                    customers.length === 0 ? (
                        <p className="text-gray-500">No customers found.</p>
                    ) :
                        (
                            <ul className="space-y-3">
                                {customers.map((customer) => (
                                    <li key={customer.id} className="p-3 border rounded-lg shadow-sm">
                                        <h4 className="font-semibold">{customer.name}</h4>
                                        <p className="text-sm text-gray-500">{customer.email} • {customer.phone}</p>
                                        {customer.pets.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {customer.pets.map((pet) => (
                                                    <span
                                                        key={pet.id}
                                                        className="px-2 py-1 text-xs bg-gray-200 rounded-md"
                                                    >
                                                        {pet.name} ({pet.species})
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
            </div>
        </div >
    );
}
