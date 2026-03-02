import searchIcon from "../assets/icons/search.svg";
import "./css/Search.css";
import {useState} from "react";

export interface SearchProps {
    searchText: string;
    setSearchTerm:(term: string) => void
}
function Search(props: SearchProps) {
    const [filterAnimationResetKey, setFilterAnimationResetKey] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);

    const restartFilterAnimation = () => {
        if(filterOpen) return;
        setFilterAnimationResetKey(prevKey => prevKey + 1);
    };

    return (
        <div className="search">
            <img src={searchIcon} alt="search" className="search-icon" />
            <input autoFocus={true} type="search" placeholder="Search resources..."
                   onChange={x => props.setSearchTerm(x.target.value)}
                   value={props.searchText}
            />
            <button
                onClick={() => {
                    setFilterOpen(!filterOpen);
                    restartFilterAnimation();
                }}
                className={"filter-btn " + (filterOpen ? " open " : "")}>
                <svg key={filterAnimationResetKey} className="animated-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-dasharray="54" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.4s" to="1"/></path></svg>
                <svg key={filterAnimationResetKey + "glow"} className="glow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-dasharray="54" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.4s" to="1"/></path></svg>
                <span>Filter</span>
            </button>
        </div>
    );
}

export default Search;