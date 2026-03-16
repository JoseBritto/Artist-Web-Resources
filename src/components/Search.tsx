import searchIcon from "../assets/icons/search.svg";
import "./css/Search.css";
import {useMemo, useRef, useState} from "react";
import type {Site, TextSettings} from "../Helpers/DataHelper.ts";
import {useOutsideClick} from "../Helpers/useOutsideClick.tsx";

export interface SearchProps {
    searchText: string;
    setSearchTerm:(term: string) => void;
    data: Site[];
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
    settings?: Map<string, TextSettings>;
    onTagSelect: (tag: string) => void;
    selectedPricing: string[];
    onPricingSelect: (pricing: string) => void;
}
function Search(props: SearchProps) {
    const [filterAnimationResetKey, setFilterAnimationResetKey] = useState(0);
    const [filterOpen, setFilterOpen] = useState(false);

    const restartFilterAnimation = () => {
        if(filterOpen) return;
        setFilterAnimationResetKey(prevKey => prevKey + 1);
    };

    const categories = useMemo(
        () => [...new Set(props.data?.map(x => x.tags[0]) ?? [])],
        [props.data]
    );

    const tags = useMemo(
        () => [...new Set(props.data?.flatMap(x => x.tags.slice(1)) ?? [])].sort(),
        [props.data]
    );
    const prices = useMemo(
        () => [...new Set(props.data?.map(x => x.pricing) ?? [])],
        [props.data]
    );

    const [categoriesOpen, setCategoriesOpen] = useState(true);
    const [tagsOpen, setTagsOpen] = useState(false);
    const [pricingOpen, setPricingOpen] = useState(false);

    const ref = useRef<HTMLDivElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

    useOutsideClick(ref, btnRef, () => {
        setFilterOpen(false);
    });


    return (
        <div className="search">
            <img src={searchIcon} alt="search" className="search-icon" />
            <input autoFocus={true} type="search" placeholder="Search resources..."
                   onChange={x => props.setSearchTerm(x.target.value)}
                   value={props.searchText}
            />
            <button ref={btnRef}
                onClick={() => {
                    setFilterOpen(!filterOpen);
                    restartFilterAnimation();
                }}
                className={"filter-btn " + (filterOpen ? " open " : "") + (props.selectedTags.length > 0 ? "colored ": "")}>
                <svg key={filterAnimationResetKey} className="animated-svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-dasharray="54" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.4s" to="1"/></path></svg>
                <svg key={filterAnimationResetKey + "glow"} className="glow" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0" stroke="currentColor" stroke-dasharray="54" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 4h14l-5 6.5v9.5l-4 -4v-5.5Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="54;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.7s" dur="0.4s" to="1"/></path></svg>
                <span>Filter</span>
            </button>
            {filterOpen && (
                <div className="filter-popup" ref={ref} >
                    <div className="top">
                        <button
                            onClick={() => {
                                props.setSelectedTags([]);
                            }}
                            className={"filter-reset-btn"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3s-3 1.331-3 3s1.329 3 3 3"/><path fill="currentColor" d="M20.817 11.186a8.9 8.9 0 0 0-1.355-3.219a9 9 0 0 0-2.43-2.43a9 9 0 0 0-3.219-1.355a9 9 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a7 7 0 0 1 2.502 1.053a7 7 0 0 1 1.892 1.892A6.97 6.97 0 0 1 19 13a7 7 0 0 1-.55 2.725a7 7 0 0 1-.644 1.188a7 7 0 0 1-.858 1.039a7.03 7.03 0 0 1-3.536 1.907a7.1 7.1 0 0 1-2.822 0a7 7 0 0 1-2.503-1.054a7 7 0 0 1-1.89-1.89A7 7 0 0 1 5 13H3a9 9 0 0 0 1.539 5.034a9.1 9.1 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9 9 0 0 0 1.814-.183a9 9 0 0 0 3.218-1.355a9 9 0 0 0 1.331-1.099a9 9 0 0 0 1.1-1.332A8.95 8.95 0 0 0 21 13a9 9 0 0 0-.183-1.814"/></svg>
                            <span>Reset</span>
                        </button>
                    </div>
                    <div className="body">
                        <div className={"categories container " + (categoriesOpen ? "open ": "") }>
                            <div className="container-header"
                                 onClick={() => {
                                     if(!categoriesOpen) {
                                         setTagsOpen(false);
                                         setPricingOpen(false);
                                     }
                                     setCategoriesOpen(!categoriesOpen);
                                 }}>
                                <span className="title">Categories</span>
                                <hr/>
                            </div>
                            <div className="container-content">
                                {categories.map((x, i) => (
                                    <button key={i} className={"small-btn " + (props.selectedTags.includes(x) ? " selected" : "")}
                                        onClick={() => {
                                            props.selectedTags.forEach(item => {
                                                //Deselect any selected categories first!
                                                if (x !== item && categories.includes(item)){
                                                    props.onTagSelect(item);
                                                }
                                            })
                                            props.onTagSelect(x);
                                        }}>
                                        {props.settings?.get(x)?.emoji ?? ""}{x}
                                    </button>
                                ))}
                            </div>
                            <div className="container-content selected-container">
                                {categories.filter(x => props.selectedTags.includes(x)).slice(0, 6).map((x, i) => (
                                    <button key={i} className={"small-btn " + (props.selectedTags.includes(x) ? " selected" : "")}
                                            onClick={() => {
                                                props.selectedTags.forEach(item => {
                                                    //Deselect any selected categories first!
                                                    if (x !== item && categories.includes(item)){
                                                        props.onTagSelect(item);
                                                    }
                                                })
                                                props.onTagSelect(x);
                                            }}>
                                        {props.settings?.get(x)?.emoji ?? ""}{x}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={"tags container " + (tagsOpen ? "open ": "")}>
                            <div className="container-header"
                                 onClick={() => {
                                     if(!tagsOpen) {
                                         setCategoriesOpen(false);
                                         setPricingOpen(false);
                                     }
                                     setTagsOpen(!tagsOpen);
                                 }}>
                                <span className="title">Tags</span>
                                <hr/>
                            </div>
                            <div className="container-content">
                                {tags.map((x, i) => (
                                    <button key={i} className={"small-btn " + (props.selectedTags.includes(x) ? " selected" : "")}
                                        onClick={() => {
                                            props.onTagSelect(x);
                                        }}>
                                        {props.settings?.get(x)?.emoji ?? ""}{x}
                                    </button>
                                ))}
                            </div>
                            <div className="container-content selected-container">
                                {tags.filter(x => props.selectedTags.includes(x)).slice(0, 6).map((x, i) => (
                                    <button key={i} className={"small-btn " + (props.selectedTags.includes(x) ? " selected" : "")}
                                            onClick={() => {
                                                props.onTagSelect(x);
                                            }}>
                                        {props.settings?.get(x)?.emoji ?? ""}{x}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={"pricing container " + (pricingOpen ? "open ": "")}>
                            <div className="container-header"
                                onClick={() => {
                                    if(!pricingOpen) {
                                        setTagsOpen(false);
                                        setCategoriesOpen(false);
                                    }
                                    setPricingOpen(!pricingOpen);
                                }}>
                                <span className="title">Price</span>
                                <hr/>
                            </div>
                            <div className="container-content">
                                {prices.map((x, i) => (
                                    <button key={i} className={"small-btn" +  (props.selectedPricing.includes(x) ? " selected" : "")}
                                            onClick={() => {
                                                props.onPricingSelect(x);
                                            }}>
                                        {props.settings?.get(x)?.emoji ?? ""}{x}
                                    </button>
                                ))}
                            </div>
                            <div className="container-content selected-container">
                                {prices.filter(x => props.selectedPricing.includes(x)).map((x, i) => (
                                    <button key={i} className={"small-btn" +  (props.selectedPricing.includes(x) ? " selected" : "")}
                                            onClick={() => {
                                                props.onPricingSelect(x);
                                            }}>
                                        {props.settings?.get(x)?.emoji ?? ""}{x}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;