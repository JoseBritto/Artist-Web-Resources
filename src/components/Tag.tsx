import {useState} from "react";

export default function Tag() {
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <button className={ `tag ${(selected ? 'selected' : '')}` }
            onClick={() => setSelected(!selected)}
        >
            <span className="icon">🔧</span>
            <span className="text">Tool</span>
        </button>
    );
}