import searchIcon from "../assets/icons/search.svg";
import "./css/Search.css";
import {useState} from "react";

function Search() {

    const [filterAnimationResetKey, setFilterAnimationResetKey] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);

    const restartFilterAnimation = () => {
        if(filterOpen) return;
        setFilterAnimationResetKey(prevKey => prevKey + 1);
    };

    /*useEffect(() => {
        fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vScjvrdF1f9q1bM8WMFhohaOqAwudfNoyN4BCORkVM3nEcfEa4muQCqdC2u3XXNd-aqWoXywckEGBzm/pubhtml")
        .then(res => res.text()).then(data => {
            console.log(data);
        });

    }, []);*/

    return (
        <div className="search">
            <img src={searchIcon} alt="search" className="search-icon" />
            <input type="search" placeholder="Search resources..." />
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