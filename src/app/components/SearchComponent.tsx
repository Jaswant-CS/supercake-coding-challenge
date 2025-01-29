import { Search } from "lucide-react"
interface Props {
    searchQuery: string;
    setSearchQuery: any;
}

const SearchComponent = (props: Props) => {
    const { searchQuery, setSearchQuery } = props;
    return (
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
    )
}
export default SearchComponent