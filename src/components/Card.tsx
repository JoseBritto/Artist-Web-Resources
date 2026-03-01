import "./css/Card.css";
import Tag from "./Tag.tsx";

interface CardProps {
    title: string;
    categoryText: string;
    categoryIcon: string;
    tags: TagData[],
    pricing: string,
    url: string,
}

interface TagData {
    text: string;
    icon: string;
}

export default function Card(props: CardProps) {
    return (
        <div className="card-outer">
            <div className="card">
                <div className="top">
                    <div className="logo">
                        <img src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${props.url}&size=64`} alt="Blender Logo"/>
                    </div>
                    <div className="title">
                        {/*9 character limit on title for same font size*/}
                        {/*upto 13 characters - font should shrink to 0.5x*/}
                        {/*After 13 chars - text ...*/}
                        <div className="text">{props.title}</div>
                        <button className="category tag">
                            <span className="icon">{props.categoryIcon}</span>
                            <span className="text">{props.categoryText}</span>
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="tags">
                    {props.tags.map((tag, i) => {
                        return (
                            <Tag key={i} icon={tag.icon} text={tag.text} />
                        );
                    })}
                </div>
                <hr/>
                <div className="bottom">
                    <div className="pricing">
                        {props.pricing}
                    </div>
                    <div className="link" tabIndex={0} onClick={() => window.open(props.url, "_blank")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 10.5L21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}