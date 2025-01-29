"use client";
import { useState, useEffect } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Search, ChevronDown, PawPrint, Dog, Cat, Bird, Rabbit, Rat } from "lucide-react";

const petCategories = [
    { name: "Any Animal", icon: PawPrint, value: "any" },
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

interface Customer {
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
        if (searchQuery) {
            fetchCustomers();
        }
    }, [searchQuery]);

    return (
        <div className="max-w-3xl mx-auto space-y-4 p-6 bg-gray-100 rounded-lg shadow-md" >
            <div>
                <h2 className="text-3xl font-semibold mb-2">Customers and Pets</h2>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border">
                    <Search className="text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by ID, name, email or phone"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 outline-none border-none bg-transparent"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border">
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
                                        <Icon className="w-4 h-4" />
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
                </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-md font-semibold mb-2">Search Results</h3>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="h-6 bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : customers.length === 0 ? (
                    <p className="text-gray-500">No customers found.</p>
                ) : (
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
