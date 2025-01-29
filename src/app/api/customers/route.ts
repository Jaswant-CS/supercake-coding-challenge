import data from "./customers.json";

type Pet = {
  id: string;
  name: string;
  species: string;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  pets: Pet[];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchText = searchParams.get("searchText")?.toLowerCase() || "";
  const species =
    searchParams
      .get("species")
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];

  let filteredCustomers: Customer[] = data.customers;

  if (searchText) {
    filteredCustomers = filteredCustomers.filter(
      (customer) =>
        customer.id.toLowerCase() === searchText ||
        customer.name.toLowerCase().includes(searchText) ||
        customer.email.toLowerCase().includes(searchText) ||
        customer.phone.toLowerCase().includes(searchText) ||
        customer.pets.some(
          (pet) =>
            pet.name.toLowerCase().includes(searchText) ||
            pet.id.toLowerCase() === searchText,
        ),
    );
  }

  if (species.length > 0) {
    filteredCustomers = filteredCustomers.filter((customer) =>
      customer.pets.some((pet) => species.includes(pet.species)),
    );
  }

  return new Response(JSON.stringify({ customers: filteredCustomers }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
