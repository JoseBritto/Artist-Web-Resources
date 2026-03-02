export interface TagProps {
    text: string;
    icon: string;
    selected: boolean;
    onSelectCallback?: (tag: string) => void;
}

export default function Tag(props: TagProps) {

    return (
        <button className={ `tag ${(props.selected ? 'selected' : '')}` }
            onClick={() => props.onSelectCallback && props.onSelectCallback(props.text)}
        >
            <span className="icon">{props.icon}</span>
            <span className="text">{props.text}</span>
        </button>
    );
}