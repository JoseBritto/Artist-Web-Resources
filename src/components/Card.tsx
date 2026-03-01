import "./css/Card.css";
import Tag from "./Tag.tsx";

export default function Card() {
    return (
        <div className="card-outer">
            <div className="card">
                <div className="top">
                    <div className="logo">
                        <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://blender.org&size=64" alt="Blender Logo"/>
                    </div>
                    <div className="title">
                        {/*9 character limit on title for same font size*/}
                        {/*upto 13 characters - font should shrink to 0.5x*/}
                        {/*After 13 chars - text ...*/}
                        <div className="text">Blender</div>
                        <button className="category tag">
                            <span className="icon">🧊</span>
                            <span className="text">3D</span>
                        </button>
                    </div>
                </div>
                <hr/>
                <div className="tags">
                    <Tag />
                </div>
                <hr/>
                <div className="bottom">
                    <div className="pricing">
                        Free
                    </div>
                    <div className="link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.5 10.5L21 3m-5 0h5v5m0 6v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>
                    </div>
                </div>
            </div>
        </div>
    );
}