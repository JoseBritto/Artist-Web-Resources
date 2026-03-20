import "./css/SideBar.css";
import type {Site, TextSettings} from "../Helpers/DataHelper.ts";
import {useMemo} from "react";

export interface SideBarProps {
    data: Site[];
    selectedTags: string[];
    setSelectedTags: (tags: string[]) => void;
    settings?: Map<string, TextSettings>;
    onTagSelect: (tag: string) => void;
    selectedPricing: string[];
    onPricingSelect: (pricing: string) => void;
    setSelectedPricing: (pricing: string[]) => void;
}

export default function SideBar(props: SideBarProps) {

    const categories = useMemo(
        () => [...new Set(props.data?.map(x => x.tags[0]) ?? [])],
        [props.data]
    );
    const prices = ["Free", "Mostly Free", "Balanced", "Mostly Paid", "Paid", "Subscription"];

    return (
        <aside className="sidebar">
            <section className="sidebar-section">
                <div className="title-container">
                    <span className="title">
                        Categories
                    </span>
                </div>
                <div className="content-container">
                    {categories.map((x, i) => (
                        <button key={i} className={"sidebar-btn " + (props.selectedTags.includes(x) ? " selected" : "")}
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
            </section>
            <section className="sidebar-section">
                <div className="title-container">
                    <span className="title">
                        Pricing
                    </span>
                </div>
                <div className="content-container">
                    {prices.map((x, i) => (
                        <button key={i} className={"sidebar-btn " + (props.selectedPricing.includes(x) ? " selected" : "")}
                                onClick={() => {
                                    props.onPricingSelect(x);
                                }}
                                style={{
                                    color: (props.selectedPricing.includes(x) ? (props.settings?.get(x)?.color ?? "inherit" ) : "inherit")
                                }}
                        >
                            {props.settings?.get(x)?.emoji ?? ""}{x}
                        </button>
                    ))}
                </div>
            </section>

        </aside>
    );
}