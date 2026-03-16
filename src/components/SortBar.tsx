import "./css/SortBar.css";
import {useState} from "react";

export default function SortBar() {

    const [freeFirst, setFreeFirst] = useState(false);
    const [az, setAz] = useState(true);

    return (
        <div className="sortbar">
            <button className={"sort-button" + (freeFirst ? " active" : "")} onClick={() => {
                setFreeFirst(!freeFirst);
            }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M22.75 7a.75.75 0 0 1-.75.75H2a.75.75 0 0 1 0-1.5h20a.75.75 0 0 1 .75.75m-3 5a.75.75 0 0 1-.75.75H5a.75.75 0 0 1 0-1.5h14a.75.75 0 0 1 .75.75m-3 5a.75.75 0 0 1-.75.75H8a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 .75.75" clip-rule="evenodd"/></svg>
                <span>Free First</span>
            </button>
            <select
                value={az ? "AZ" : "ZA"}
                onChange={(e) => setAz(e.target.value === "AZ")}
            >
                <option value="AZ">A-Z</option>
                <option value="ZA">Z-A</option>
            </select>
        </div>
    );
}