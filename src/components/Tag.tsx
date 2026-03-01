import {useState} from "react";

interface TagProps {
    text: string;
    icon: string;
}

export default function Tag(props: TagProps) {
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <button className={ `tag ${(selected ? 'selected' : '')}` }
            onClick={() => setSelected(!selected)}
        >
            <span className="icon">{props.icon}</span>
            <span className="text">{props.text}</span>
        </button>
    );
}