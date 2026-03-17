import "./css/Contact.css";
import {useState} from "react";

export default function Contact() {

    const [text, setText] = useState("");
    const [name, setName] = useState("");

    return (
        <div className="contact">

            <hr/>
            <p className="text">Have a suggestion? Reach out to us at <a href="mailto:dj3d.contact@gmail.com" target="_blank">dj3d.contact@gmail.com</a> or use the form below </p>



{/*
            <p className="text">Suggestion box</p>
*/}
            <form onSubmit={(e) => {
                if(text.trim().length === 0){
                    return;
                }
                if(name.trim().length === 0){
                    return;
                }
                e.preventDefault();
                window.open("mailto:dj3d.contact@gmail.com?subject=" + encodeURIComponent(name + "'s") + "%20Feedback&body=" + encodeURIComponent(text) + encodeURIComponent("\n\nThanks,\n") + encodeURIComponent(name), "_blank");
            }}>
                <textarea placeholder="Suggestion/Feedback here..." onChange={(e) => {
                    setText(e.target.value);
                }} value={text} required={true} />
                <fieldset>
                    <input type="text" placeholder="Your Name" value={name}
                           onChange={(e) => setName(e.target.value)} required={true} />

                    <input type="text" placeholder="Your Email" />
                    <button type="submit">Send</button>
                </fieldset>
            </form>
        </div>
    );
}