"use client";
import { useState, useEffect } from "react";
import SearchComponent from "./SearchComponent";
import PopoverComponent from "./PopoverComponent";

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
    const [popoverOpen, setPopoverOpen] = useState(false);

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

    return (
        <div className="max-w-3xl mx-auto space-y-4 p-6 bg-gray-100 rounded-lg shadow-md" >
            <SearchComponent {...{ searchQuery, setSearchQuery }} />
            <div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm border">
                    <PopoverComponent {...{ popoverOpen, setPopoverOpen, selectedPets, setSelectedPets, setCustomers, fetchCustomers, togglePetSelection }} />
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
